import React from "react";

import { PageProps, graphql } from "gatsby";

import { CustomReactMarkdown } from "../components/CustomReactMarkdown";
import "../style/resource.css";
import { ResourceNode, ResourceTemplateQuery } from "../types";

export type ResourceDisplayProps = Partial<
    Pick<
        NonNullable<ResourceNode>,
        "description" | "link" | "name" | "status" | "type"
    >
>;

export const ResourceTemplate: React.FC<ResourceDisplayProps> = ({
    description,
    link,
    name,
    status,
    type,
}) => {
    return (
        <div className="resource-page">
            <div className="resource-card">
                <h2>{name}</h2>
                {status && <p>Status: {status}</p>}
                {type && <p>Type: {type}</p>}
                {link && (
                    <>
                        <p>Link: </p>
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link}
                        </a>
                    </>
                )}
                {description && (
                    <>
                        <p>Description: </p>
                        <CustomReactMarkdown
                            content={description}
                            className="resource-description"
                        />
                    </>
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
