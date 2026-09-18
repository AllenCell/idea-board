import React from "react";

import { Link, graphql, useStaticQuery } from "gatsby";

import { Popover, Tag } from "antd";

import * as styles from "../style/tag-popover.module.css";

interface TagPopoverProps {
    className?: string;
    currentSlug?: string;
    tag: string;
}

export const TagPopover: React.FC<TagPopoverProps> = ({
    className,
    currentSlug,
    tag,
}) => {
    const data: Queries.AllIdeasForTagsQuery = useStaticQuery(graphql`
        query AllIdeasForTags {
            allIdeaPost {
                nodes {
                    id
                    slug
                    title
                    tags
                }
            }
        }
    `);

    const postsWithTag = data.allIdeaPost.nodes
        .filter((node) => node.tags.includes(tag) && node.slug !== currentSlug)
        .map((node) => (
            <li key={node.id} className={styles.postLink}>
                <Link to={node.slug}>{node.title}</Link>
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
            <Tag className={className ?? styles.tag}>{tag}</Tag>
        </Popover>
    );
};
