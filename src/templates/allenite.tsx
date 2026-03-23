import React from "react";

import { graphql, useStaticQuery } from "gatsby";

interface AlleniteQueryData {
    markdownRemark: {
        id: string;
        frontmatter: {
            name: string;
            title?: string;
            contact?: string;
            // program?: string;
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

const Allenite = () => {
    const data = useStaticQuery<AlleniteQueryData>(graphql`
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
    `);

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

export default Allenite;
