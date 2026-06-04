interface MaturityConfig {
    label: string;
    hint: string;
}

export const MATURITY_CONFIG: Record<string, MaturityConfig> = {
    speculative: {
        label: "Speculative",
        hint: "Untested — shared to invite discussion, not as a claim",
    },
    exploratory: {
        label: "Exploratory",
        hint: "Early investigation — findings are preliminary",
    },
    supported: {
        label: "Supported",
        hint: "Backed by data or analysis, but not yet exhaustive",
    },
    validated: {
        label: "Validated",
        hint: "Well-evidenced and reproducible",
    },
};

export function getMaturityConfig(maturity: string): MaturityConfig {
    return MATURITY_CONFIG[maturity] ?? MATURITY_CONFIG.speculative;
}
