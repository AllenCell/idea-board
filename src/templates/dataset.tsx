import React from "react";
import ReactMarkdown from "react-markdown";

import { PageProps, graphql } from "gatsby";

import { DatasetFrontmatter } from "../types";

const DatasetTemplate: React.FC<DatasetFrontmatter> = ({
    name,
    description,
    shortDescription,
    link,
    status,
}) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
            <h2>{name}</h2>
            <p> Quick pitch: {shortDescription} </p>
            <a href={link || ""}>{link}</a>
            <p> Status: {status}</p>
            <ReactMarkdown>
                {description ?? "No description provided."}
            </ReactMarkdown>
        </div>
    );
};

export const Dataset: React.FC<PageProps<Queries.DatasetByIdQuery>> = ({
    data,
}) => {
    if (!data.markdownRemark || !data.markdownRemark.frontmatter) {
        return <p>Dataset not found.</p>;
    }
    const { date, name, description, shortDescription, link, status } =
        data.markdownRemark.frontmatter;

    return (
        <div>
            <DatasetTemplate
                date={date}
                name={name}
                description={description}
                shortDescription={shortDescription}
                link={link}
                status={status}
            />
        </div>
    );
};

export default Dataset;

export const pageQuery = graphql`
    query DatasetById($id: String!) {
        markdownRemark(id: { eq: $id }) {
            id
            html
            frontmatter {
                date(formatString: "MMMM DD, YYYY")
                name
                description
                shortDescription
                link
                status
            }
        }
    }
`;
