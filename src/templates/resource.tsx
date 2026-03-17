import React from "react";

import { PageProps, graphql } from "gatsby";

import "../style/resource.css";
import { ResourceNode, ResourceTemplateQuery } from "../types";

const ResourceTemplate: React.FC<NonNullable<ResourceNode>> = ({
    description,
    link,
    name,
    status,
    type,
}) => {
    return (
        <div className="resource-page">
            <div className="resource-card">
                {type && <span className="resource-type-badge">{type}</span>}
                <h2 className="resource-name">{name}</h2>
                {description && (
                    <p className="resource-description">{description}</p>
                )}
                {link && (
                    <a
                        className="resource-link"
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {link}
                    </a>
                )}
                {status && (
                    <p className="resource-status">Status: {status}</p>
                )}
            </div>
        </div>
    );
};

export const Resource: React.FC<PageProps<ResourceTemplateQuery>> = ({
    data,
}) => {
    const resource = data.resource;
    if (!resource) {
        return (
            <div>
                <p>Resource not found.</p>
            </div>
        );
    }

    return <ResourceTemplate {...resource} />;
};

export default Resource;

export const pageQuery = graphql`
    query ResourcesById($id: String!) {
        resource(id: { eq: $id }) {
            id
            ...ResourceFields
        }
    }
`;
