/**
 * Contact email body, ported from the former Netlify email template.
 * Rendered here rather than in the Make scenario so the copy stays in git.
 */

interface ContactEmailParams {
    ideaTitle: string;
    message: string;
    senderEmail: string;
    senderName: string;
}

const HTML_ESCAPES: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

// Every field here is public form input interpolated into markup.
function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function renderContactEmail({
    ideaTitle,
    message,
    senderEmail,
    senderName,
}: ContactEmailParams): string {
    const name = escapeHtml(senderName);
    const email = escapeHtml(senderEmail);
    const idea = escapeHtml(ideaTitle);
    // <p> collapses newlines, so keep the sender's line breaks
    const body = escapeHtml(message).replace(/\n/g, "<br />");

    return `<html>
  <body
    style="
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 24px auto;
        background-color: #ffffff;
        border-radius: 8px;
        padding: 32px;
      "
    >
      <h2 style="margin-top: 0;">New message from the Idea Board</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Regarding idea:</strong> ${idea}</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;" />
      <p>${body}</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;" />
      <p style="font-size: 12px; color: #888;">
        You can reply directly to ${name} at
        <a href="mailto:${email}">${email}</a>.
      </p>
    </div>
  </body>
</html>`;
}
