import React from "react";
import ReactMarkdown from "react-markdown";

const { codeBlock } = require("../style/markdown.module.css");

interface CustomReactMarkdownProps {
    content: string;
    className?: string;
}

export const CustomReactMarkdown: React.FC<CustomReactMarkdownProps> = ({
    className,
    content,
}) => {
    return (
        <ReactMarkdown
            components={{
                p: ({ node: _node, ...props }) => (
                    <p className={className} {...props} />
                ),
                pre: ({ node: _node, ...props }) => (
                    <pre className={codeBlock} {...props} />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};
