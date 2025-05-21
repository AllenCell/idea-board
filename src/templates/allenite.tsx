import React from "react";
import { graphql, StaticQuery } from "gatsby";
import Layout from "../components/Layout";

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
    name,
    title,
    contact,
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
        <Layout>
            <AlleniteTemplate
                name={post.frontmatter.name}
                title={post.frontmatter.title || ""}
                contact={post.frontmatter.contact || ""}
                // program={post.frontmatter.program || ""}
            />
        </Layout>
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
