import { describe, expect, it } from "vitest";

import { createIdeaPostResolver } from "../resolvers";

const mockReporter = { error: () => {} };

describe("createIdeaPostResolver - maturity", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the maturity value when present", () => {
        expect(resolver.maturity.resolve({ maturity: "speculative" })).toBe(
            "speculative",
        );
        expect(resolver.maturity.resolve({ maturity: "exploratory" })).toBe(
            "exploratory",
        );
        expect(resolver.maturity.resolve({ maturity: "supported" })).toBe(
            "supported",
        );
        expect(resolver.maturity.resolve({ maturity: "validated" })).toBe(
            "validated",
        );
    });

    it("returns 'speculative' when maturity is absent", () => {
        expect(resolver.maturity.resolve({})).toBe("speculative");
        expect(resolver.maturity.resolve({ maturity: null })).toBe(
            "speculative",
        );
        expect(resolver.maturity.resolve({ maturity: undefined })).toBe(
            "speculative",
        );
    });
});

describe("createIdeaPostResolver - accelerator", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the accelerator list when present", () => {
        expect(
            resolver.accelerator.resolve({ accelerator: ["Cell Science"] }),
        ).toEqual(["Cell Science"]);
    });

    it("returns an empty array when accelerator is absent", () => {
        expect(resolver.accelerator.resolve({})).toEqual([]);
        expect(resolver.accelerator.resolve({ accelerator: null })).toEqual([]);
    });

    it("returns an empty array for a non-array value", () => {
        expect(
            resolver.accelerator.resolve({ accelerator: "Cell Science" }),
        ).toEqual([]);
    });
});

describe("createIdeaPostResolver - scope", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the scope value when present", () => {
        expect(resolver.scope.resolve({ scope: "Summer project" })).toBe(
            "Summer project",
        );
    });

    it("returns null when scope is absent", () => {
        expect(resolver.scope.resolve({})).toBeNull();
        expect(resolver.scope.resolve({ scope: null })).toBeNull();
        expect(resolver.scope.resolve({ scope: undefined })).toBeNull();
    });
});

describe("createIdeaPostResolver - researcherLevel", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the levels when present", () => {
        expect(
            resolver.researcherLevel.resolve({
                researcherLevel: ["Graduate student", "Postdoc"],
            }),
        ).toEqual(["Graduate student", "Postdoc"]);
    });

    it("returns an empty array when absent", () => {
        expect(resolver.researcherLevel.resolve({})).toEqual([]);
        expect(
            resolver.researcherLevel.resolve({ researcherLevel: null }),
        ).toEqual([]);
    });

    it("returns an empty array for a non-array value", () => {
        expect(
            resolver.researcherLevel.resolve({ researcherLevel: "Postdoc" }),
        ).toEqual([]);
    });
});
