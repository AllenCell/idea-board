import { describe, expect, it } from "vitest";

import {
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

describe("buildAuthorizeUrl", () => {
    const authorizeUrl = buildAuthorizeUrl(
        "Iv1.abc123",
        "https://example.netlify.app/oauth/callback",
        "state-token",
    );
    const params = new URL(authorizeUrl).searchParams;

    it("targets GitHub's authorize endpoint", () => {
        expect(authorizeUrl).toMatch(
            /^https:\/\/github\.com\/login\/oauth\/authorize\?/,
        );
    });

    it("carries client_id, redirect_uri, and state", () => {
        expect(params.get("client_id")).toBe("Iv1.abc123");
        expect(params.get("redirect_uri")).toBe(
            "https://example.netlify.app/oauth/callback",
        );
        expect(params.get("state")).toBe("state-token");
    });

    it("requests no OAuth scope — GitHub App permissions govern access", () => {
        expect(params.has("scope")).toBe(false);
    });
});

describe("state cookie", () => {
    it("is HttpOnly, Secure, SameSite=Lax, and scoped to /oauth", () => {
        const cookie = makeStateCookie("abc");
        expect(cookie).toContain(`${STATE_COOKIE}=abc`);
        expect(cookie).toContain("HttpOnly");
        expect(cookie).toContain("Secure");
        expect(cookie).toContain("SameSite=Lax");
        expect(cookie).toContain("Path=/oauth");
        expect(cookie).toMatch(/Max-Age=\d+/);
    });

    it("clears with Max-Age=0 and the same attributes", () => {
        const cookie = clearStateCookie();
        expect(cookie).toContain(`${STATE_COOKIE}=;`);
        expect(cookie).toContain("Max-Age=0");
        expect(cookie).toContain("Path=/oauth");
    });
});

describe("parseCookies", () => {
    it("returns an empty record for a missing header", () => {
        expect(parseCookies(null)).toEqual({});
    });

    it("parses multiple cookies and trims whitespace", () => {
        expect(parseCookies("a=1; decap_oauth_state=xyz; b=2")).toEqual({
            a: "1",
            decap_oauth_state: "xyz",
            b: "2",
        });
    });

    it("keeps '=' characters inside cookie values", () => {
        expect(parseCookies("token=abc==")).toEqual({ token: "abc==" });
    });
});

describe("hasWriteAccess", () => {
    it("allows push access", () => {
        expect(hasWriteAccess({ push: true })).toBe(true);
    });

    it("denies read-only access", () => {
        expect(hasWriteAccess({ push: false })).toBe(false);
    });

    it("denies when permissions are missing entirely", () => {
        expect(hasWriteAccess(undefined)).toBe(false);
        expect(hasWriteAccess({})).toBe(false);
    });
});

describe("Decap handshake messages", () => {
    it("formats success as authorization:github:success:<json>", () => {
        const message = successMessage("gho_token");
        expect(message).toMatch(/^authorization:github:success:/);
        expect(
            JSON.parse(message.replace("authorization:github:success:", "")),
        ).toEqual({ provider: "github", token: "gho_token" });
    });

    it("formats errors as authorization:github:error:<json>", () => {
        const message = errorMessage("denied");
        expect(message).toMatch(/^authorization:github:error:/);
        expect(
            JSON.parse(message.replace("authorization:github:error:", "")),
        ).toEqual({ provider: "github", error: "denied" });
    });
});

describe("renderCallbackPage", () => {
    it("pins the postMessage handshake to the expected origin", () => {
        const page = renderCallbackPage(
            "https://example.netlify.app",
            successMessage("gho_token"),
        );
        expect(page).toContain('"https://example.netlify.app"');
        expect(page).toContain('postMessage("authorizing:github"');
        expect(page).not.toContain('"*"');
    });

    it("cannot be broken out of by a </script> sequence in the message", () => {
        const page = renderCallbackPage(
            "https://example.netlify.app",
            errorMessage("</script><script>alert(1)</script>"),
        );
        expect(page).not.toContain("</script><script>alert(1)");
    });
});
