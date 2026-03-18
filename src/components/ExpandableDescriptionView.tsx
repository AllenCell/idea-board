import React from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { CustomReactMarkdown } from "./CustomReactMarkdown";

const {
    backBar,
    container,
    mainTitle,
    sectionText,
} = require("../style/idea-post.module.css");

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
    <div className={container}>
        <div className={backBar}>
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                Back to idea
            </Button>
        </div>
        <h3 className={mainTitle}>{label}</h3>
        <CustomReactMarkdown className={sectionText} content={content} />
    </div>
);

export default ExpandedDescriptionView;
