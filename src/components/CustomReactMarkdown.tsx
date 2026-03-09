import React from "react";
import ReactMarkdown from "react-markdown";

export const CustomReactMarkdown: React.FC<{ content: string }> = ({
    content,
}) => {
    return (
        <ReactMarkdown
            components={{
                p: ({ node: _node, ...props }) => (
                    <p style={{ margin: 0 }} {...props} />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};
