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

// user@domain.tld — no whitespace, requires exactly one @, at least one dot in domain
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// CR/LF in header-interpolated fields enables email header injection
const HEADER_INJECTION_RE = /[\r\n]/;

function validateRequest(body: unknown): body is ContactRequest {
    if (typeof body !== "object" || body === null) return false;
    const b = body as Record<string, unknown>;
    return (
        typeof b.senderName === "string" && b.senderName.length > 0 &&
        !HEADER_INJECTION_RE.test(b.senderName) &&
        typeof b.senderEmail === "string" && EMAIL_RE.test(b.senderEmail) &&
        typeof b.recipientName === "string" && b.recipientName.length > 0 &&
        typeof b.recipientId === "string" && b.recipientId.length > 0 &&
        typeof b.message === "string" && b.message.length > 0
    );
}

export default async function (request: Request) {
    if (request.method !== "POST") {
        return new Response(JSON.stringify("Method not allowed"), { status: 405 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify("Invalid JSON"), { status: 400 });
    }

    if (!validateRequest(body)) {
        return new Response(JSON.stringify("Missing or invalid fields"), { status: 400 });
    }

    const recipientEmail = process.env[body.recipientId];
    if (!recipientEmail) {
        return new Response(
            JSON.stringify("No email stored for submitted contact ID"),
            { status: 400 }
        );
    }

    const baseUrl = new URL(request.url).origin;
    const emailsSecret = process.env.NETLIFY_EMAILS_SECRET;
    const from = process.env.NETLIFY_EMAILS_FROM
        ?? (process.env.NETLIFY_EMAILS_MAILGUN_DOMAIN
            ? `noreply@${process.env.NETLIFY_EMAILS_MAILGUN_DOMAIN}`
            : undefined);

    if (!emailsSecret || !from) {
        console.error("Email service misconfigured:", { emailsSecret: !!emailsSecret, from: !!from });
        return new Response(
            JSON.stringify("Email service not configured"),
            { status: 500 }
        );
    }

    let emailResponse: Response;
    try {
        emailResponse = await fetch(
            `${baseUrl}/.netlify/functions/emails/contact`,
            {
                method: "POST",
                headers: {
                    "netlify-emails-secret": emailsSecret,
                },
                body: JSON.stringify({
                    from,
                    reply_to: body.senderEmail,
                    to: recipientEmail,
                    subject: `Idea Board: message from ${body.senderName}`,
                    parameters: {
                        senderName: body.senderName,
                        senderEmail: body.senderEmail,
                        message: body.message,
                        ideaTitle: body.ideaTitle ?? "N/A",
                    },
                }),
            }
        );
    } catch (error) {
        console.error("Error calling email function:", error);
        return new Response(
            JSON.stringify("Failed to send email"),
            { status: 502 }
        );
    }

    if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("Email send failed:", emailResponse.status, errorText);
        return new Response(
            JSON.stringify("Failed to send email"),
            { status: 502 }
        );
    }

    return new Response(JSON.stringify("Message sent"), { status: 200 });
}
