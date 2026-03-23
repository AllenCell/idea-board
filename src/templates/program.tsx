import React from "react";

import { graphql, useStaticQuery } from "gatsby";

import { CustomReactMarkdown } from "../components/CustomReactMarkdown";

interface ProgramQueryData {
    markdownRemark: {
        id: string;
        frontmatter: {
            name: string;
            description?: string;
            active: boolean;
        };
    };
}

interface ProgramTemplateProps {
    name: string;
    description: string;
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

const Program = () => {
    const data = useStaticQuery<ProgramQueryData>(graphql`
        query GetProgramByNameStatic {
            markdownRemark {
                id
                frontmatter {
                    name
                    description
                    active
                }
            }
        }
    `);

    const { markdownRemark: post } = data;
    return (
        <ProgramTemplate
            name={post.frontmatter.name}
            description={post.frontmatter.description || ""}
            active={post.frontmatter.active || false}
        />
    );
};

export default Program;
