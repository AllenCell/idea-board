import React from "react";
import { graphql, StaticQuery } from "gatsby";
import Layout from "../components/Layout";

interface QueryResult {
    data: {
        markdownRemark: {
            id: string;
            frontmatter: {
                name: string;
                description?: string;
                image?: string;
                active: boolean;
            };
        };
    };
}

interface ProgramTemplateProps {
    name: string;
    description: string;
    image?: string;
    active: boolean;
}

export const ProgramTemplate = ({
    name,
    description,
    image,
}: ProgramTemplateProps) => {
    return (
        <div>
            <h1>{name}</h1>
        </div>
    );
};

const Program = ({ data }: QueryResult) => {
    const { markdownRemark: post } = data;
    return (
        <Layout>
            <ProgramTemplate
                name={post.frontmatter.name}
                description={post.frontmatter.description || ""}
                image={post.frontmatter.image || ""}
                active={post.frontmatter.active || false}
            />
        </Layout>
    );
};

const ProgramQuery = () => (
    <StaticQuery
        query={graphql`
            query GetProgramByNameStatic {
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
        render={(data) => <Program data={data} />}
    />
);

export default ProgramQuery;
