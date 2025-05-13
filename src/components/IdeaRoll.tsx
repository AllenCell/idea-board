import React from "react";
import { Link, graphql, StaticQuery } from "gatsby";
import PreviewCompatibleImage from "./PreviewCompatibleImage";

interface PostNode {
    node: {
        id: string;
        excerpt: string;
        fields: {
            slug: string;
        };
        frontmatter: {
            title: string;
            date: string;
            featuredpost: boolean;
            featuredimage?: {
                childImageSharp: {
                    gatsbyImageData: {
                        width: number;
                        height: number;
                    };
                };
            };
        };
    };
}

const IdeaRollTemplate = (props: {
    data: { allMarkdownRemark: { edges: PostNode[] } };
}) => {
    const { edges: posts } = props.data.allMarkdownRemark;

    return (
        <div className="columns is-multiline">
            {posts &&
                posts.map(({ node: post }) => (
                    <div className="is-parent column is-6" key={post.id}>
                        <article
                            className={`idea-list-item tile is-child box notification ${
                                post.frontmatter.featuredpost
                                    ? "is-featured"
                                    : ""
                            }`}
                        >
                            <header>
                                {post?.frontmatter?.featuredimage && (
                                    <div className="featured-thumbnail">
                                        <PreviewCompatibleImage
                                            imageInfo={{
                                                image: post.frontmatter
                                                    .featuredimage,
                                                alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                                                width: post.frontmatter
                                                    .featuredimage
                                                    .childImageSharp
                                                    .gatsbyImageData.width,
                                                height: post.frontmatter
                                                    .featuredimage
                                                    .childImageSharp
                                                    .gatsbyImageData.height,
                                            }}
                                        />
                                    </div>
                                )}
                                <p className="post-meta">
                                    <Link
                                        className="title has-text-primary is-size-4"
                                        to={post.fields.slug}
                                    >
                                        {post.frontmatter.title}
                                    </Link>
                                    <span> &bull; </span>
                                    <span className="subtitle is-size-5 is-block">
                                        {post.frontmatter.date}
                                    </span>
                                </p>
                            </header>
                            <p>
                                {post.excerpt}
                                <br />
                                <br />
                                <Link className="button" to={post.fields.slug}>
                                    Keep Reading →
                                </Link>
                            </p>
                        </article>
                    </div>
                ))}
        </div>
    );
};

export default function IdeaRoll() {
    return (
        <StaticQuery
            query={graphql`
                query IdeaRollQuery {
                    allMarkdownRemark(
                        sort: { order: DESC, fields: [frontmatter___date] }
                        filter: {
                            frontmatter: { templateKey: { eq: "idea-post" } }
                        }
                    ) {
                        edges {
                            node {
                                excerpt(pruneLength: 400)
                                id
                                fields {
                                    slug
                                }
                                frontmatter {
                                    title
                                    templateKey
                                    date(formatString: "MMMM DD, YYYY")
                                    featuredpost
                                    featuredimage {
                                        childImageSharp {
                                            gatsbyImageData(
                                                width: 120
                                                quality: 100
                                                layout: CONSTRAINED
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `}
            render={(data: any) => <IdeaRollTemplate data={data} />}
        />
    );
}
