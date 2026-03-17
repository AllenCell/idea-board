import React from "react";
import ReactMarkdown from "react-markdown";

interface ResourceDetails {
    type?: string;
    name?: string;
    description?: string;
    link?: string;
    status?: string;
}

interface PreviewProps {
    value?: ResourceDetails | null;
}

const ResourcePreview: React.FC<PreviewProps> = ({ value }) => {
    const type = value?.type;
    const name = value?.name;
    const description = value?.description;
    const link = value?.link;
    const status = value?.status;

    return (
        <div className="resource-page">
            <div className="resource-card">
                {type && <span className="resource-type-badge">{type}</span>}
                <h2 className="resource-name">{name || "(No name)"}</h2>
                {description && (
                    <div className="resource-description">
                        <ReactMarkdown>{description}</ReactMarkdown>
                    </div>
                )}
                {link && (
                    <a className="resource-link" href={link} target="_blank" rel="noreferrer">
                        {link}
                    </a>
                )}
                {status && <p className="resource-status">Status: {status}</p>}
            </div>
        </div>
    );
};

export default ResourcePreview;
