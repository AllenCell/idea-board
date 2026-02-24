import React from "react";

import { PageProps, graphql } from "gatsby";

import { ResourceDetails, ResourceTemplateQuery } from "../types";

const ResourceTemplate: React.FC<ResourceDetails> = ({
    type,
    name,
    description,
    link,
    status,
}) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
            <h2>{name}</h2>
            <p>{type}</p>
            <p>{description}</p>
            {link ? (
                <p>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                    </a>
                </p>
            ) : null}
            <p>Status: {status}</p>
        </div>
    );
};

export const Resource: React.FC<PageProps<ResourceTemplateQuery>> = ({
    data,
}) => {
    console.log("Resource data:", data);
    const markdownRemark = data.markdownRemark;
    if (!markdownRemark || !markdownRemark.frontmatter.resourceDetails) {
        return (
            <div>
                <p>Resource not found.</p>
            </div>
        );
    }

    return (
        <div>
            <ResourceTemplate {...markdownRemark.frontmatter.resourceDetails} />
        </div>
    );
};

export default Resource;

export const pageQuery = graphql`
    query ResourcesById($id: String!) {
        markdownRemark(id: { eq: $id }) {
            id
            frontmatter {
                name
                resourceDetails {
                    ...ResourceDetailsFields
                }
            }
        }
    }
`;
