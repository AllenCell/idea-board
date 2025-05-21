import * as React from "react";

interface HTMLContentProps {
    content: string;
    className?: string;
}

interface ContentProps {
    content: React.ReactNode;
    className?: string;
}

export const HTMLContent = ({ content, className }: HTMLContentProps) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
);

const Content = ({ content, className }: ContentProps) => (
    <div className={className}>{content}</div>
);

export default Content;
