import React from "react";
import { graphql } from "gatsby";

interface QueryResult {
    data: {
        markdownRemark: {
            id: string;
            html: string;
            frontmatter: {
                date: string;
                name: string;
                description: string;
                status?: string;
                link?: string;
            };
        };
    };
}

type DatasetProps = {
    name: string;
    description?: string;
    link?: string;
    status?: string;
    date?: string;
};

const DatasetTemplate: React.FC<DatasetProps> = ({
    name,
    description,
    link,
    status,
}) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
            <h2>{name}</h2>
        </div>
    );
};

export const Dataset = ({ data }: QueryResult) => {
    const { markdownRemark: dataset } = data;

    return (
        <div>
            <DatasetTemplate
                name={dataset.frontmatter.name}
                description={dataset.frontmatter.description}
                link={dataset.frontmatter.link}
                status={dataset.frontmatter.status}
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
                link
                status
            }
        }
    }
`;
