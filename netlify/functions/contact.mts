/**
 * Contact form handler.
 *
 * Recipient email lookup:
 *   recipientId from the request body is matched against the `id` column of a
 *   Google Sheet to resolve the recipient's email. The sheet is expected to
 *   have a header row and columns: A=id, B=name, C=email, D=githubid.
 *
 *   Required env vars:
 *     CONTACTS_SHEET_ID                  — spreadsheet ID (from the sheet URL)
 *     GOOGLE_SERVICE_ACCOUNT_EMAIL       — service account client_email
 *     GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY — service account private_key (PEM)
 *
 *   The sheet must be shared (at least Viewer) with the service account email.
 *
 * Email sending:
 *   Uses the Netlify Email Integration with Mailgun. The integration must be
 *   configured with the required env vars.
 *   see: https://docs.netlify.com/extend/install-and-use/setup-guides/email-integration/#required-environment-variables
 *   The email template lives at emails/contact/index.html.
 */

import { createSign } from "node:crypto";

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

async function getSheetsAccessToken(): Promise<string> {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    if (!clientEmail || !rawKey) {
        throw new Error("Google service account credentials missing");
    }
    // Netlify may store the key with literal \n escapes; normalize to real newlines.
    const privateKey = rawKey.replace(/\\n/g, "\n");

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claim = {
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
    };
    const encode = (obj: object) =>
        Buffer.from(JSON.stringify(obj)).toString("base64url");
    const unsigned = `${encode(header)}.${encode(claim)}`;
    const signer = createSign("RSA-SHA256");
    signer.update(unsigned);
    const signature = signer.sign(privateKey).toString("base64url");
    const jwt = `${unsigned}.${signature}`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt,
        }),
    });
    if (!tokenRes.ok) {
        throw new Error(`Google token exchange failed: ${tokenRes.status}`);
    }
    const data = (await tokenRes.json()) as { access_token?: string };
    if (!data.access_token) {
        throw new Error("Google token response missing access_token");
    }
    return data.access_token;
}

async function lookupRecipientEmail(recipientId: string): Promise<string | undefined> {
    const sheetId = process.env.CONTACTS_SHEET_ID;
    if (!sheetId) throw new Error("CONTACTS_SHEET_ID missing");
    const token = await getSheetsAccessToken();
    const range = encodeURIComponent("Sheet1!A:C");
    const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
        throw new Error(`Sheets read failed: ${res.status}`);
    }
    const data = (await res.json()) as { values?: string[][] };
    const rows = data.values ?? [];
    for (let i = 1; i < rows.length; i++) {
        const [id, , email] = rows[i];
        if (id === recipientId && email) return email;
    }
    return undefined;
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

    let recipientEmail: string | undefined;
    try {
        recipientEmail = await lookupRecipientEmail(body.recipientId);
    } catch (error) {
        console.error("Contact lookup failed:", error);
        return new Response(
            JSON.stringify("Contact lookup failed"),
            { status: 502 }
        );
    }
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
