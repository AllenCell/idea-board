import React from "react";
import ReactMarkdown from "react-markdown";

import "../style/markdown.css";

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
                    <p className={className} style={{ margin: 0 }} {...props} />
                ),
                pre: ({ node: _node, ...props }) => (
                    <pre className="code-block" {...props} />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};
