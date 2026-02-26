import React from "react";

import { StaticQuery, graphql } from "gatsby";

interface QueryResult {
    data: {
        markdownRemark: {
            id: string;
            frontmatter: {
                name: string;
                title?: string;
                contact?: string;
                // program?: string;
            };
        };
    };
}

interface AlleniteTemplateProps {
    name: string;
    title: string;
    contact: string;
    // program: string;
}

export const AlleniteTemplate = ({
    contact,
    name,
    title,
}: AlleniteTemplateProps) => {
    return (
        <div>
            <h1>{name}</h1>
            <h2>{title}</h2>
            <p>Contact: {contact}</p>
        </div>
    );
};

const Allenite = ({ data }: QueryResult) => {
    const { markdownRemark: post } = data;
    return (
        <AlleniteTemplate
            name={post.frontmatter.name}
            title={post.frontmatter.title || ""}
            contact={post.frontmatter.contact || ""}
            // program={post.frontmatter.program || ""}
        />
    );
};

const AlleniteQuery = () => (
    <StaticQuery
        query={graphql`
            query GetAlleniteByNameStatic {
                markdownRemark {
                    id
                    frontmatter {
                        name
                        title
                        contact
                    }
                }
            }
        `}
        render={(data) => <Allenite data={data} />}
    />
);

export default AlleniteQuery;
