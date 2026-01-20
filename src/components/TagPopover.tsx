import React from "react";
import { Tag, Popover } from "antd";
import { Link, useStaticQuery, graphql } from "gatsby";

import * as styles from "../style/tag-popover.module.css";

interface PostForTags {
    node: {
        id: string;
        fields: {
            slug: string;
        } | null;
        frontmatter: {
            title: string;
            tags?: string[] | null;
        } | null;
    };
}

interface TagPopoverQuery {
    allMarkdownRemark: {
        edges: PostForTags[];
    };
}

interface TagPopoverProps {
    tag: string;
    currentSlug?: string;
}

export const TagPopover: React.FC<TagPopoverProps> = ({ tag, currentSlug }) => {
    const data: TagPopoverQuery = useStaticQuery(graphql`
        query AllIdeasForTags {
            allMarkdownRemark(
                filter: { frontmatter: { templateKey: { eq: "idea-post" } } }
            ) {
                edges {
                    node {
                        id
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                            tags
                        }
                    }
                }
            }
        }
    `);

    const postsWithTag = data.allMarkdownRemark.edges
        .filter(
            (edge: PostForTags) =>
                edge.node.frontmatter!.tags?.includes(tag) &&
                edge.node.fields!.slug !== currentSlug
        )
        .map((post: any) => (
            <li key={post.node.id} className={styles.postLink}>
                <Link to={post.node.fields.slug}>
                    {post.node.frontmatter.title}
                </Link>
            </li>
        ));

    const headerText =
        postsWithTag.length > 0
            ? `${postsWithTag.length} other post${
                  postsWithTag.length !== 1 ? "s" : ""
              } tagged with "${tag}"`
            : "No other posts with this tag";

    const content = (
        <div className={styles.popoverContent}>
            <div className={styles.header}>
                <strong>{headerText}</strong>
            </div>
            <ul className={styles.postList}>{postsWithTag}</ul>
            <div>
                <Link to="/tags/">Browse all tags</Link>
            </div>
        </div>
    );

    return (
        <Popover content={content} trigger="click">
            <Tag className={styles.tag}>{tag}</Tag>
        </Popover>
    );
};
