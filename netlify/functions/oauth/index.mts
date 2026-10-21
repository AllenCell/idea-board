/**
 * Decap CMS OAuth provider backed by a GitHub App.
 *
 * Implements the two-endpoint token exchange Decap expects from an external
 * OAuth provider (https://decapcms.org/docs/external-oauth-clients/):
 *
 *   GET /oauth          — redirects the CMS login popup to GitHub's authorize
 *                         page, setting a state cookie for CSRF protection.
 *   GET /oauth/callback — verifies state, exchanges GitHub's one-time code for
 *                         a user access token (server-side; the only step that
 *                         touches the client secret), and hands the token to
 *                         the CMS opener window via the postMessage handshake.
 *
 * The registered app must be a GitHub App (not an OAuth App): its user tokens
 * are scoped to app permissions ∩ installed repos ∩ the user's own access, so
 * they cannot reach beyond AllenCell/idea-board. See docs/cms-auth.md for the
 * GitHub App settings, verification steps, and secret rotation.
 *
 * Required env vars (Functions-scoped, marked secret in Netlify):
 *   OAUTH_GITHUB_CLIENT_ID     — the GitHub App's client ID
 *   OAUTH_GITHUB_CLIENT_SECRET — a client secret generated for the App
 *
 * The GitHub App's callback URL must be exactly <site origin>/oauth/callback,
 * and base_url in static/admin/config.yml must be that same origin.
 */
import type { Config } from "@netlify/functions";
import { randomBytes } from "node:crypto";

import {
    GITHUB_TOKEN_URL,
    PROVIDER,
    REPO,
    STATE_COOKIE,
    buildAuthorizeUrl,
    clearStateCookie,
    errorMessage,
    hasWriteAccess,
    makeStateCookie,
    parseCookies,
    renderCallbackPage,
    successMessage,
} from "./helpers";

export default async function (request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
    }
    if (url.pathname === "/oauth/callback") {
        return exchangeCodeForToken(request, url);
    }
    return redirectToGitHub(url);
}

export const config: Config = {
    path: ["/oauth", "/oauth/callback"],
};

function redirectToGitHub(url: URL): Response {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    if (!clientId) {
        console.error("OAUTH_GITHUB_CLIENT_ID is not set");
        return popupResponse(
            url.origin,
            errorMessage("Login is not configured — contact the site admins"),
        );
    }

    const provider = url.searchParams.get("provider");
    if (provider !== null && provider !== PROVIDER) {
        return popupResponse(
            url.origin,
            errorMessage(`Unsupported provider: ${provider}`),
        );
    }

    const state = randomBytes(16).toString("hex");
    const headers = new Headers({
        Location: buildAuthorizeUrl(
            clientId,
            `${url.origin}/oauth/callback`,
            state,
        ),
        "Cache-Control": "no-store",
    });
    headers.append("Set-Cookie", makeStateCookie(state));
    return new Response(null, { status: 302, headers });
}

async function exchangeCodeForToken(
    request: Request,
    url: URL,
): Promise<Response> {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        console.error("OAuth client env vars are not set");
        return popupResponse(
            url.origin,
            errorMessage("Login is not configured — contact the site admins"),
        );
    }

    // GitHub redirects here with error params when the user denies access.
    const githubError = url.searchParams.get("error");
    if (githubError) {
        return popupResponse(
            url.origin,
            errorMessage(
                url.searchParams.get("error_description") ?? githubError,
            ),
        );
    }

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const expectedState = parseCookies(request.headers.get("cookie"))[
        STATE_COOKIE
    ];
    if (!code || !state || !expectedState || state !== expectedState) {
        return popupResponse(
            url.origin,
            errorMessage(
                "Login attempt was invalid or expired — close this window and try again",
            ),
        );
    }

    let tokenResponse: Response;
    try {
        tokenResponse = await fetch(GITHUB_TOKEN_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: `${url.origin}/oauth/callback`,
            }),
        });
    } catch (error) {
        console.error("GitHub token exchange failed:", error);
        return popupResponse(
            url.origin,
            errorMessage("Could not reach GitHub — try again"),
        );
    }
    if (!tokenResponse.ok) {
        console.error("GitHub token exchange failed:", tokenResponse.status);
        return popupResponse(
            url.origin,
            errorMessage("GitHub rejected the login — try again"),
        );
    }

    const data = (await tokenResponse.json()) as {
        access_token?: string;
        error?: string;
        error_description?: string;
    };
    if (!data.access_token) {
        console.error("GitHub token exchange rejected:", data.error);
        return popupResponse(
            url.origin,
            errorMessage(
                data.error_description ?? "GitHub did not issue a token",
            ),
        );
    }

    if (process.env.OAUTH_REQUIRE_WRITE_ACCESS === "true") {
        const denial = await checkWriteAccess(data.access_token);
        if (denial) {
            return popupResponse(url.origin, errorMessage(denial));
        }
    }

    return popupResponse(url.origin, successMessage(data.access_token));
}

/**
 * Optional login gate (enable with OAUTH_REQUIRE_WRITE_ACCESS=true): refuse
 * to hand the CMS a token for users who cannot publish, so they see a clear
 * message at login instead of a publish error later. GitHub blocks writes
 * for such users regardless, so this check fails open on API errors rather
 * than lock editors out. Returns the denial message, or undefined to allow.
 */
async function checkWriteAccess(token: string): Promise<string | undefined> {
    let response: Response;
    try {
        response = await fetch(`https://api.github.com/repos/${REPO}`, {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Write-access check failed:", error);
        return undefined;
    }
    if (!response.ok) {
        console.error("Write-access check failed:", response.status);
        return undefined;
    }
    const repo = (await response.json()) as {
        permissions?: { push?: boolean };
    };
    if (hasWriteAccess(repo.permissions)) {
        return undefined;
    }
    return `Your GitHub account does not have write access to ${REPO} — ask an Idea Board admin to add you`;
}

function popupResponse(origin: string, message: string): Response {
    const headers = new Headers({
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
    });
    headers.append("Set-Cookie", clearStateCookie());
    return new Response(renderCallbackPage(origin, message), { headers });
}
