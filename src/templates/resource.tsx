import React from "react";

import { PageProps, graphql } from "gatsby";

import { ResourceNode, ResourceTemplateQuery } from "../types";
import { ResourceLinks } from "../components/ResourceLinks";

const ResourceTemplate: React.FC<NonNullable<ResourceNode>> = ({
    description,
    links,
    name,
    status,
    type,
}) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
            <h2>{name}</h2>
            <p>{type}</p>
            <p>{description}</p>
            <ResourceLinks name={name} links={links} />
            <p>Status: {status}</p>
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

    return (
        <div>
            <ResourceTemplate {...resource} />
        </div>
    );
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
