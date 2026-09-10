import React from "react";

import { IdeaStep } from "../types";
import { CustomReactMarkdown } from "./CustomReactMarkdown";

const {
    stepAccess,
    stepAccessLabel,
    stepItem,
    stepList,
    stepNote,
    stepText,
} = require("../style/idea-post.module.css");

interface NextStepsProps {
    steps: readonly IdeaStep[];
}

/** Each step is a bullet; a linked resource's access instructions nest beneath it. */
export const NextSteps: React.FC<NextStepsProps> = ({ steps }) => {
    const resolved = steps.filter(
        (step) => step && (step.text || step.resource || step.note),
    );
    if (resolved.length === 0) {
        return null;
    }

    return (
        <ol className={stepList}>
            {resolved.map((step, index) => {
                const accessSteps = step.resource?.accessSteps;
                return (
                    <li className={stepItem} key={index}>
                        {step.text && (
                            <CustomReactMarkdown
                                className={stepText}
                                content={step.text}
                            />
                        )}
                        {accessSteps && (
                            <div className={stepAccess}>
                                <span className={stepAccessLabel}>
                                    {step.resource?.name
                                        ? `Access — ${step.resource.name}`
                                        : "Access"}
                                </span>
                                <CustomReactMarkdown content={accessSteps} />
                            </div>
                        )}
                        {step.note && (
                            <CustomReactMarkdown
                                className={stepNote}
                                content={step.note}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
};

export default NextSteps;
