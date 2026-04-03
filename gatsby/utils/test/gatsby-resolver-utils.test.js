import { describe, expect, it } from "vitest";

import { resolveSlug, resourceQuery } from "../gatsby-resolver-utils";

describe("resolveSlug", () => {
    it("should return null when id is falsy", () => {
        expect(resolveSlug(null, "resource")).toBe(null);
        expect(resolveSlug(undefined, "resource")).toBe(null);
        expect(resolveSlug("", "resource")).toBe(null);
    });

    it("should build a slug from id and directory", () => {
        expect(resolveSlug("released-emt-dataset", "resource")).toBe(
            "/resource/released-emt-dataset/",
        );
    });

    it("should slugify the id to lowercase", () => {
        expect(resolveSlug("UPPERCASE", "resource")).toBe(
            "/resource/uppercase/",
        );
    });

    it("should handle special characters in id", () => {
        expect(resolveSlug("Tool & Library", "resource")).toBe(
            "/resource/tool-and-library/",
        );
        expect(resolveSlug("Some/Path/Name", "resource")).toBe(
            "/resource/somepathname/",
        );
    });

    it("should handle ids with leading/trailing spaces", () => {
        expect(resolveSlug("  trimmed  ", "resource")).toBe(
            "/resource/trimmed/",
        );
    });
});

describe("resourceQuery", () => {
    it("should return null for falsy names", () => {
        expect(resourceQuery(null)).toBe(null);
        expect(resourceQuery(undefined)).toBe(null);
        expect(resourceQuery("")).toBe(null);
    });

    it("should return a query object for a valid name", () => {
        expect(resourceQuery("simularium")).toEqual({
            query: { filter: { slug: { eq: "/resource/simularium/" } } },
            type: "Resource",
        });
    });

    it("should slugify the name into the query slug", () => {
        expect(resourceQuery("Released EMT Dataset")).toEqual({
            query: {
                filter: { slug: { eq: "/resource/released-emt-dataset/" } },
            },
            type: "Resource",
        });
    });

    it("should always set type to Resource", () => {
        const result = resourceQuery("anything");
        expect(result.type).toBe("Resource");
    });
});
