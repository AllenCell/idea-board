import React from "react";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet-async";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import { IdeaPostNode, MaterialsAndMethods } from "../types";

interface QueryResult {
    data: {
        markdownRemark: IdeaPostNode;
    };
}

interface IdeaPostTemplateProps {
    content: string;
    contentComponent?: React.FC<{ content: string }> | typeof Content;
    description?: string;
    tags?: string[];
    title: string;
    helmet?: React.ReactNode;
    materialsAndMethods?: MaterialsAndMethods;
}

export const IdeaPostTemplate: React.FC<IdeaPostTemplateProps> = ({
    content,
    contentComponent,
    description,
    tags,
    title,
    helmet,
    materialsAndMethods,
}) => {
    const PostContent = contentComponent || Content;
    const software = materialsAndMethods?.software || null;

    return (
        <section className="section">
            {helmet || ""}
            <div className="container content">
                <div className="columns">
                    <div className="column is-10 is-offset-1">
                        <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                            {title}
                        </h1>
                        <p>{description}</p>
                        <PostContent content={content} />
                        {software && software.length ? (
                            <ul>
                                Software
                                {software.map((item, index) => (
                                    <li key={index}>
                                        {item.softwareTool?.frontmatter?.name}
                                        {item.customDescription && (
                                            <span>
                                                {" "}
                                                - {item.customDescription}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

const IdeaPost = ({ data }: QueryResult) => {
    const { markdownRemark: post } = data;

    return (
        <Layout>
            <IdeaPostTemplate
                content={post.html}
                contentComponent={HTMLContent}
                description={post.frontmatter.description}
                helmet={
                    <Helmet titleTemplate="%s | Ideas">
                        <title>{`${post.frontmatter.title}`}</title>
                        <meta
                            name="description"
                            content={`${post.frontmatter.description}`}
                        />
                    </Helmet>
                }
                tags={post.frontmatter.tags}
                title={post.frontmatter.title}
                materialsAndMethods={post.frontmatter.materialsAndMethods}
            />
        </Layout>
    );
};

export default IdeaPost;

export const pageQuery = graphql`
    query IdeaPostByID($id: String!) {
        markdownRemark(id: { eq: $id }) {
            id
            html
            frontmatter {
                date(formatString: "MMMM DD, YYYY")
                title
                description
                materialsAndMethods {
                    software {
                        softwareTool {
                            frontmatter {
                                name
                                description
                                link
                            }
                        }
                        customDescription
                    }
                }
            }
        }
    }
`;
