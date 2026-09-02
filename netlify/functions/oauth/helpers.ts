/**
 * Pure helpers for the Decap CMS OAuth provider function (see index.mts).
 * Everything here is side-effect free so it can be unit tested directly.
 */

export const PROVIDER = "github";
export const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
export const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
export const STATE_COOKIE = "decap_oauth_state";

const STATE_COOKIE_MAX_AGE_SECONDS = 600;
// Path=/oauth keeps the cookie off every other request to the site.
const STATE_COOKIE_ATTRIBUTES = "Path=/oauth; HttpOnly; Secure; SameSite=Lax";

// No scope parameter: GitHub Apps ignore OAuth scopes — access is bounded by
// the App's permissions, its installations, and the user's own repo access.
export function buildAuthorizeUrl(
    clientId: string,
    redirectUri: string,
    state: string,
): string {
    const url = new URL(GITHUB_AUTHORIZE_URL);
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("state", state);
    return url.toString();
}

export function makeStateCookie(state: string): string {
    return `${STATE_COOKIE}=${state}; Max-Age=${STATE_COOKIE_MAX_AGE_SECONDS}; ${STATE_COOKIE_ATTRIBUTES}`;
}

export function clearStateCookie(): string {
    return `${STATE_COOKIE}=; Max-Age=0; ${STATE_COOKIE_ATTRIBUTES}`;
}

export function parseCookies(header: string | null): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!header) return cookies;
    for (const part of header.split(";")) {
        const separator = part.indexOf("=");
        if (separator === -1) continue;
        cookies[part.slice(0, separator).trim()] = part
            .slice(separator + 1)
            .trim();
    }
    return cookies;
}

/**
 * Messages in the format Decap's Authenticator expects:
 * `authorization:<provider>:<status>:<json>` (see decap-cms-lib-auth).
 */
export function successMessage(token: string): string {
    return `authorization:${PROVIDER}:success:${JSON.stringify({
        provider: PROVIDER,
        token,
    })}`;
}

export function errorMessage(reason: string): string {
    return `authorization:${PROVIDER}:error:${JSON.stringify({
        provider: PROVIDER,
        error: reason,
    })}`;
}

/**
 * The page served to the CMS login popup. It performs Decap's postMessage
 * handshake: announce "authorizing:github" to the opener, wait for the
 * opener's echo, then deliver `message` (the success or error payload).
 * Both directions are pinned to `expectedOrigin` — the site's own origin,
 * since /admin and these functions are served from the same host.
 */
export function renderCallbackPage(
    expectedOrigin: string,
    message: string,
): string {
    return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Authorizing…</title></head>
<body>
<p>Authorizing… this window should close itself. If it does not, close it and try logging in again.</p>
<script>
(function () {
    var expectedOrigin = ${jsonForScript(expectedOrigin)};
    var message = ${jsonForScript(message)};
    if (!window.opener) return;
    window.addEventListener(
        "message",
        function (event) {
            if (event.origin !== expectedOrigin) return;
            if (event.source !== window.opener) return;
            window.opener.postMessage(message, expectedOrigin);
        },
        false
    );
    window.opener.postMessage("authorizing:${PROVIDER}", expectedOrigin);
})();
</script>
</body>
</html>
`;
}

// "<" is escaped so a value containing "</script>" cannot break out of the tag.
function jsonForScript(value: string): string {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}
