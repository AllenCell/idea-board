import React from "react";

import { SECTION_HEADINGS, SectionKey } from "../constants/sectionQuestions";

const {
    sectionHeading,
    sectionHeadingQuestion,
    sectionHeadingSlash,
} = require("../style/idea-post.module.css");

interface SectionLabelProps {
    /** Looks the heading up in SECTION_HEADINGS. */
    section?: SectionKey;
    /** Overrides, for headings that aren't in the shared map. */
    title?: string;
    question?: string;
}

/**
 * Slash-motif section heading: "INTRODUCTION / Why is this interesting?".
 * The question is the plain-language framing; the title stays the short label
 * the page nav uses.
 */
export const SectionLabel: React.FC<SectionLabelProps> = ({
    question,
    section,
    title,
}) => {
    const heading = section ? SECTION_HEADINGS[section] : undefined;
    const resolvedTitle = title ?? heading?.title;
    const resolvedQuestion = question ?? heading?.question;

    return (
        <div className={sectionHeading}>
            {resolvedTitle}
            <span className={sectionHeadingSlash}>/</span>
            {resolvedQuestion && (
                <span className={sectionHeadingQuestion}>
                    {resolvedQuestion}
                </span>
            )}
        </div>
    );
};

export default SectionLabel;
