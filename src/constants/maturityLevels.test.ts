import { describe, expect, it } from "vitest";

import { getMaturityConfig } from "./maturityLevels";

describe("getMaturityConfig", () => {
    it("returns the correct label for each level", () => {
        expect(getMaturityConfig("speculative").label).toBe("Speculative");
        expect(getMaturityConfig("exploratory").label).toBe("Exploratory");
        expect(getMaturityConfig("supported").label).toBe("Supported");
        expect(getMaturityConfig("validated").label).toBe("Validated");
    });

    it("returns the correct hint for each level", () => {
        expect(getMaturityConfig("speculative").hint).toBe(
            "Untested — shared to invite discussion, not as a claim",
        );
        expect(getMaturityConfig("exploratory").hint).toBe(
            "Early investigation — findings are preliminary",
        );
        expect(getMaturityConfig("supported").hint).toBe(
            "Backed by data or analysis, but not yet exhaustive",
        );
        expect(getMaturityConfig("validated").hint).toBe(
            "Well-evidenced and reproducible",
        );
    });

    it("falls back to Speculative for unknown values", () => {
        expect(getMaturityConfig("unknown").label).toBe("Speculative");
        expect(getMaturityConfig("").label).toBe("Speculative");
    });
});
