import * as React from "react";
import { Helmet } from "react-helmet-async";
import { Link, graphql } from "gatsby";
import Layout from "../components/Layout";

interface QueryResult {
    data: {
        site: {
            siteMetadata: {
                title: string;
            };
        };
        allMarkdownRemark: {
            totalCount: number;
            edges: Array<{
                node: {
                    fields: {
                        slug: string;
                    };
                    frontmatter: {
                        title: string;
                    };
                };
            }>;
        };
    };
    pageContext: {
        tag: string;
    };
}
interface TagRouteProps {
    data: QueryResult["data"];
    pageContext: QueryResult["pageContext"];
}

const TagRoute = (props: TagRouteProps) => {
    const posts = props.data.allMarkdownRemark.edges;

    const postLinks = posts.map((post) => (
        <li key={post.node.fields.slug}>
            <Link to={post.node.fields.slug}>
                <h2 className="is-size-2">{post.node.frontmatter.title}</h2>
            </Link>
        </li>
    ));

    const { tag } = props.pageContext;
    const { title } = props.data.site.siteMetadata;
    const { totalCount } = props.data.allMarkdownRemark;
    const tagHeader = `${totalCount} post${
        totalCount === 1 ? "" : "s"
    } tagged with “${tag}”`;

    return (
        <Layout>
            <section className="section">
                <Helmet title={`${tag} | ${title}`} />
                <div className="container content">
                    <div className="columns">
                        <div
                            className="column is-10 is-offset-1"
                            style={{ marginBottom: "6rem" }}
                        >
                            <h3 className="title is-size-4 is-bold-light">
                                {tagHeader}
                            </h3>
                            <ul className="taglist">{postLinks}</ul>
                            <p>
                                <Link to="/tags/">Browse all tags</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default TagRoute;

export const tagPageQuery = graphql`
    query TagPage($tag: String) {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(
            limit: 1000
            sort: { frontmatter: { date: DESC } }
            filter: { frontmatter: { tags: { in: [$tag] } } }
        ) {
            totalCount
            edges {
                node {
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                    }
                }
            }
        }
    }
`;
