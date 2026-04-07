import React from "react";

import { Button } from "antd";

import { MAX_RESOURCE_DESCRIPTION_LENGTH } from "../constants";
import "../style/idea-post.css";
import { truncateAtWord } from "../utils/utils";
import { CustomReactMarkdown } from "./CustomReactMarkdown";

interface ExpandableTextProps {
    fullText?: string | null;
    onExpand?: () => void;
    shortText?: string | null;
}

/**
 * This component is a specific utility for idea-post template,
 * but also deserved to be factored out, may need to be adjusted
 * to be easily styled/reused in other contexts.
 */

export const ExpandableText: React.FC<ExpandableTextProps> = ({
    fullText,
    onExpand,
    shortText,
}) => {
    if (!shortText && !fullText) return null;

    // shortText only — show as-is
    if (shortText && !fullText) {
        return (
            <CustomReactMarkdown
                className={"idea-post-section-text"}
                content={shortText}
            />
        );
    }

    // fullText only — truncate if long, "See more" opens full-page view
    if (!shortText && fullText) {
        const needsTruncation =
            fullText.length > MAX_RESOURCE_DESCRIPTION_LENGTH;
        return (
            <>
                <CustomReactMarkdown
                    className={"idea-post-section-text"}
                    content={
                        needsTruncation
                            ? truncateAtWord(
                                  fullText,
                                  MAX_RESOURCE_DESCRIPTION_LENGTH,
                              )
                            : fullText
                    }
                />
                {needsTruncation && onExpand && (
                    <Button type="link" onClick={onExpand}>
                        See more
                    </Button>
                )}
            </>
        );
    }

    // Both — show shortText, "See more" opens full-page view
    return (
        <>
            <CustomReactMarkdown
                className={"idea-post-section-text"}
                content={shortText!}
            />
            {fullText && onExpand && (
                <Button type="link" onClick={onExpand}>
                    See more
                </Button>
            )}
        </>
    );
};

export default ExpandableText;
