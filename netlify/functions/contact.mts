/**
 * Contact form handler.
 *
 * Recipient email lookup:
 *   recipientId from the request body is used as an environment variable name
 *   to resolve the recipient's email address. For each contactable person,
 *   set an env var where the key matches their contactId (as defined in their
 *   allenite markdown frontmatter) and the value is their email address.
 *
 *   Example: if contactId is "SOME_SCIENTIST", set env var SOME_SCIENTIST=someone@somewhere.com
 *
 * Email sending:
 *   Uses the Netlify Email Integration with Mailgun. The integration must be
 *   configured with the required env vars.
 *   see: https://docs.netlify.com/extend/install-and-use/setup-guides/email-integration/#required-environment-variables
 *   The email template lives at emails/contact/index.html.
 */

interface ContactRequest {
    senderName: string;
    senderEmail: string;
    recipientName: string;
    recipientId: string;
    message: string;
    ideaTitle?: string;
}

function validateRequest(body: unknown): body is ContactRequest {
    if (typeof body !== "object" || body === null) return false;
    const b = body as Record<string, unknown>;
    return (
        typeof b.senderName === "string" && b.senderName.length > 0 &&
        typeof b.senderEmail === "string" && b.senderEmail.includes("@") &&
        typeof b.recipientName === "string" && b.recipientName.length > 0 &&
        typeof b.recipientId === "string" && b.recipientId.length > 0 &&
        typeof b.message === "string" && b.message.length > 0
    );
}

export default async function (request: Request) {
    console.log("[contact] Received request:", request.method);

    if (request.method !== "POST") {
        return new Response(JSON.stringify("Method not allowed"), { status: 405 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        console.error("[contact] Failed to parse request body");
        return new Response(JSON.stringify("Invalid JSON"), { status: 400 });
    }

    console.log("[contact] Parsed body:", JSON.stringify(body));

    if (!validateRequest(body)) {
        console.error("[contact] Validation failed");
        return new Response(JSON.stringify("Missing or invalid fields"), { status: 400 });
    }

    const recipientEmail = process.env[body.recipientId];
    console.log("[contact] Recipient lookup:", body.recipientId, "→", recipientEmail ? "(found)" : "(not found)");
    if (!recipientEmail) {
        return new Response(
            JSON.stringify("No email stored for submitted contact ID"),
            { status: 400 }
        );
    }

    const emailUrl = `${process.env.URL}/.netlify/functions/emails/contact`;
    const emailPayload = {
        from: process.env.NETLIFY_EMAILS_FROM ?? `noreply@${process.env.NETLIFY_EMAILS_MAILGUN_DOMAIN}`,
        reply_to: body.senderEmail,
        to: recipientEmail,
        subject: `Idea Board: message from ${body.senderName}`,
        parameters: {
            senderName: body.senderName,
            senderEmail: body.senderEmail,
            message: body.message,
            ideaTitle: body.ideaTitle ?? "N/A",
        },
    };

    console.log("[contact] Sending email to:", emailUrl);
    console.log("[contact] Email payload:", JSON.stringify(emailPayload));

    const emailResponse = await fetch(emailUrl, {
        method: "POST",
        headers: {
            "netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET as string,
        },
        body: JSON.stringify(emailPayload),
    });

    const responseText = await emailResponse.text();
    console.log("[contact] Email endpoint responded:", emailResponse.status, responseText);

    if (!emailResponse.ok) {
        return new Response(
            JSON.stringify("Failed to send email"),
            { status: 502 }
        );
    }

    return new Response(JSON.stringify("Message sent"), { status: 200 });
}
