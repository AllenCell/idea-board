import { describe, expect, it } from "vitest";
import { createIdeaPostResolver } from "../resolvers";

const mockReporter = { error: () => {} };

describe("createIdeaPostResolver - maturity", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the maturity value when present", () => {
        expect(resolver.maturity.resolve({ maturity: "speculative" })).toBe("speculative");
        expect(resolver.maturity.resolve({ maturity: "exploratory" })).toBe("exploratory");
        expect(resolver.maturity.resolve({ maturity: "supported" })).toBe("supported");
        expect(resolver.maturity.resolve({ maturity: "validated" })).toBe("validated");
    });

    it("returns 'speculative' when maturity is absent", () => {
        expect(resolver.maturity.resolve({})).toBe("speculative");
        expect(resolver.maturity.resolve({ maturity: null })).toBe("speculative");
        expect(resolver.maturity.resolve({ maturity: undefined })).toBe("speculative");
    });
});
