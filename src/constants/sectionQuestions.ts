/**
 * Section headings pair a short label with the question that section answers,
 * rendered as "INTRODUCTION / Why is this interesting?".
 *
 * Keys match the section anchor ids used by the page nav.
 */
export const SECTION_HEADINGS = {
    introduction: {
        title: "Introduction",
        question: "Why is this interesting?",
    },
    "preliminary-findings": {
        title: "Preliminary Findings",
        question: "What do we know so far?",
    },
    "relevant-resources": {
        title: "Relevant Resources",
        question: "What else could you use?",
    },
    "related-ideas": {
        title: "Related Ideas",
        question: "What else connects to this?",
    },
    proposal: {
        title: "How to start working on this",
        question: "What would you do first?",
    },
    "flagship-resources": {
        title: "Flagship Resources",
        question: "What should you start with?",
    },
} as const;

export type SectionKey = keyof typeof SECTION_HEADINGS;

/** Title of the nested page that details how to take an idea on. */
export const HOW_TO_START_TITLE = "How to start working on this";

// Kept in sync with HOW_TO_START_PATH in gatsby/constants.js
export const HOW_TO_START_PATH = "how-to-start";
