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
 */

interface ContactRequest {
    senderName: string;
    senderEmail: string;
    recipientName: string;
    recipientId: string;
    message: string;
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

    const email = process.env[body.recipientId];
    if (!email) {
        return new Response(
            JSON.stringify("No email stored for submitted contact ID"),
            { status: 400 }
        );
    }

    // TODO: send email using email service
    return new Response(JSON.stringify("Message sent"), { status: 200 });
}
