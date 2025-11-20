import React from "react";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet-async";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import { MaterialsAndMethods } from "../types";

interface IdeaPostNode {
    id: string;
    html: string;
    frontmatter: {
        date: string;
        title: string;
        description?: string;
        tags?: string[];
        authors?: string[];
        program?: string;
        type?: string;
        concerns?: string;
        introduction?: string;
        materialsAndMethods?: MaterialsAndMethods;
        nextSteps?: string;
    };
}

interface QueryResult {
    data: {
        markdownRemark: IdeaPostNode;
    };
}

interface IdeaPostTemplateProps {
    content: string;
    contentComponent?: React.FC<{ content: string }> | typeof Content;
    date?: string;
    description?: string;
    tags?: string[];
    authors?: string[];
    program?: string;
    type?: string;
    concerns?: string;
    introduction?: string;
    materialsAndMethods?: MaterialsAndMethods;
    nextSteps?: string;
    title: string;
    helmet?: React.ReactNode;
}

export const IdeaPostTemplate: React.FC<IdeaPostTemplateProps> = ({
    content,
    contentComponent,
    date,
    description,
    tags,
    authors,
    program,
    type,
    concerns,
    introduction,
    materialsAndMethods,
    nextSteps,
    title,
    helmet,
}) => {
    const PostContent = contentComponent || Content;

    const datasetFm =
        materialsAndMethods?.dataset?.frontmatter ?? undefined;

    return (
        <section className="section">
            {helmet || ""}
            <div className="container content">
                <div className="columns">
                    <div className="column is-10 is-offset-1">
                        {/* Title */}
                        <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                            {title}
                        </h1>

                        {/* Meta: authors, date, program, type */}
                        <div className="is-size-6 has-text-grey">
                            {authors && authors.length > 0 && (
                                <p>
                                    <strong>Author(s):</strong>{" "}
                                    {authors.join(", ")}
                                </p>
                            )}
                            {date && (
                                <p>
                                    <strong>Publish date:</strong> {date}
                                </p>
                            )}
                            {program && (
                                <p>
                                    <strong>Program:</strong> {program}
                                </p>
                            )}
                            {type && (
                                <p>
                                    <strong>Type:</strong> {type}
                                </p>
                            )}
                        </div>

                        {/* Short description */}
                        {description && <p>{description}</p>}

                        {/* Introduction */}
                        {introduction && (
                            <>
                                <h2 className="title is-size-4">
                                    Introduction
                                </h2>
                                <p>{introduction}</p>
                            </>
                        )}

                        {/* Dataset & materials / methods */}
                        {datasetFm && (
                            <>
                                <h2 className="title is-size-4">
                                    Materials and Methods
                                </h2>
                                <div>
                                    <p>
                                        <strong>Dataset:</strong>{" "}
                                        {datasetFm.link ? (
                                            <a
                                                href={datasetFm.link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {datasetFm.name}
                                            </a>
                                        ) : (
                                            datasetFm.name
                                        )}
                                    </p>
                                    {datasetFm.description && (
                                        <p>{datasetFm.description}</p>
                                    )}
                                    {datasetFm.status && (
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            {datasetFm.status}
                                        </p>
                                    )}
                                    {datasetFm.date && (
                                        <p>
                                            <strong>Dataset date:</strong>{" "}
                                            {datasetFm.date}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Suggested next steps */}
                        {nextSteps && (
                            <>
                                <h2 className="title is-size-4">
                                    Suggested next steps
                                </h2>
                                <p>{nextSteps}</p>
                            </>
                        )}

                        {/* Concerns (internal) */}
                        {concerns && (
                            <>
                                <h2 className="title is-size-5">
                                    AICS concerns (internal)
                                </h2>
                                <p>{concerns}</p>
                            </>
                        )}

                        {/* Body content */}
                        <h2 className="title is-size-4">Details</h2>
                        <PostContent content={content} />

                        {/* Tags */}
                        {tags && tags.length ? (
                            <div style={{ marginTop: `4rem` }}>
                                <h4>Tags</h4>
                                <ul className="taglist">
                                    {tags.map((tag) => (
                                        <li key={tag + `tag`}>
                                            <Link
                                                to={`/tags/${kebabCase(tag)}/`}
                                            >
                                                {tag}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

const IdeaPost: React.FC<QueryResult> = ({ data }) => {
    const { markdownRemark: post } = data;
    const fm = post.frontmatter;

    return (
        <Layout>
            <IdeaPostTemplate
                content={post.html}
                contentComponent={HTMLContent}
                date={fm.date}
                description={fm.description}
                tags={fm.tags}
                authors={fm.authors}
                program={fm.program}
                type={fm.type}
                concerns={fm.concerns}
                introduction={fm.introduction}
                materialsAndMethods={fm.materialsAndMethods}
                nextSteps={fm.nextSteps}
                title={fm.title}
                helmet={
                    <Helmet titleTemplate="%s | Ideas">
                        <title>{fm.title}</title>
                        <meta
                            name="description"
                            content={fm.description || ""}
                        />
                    </Helmet>
                }
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
                tags
                authors
                program
                type
                concerns
                introduction
                materialsAndMethods {
                    dataset {
                        frontmatter {
                            name
                            description
                            link
                            status
                            date
                        }
                    }
                }
                nextSteps
            }
        }
    }
`;
