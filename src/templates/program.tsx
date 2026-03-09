import React from "react";

import { StaticQuery, graphql } from "gatsby";

import { CustomReactMarkdown } from "../components/CustomReactMarkdown";

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
    description,
    name,
}: ProgramTemplateProps) => {
    return (
        <div>
            <h1>{name}</h1>
            {description && <CustomReactMarkdown content={description} />}
        </div>
    );
};

const Program = ({ data }: QueryResult) => {
    const { markdownRemark: post } = data;
    return (
        <ProgramTemplate
            name={post.frontmatter.name}
            description={post.frontmatter.description || ""}
            image={post.frontmatter.image || ""}
            active={post.frontmatter.active || false}
        />
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
