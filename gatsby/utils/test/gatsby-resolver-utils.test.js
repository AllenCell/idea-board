import { describe, expect, it } from "vitest";

import { RESOURCES_TEMPLATE_KEY } from "../constants";
import { resolveSlug } from "../gatsby-resolver-utils";

describe("resolveSlug", () => {
    it("should return null when id is falsy", () => {
        expect(resolveSlug(null, "software")).toBe(null);
        expect(resolveSlug(undefined, "software")).toBe(null);
        expect(resolveSlug("", "software")).toBe(null);
    });

    it("should build a slug from id and directory", () => {
        expect(resolveSlug("released-emt-dataset", RESOURCES_TEMPLATE_KEY)).toBe(
            "/resource/released-emt-dataset/",
        );
    });

    it("should slugify the id to lowercase", () => {
        expect(resolveSlug("UPPERCASE", RESOURCES_TEMPLATE_KEY)).toBe(
            "/resource/uppercase/",
        );
    });

    it("should handle special characters in id", () => {
        expect(resolveSlug("Tool & Library", RESOURCES_TEMPLATE_KEY)).toBe(
            "/resource/tool-and-library/",
        );
        expect(resolveSlug("Some/Path/Name", RESOURCES_TEMPLATE_KEY)).toBe(
            "/resource/somepathname/",
        );
    });

    it("should handle ids with leading/trailing spaces", () => {
        expect(resolveSlug("  trimmed  ", RESOURCES_TEMPLATE_KEY)).toBe(
            "/resource/trimmed/",
        );
    });
});
