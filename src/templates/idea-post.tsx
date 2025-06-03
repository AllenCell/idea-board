import React from "react";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet-async";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";

interface QueryResult {
    data: {
        markdownRemark: {
            id: string;
            html: string;
            frontmatter: {
                date: string;
                title: string;
                description: string;
                tags: string[];
            };
        };
    };
}

interface IdeaPostTemplateProps {
    content: string;
    contentComponent?: React.FC<{ content: string }> | typeof Content;
    description?: string;
    tags?: string[];
    title: string;
    helmet?: React.ReactNode;
}

export const IdeaPostTemplate: React.FC<IdeaPostTemplateProps> = ({
    content,
    contentComponent,
    description,
    tags,
    title,
    helmet,
}) => {
    const PostContent = contentComponent || Content;

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
            }
        }
    }
`;
