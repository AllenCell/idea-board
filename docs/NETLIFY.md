# Netlify Setup

## Prerequisites

- [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed (`npm install netlify-cli -g`)
- Access to the team's Netlify site (ask a team member for the site ID)

## Initial Setup

1. Log in to Netlify:
   ```sh
   npx netlify login
   ```
   If you encounter stale sessions, run `npx netlify logout` first.

2. Link the project to the Netlify site:
   ```sh
   npx netlify link
   ```
   Use the site ID from the Netlify admin dashboard when prompted.

3. Verify environment variables are available:
   ```sh
   npx netlify env:list
   ```

4. Copy `docs/.env.example` to `.env` in the project root and fill in the values:
   ```sh
   cp docs/.env.example .env
   ```
   `NETLIFY_EMAILS_DIRECTORY` must be set to the **absolute path** to the `emails/` directory in your local checkout (e.g., `/Users/you/work/idea-board/emails`). This is only needed locally — the build plugin handles this automatically in production.

## Local Development

```sh
npx netlify dev
```

This starts the Gatsby dev server with Netlify Functions available at `/.netlify/functions/`.

> **Note:** `@netlify/plugin-gatsby` in `netlify.toml` is required for `netlify dev` to correctly detect and build the Gatsby project. Without it, you may see 404s or need workarounds like `--framework=#static`.

## Email Integration

The project uses the [Netlify Email Integration](https://docs.netlify.com/extend/install-and-use/setup-guides/email-integration/) with Mailgun to send contact form emails.

### How it works

1. A user submits the contact form, which calls the `contact` Netlify Function.
2. The function resolves the recipient's email from an environment variable keyed by their `contactId`.
3. The function calls the internal `/.netlify/functions/emails/contact` endpoint, which renders the Handlebars template at `emails/contact/index.html` and sends it via Mailgun.

### Required environment variables

Set these in the Netlify UI (under **Site configuration > Environment variables**) for production, and in your local `.env` for development. See `docs/.env.example` for reference.

| Variable | Description | Production | Local |
|---|---|---|---|
| `NETLIFY_EMAILS_PROVIDER` | Must be `mailgun` | Yes | Yes |
| `NETLIFY_EMAILS_PROVIDER_API_KEY` | Mailgun API key | Yes | Yes |
| `NETLIFY_EMAILS_SECRET` | Shared secret for internal email requests | Yes | Yes |
| `NETLIFY_EMAILS_MAILGUN_DOMAIN` | Mailgun sending domain | Yes | Yes |
| `NETLIFY_EMAILS_MAILGUN_HOST_REGION` | `non-eu` or `eu` | Yes | Yes |
| `NETLIFY_EMAILS_DIRECTORY` | Absolute path to `emails/` directory | No | Yes |

Each contactable person also needs an environment variable where the key matches their `contactId` (from their allenite frontmatter) and the value is their email address. For example, if `contactId` is `SOME_SCIENTIST`, set `SOME_SCIENTIST=someone@somewhere.com`.

### Email templates

Templates live in `emails/`. Each subdirectory corresponds to a template name, containing an `index.html` file with Handlebars syntax for variable interpolation. See the [Netlify Email Integration docs](https://docs.netlify.com/extend/install-and-use/setup-guides/email-integration/#add-email-templates) for details.
