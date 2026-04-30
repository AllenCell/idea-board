import React from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

import "../style/idea-post.css";
import { CustomReactMarkdown } from "./CustomReactMarkdown";

interface ExpandedDescriptionViewProps {
    content: string;
    label: string;
    onBack: () => void;
}

/**
 * This component is a specific utility for idea-post template,
 * but also deserved to be factored out, may need to be adjusted
 * to be easily styled/reused in other contexts.
 */

export const ExpandedDescriptionView: React.FC<
    ExpandedDescriptionViewProps
> = ({ content, label, onBack }) => (
    <div className="idea-post">
        <div className="idea-post-back-bar">
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                Back to idea
            </Button>
        </div>
        <h3 className="idea-post-main-title">{label}</h3>
        <CustomReactMarkdown
            className="idea-post-section-text"
            content={content}
        />
    </div>
);

export default ExpandedDescriptionView;
