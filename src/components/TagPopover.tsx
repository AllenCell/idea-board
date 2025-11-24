import React from 'react';
import { Tag } from 'antd';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { Popover } from './Popover';

const { postLink } = require('../style/tag-popover.module.css');

interface TagPopoverProps {
    tag: string;
}

export const TagPopover: React.FC<TagPopoverProps> = ({ tag }) => {
    const data = useStaticQuery(graphql`
        query AllIdeasForTags {
            allMarkdownRemark(
                filter: { frontmatter: { templateKey: { eq: "idea-post" } } }
                sort: { frontmatter: { date: DESC } }
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

    const postsWithTag = data.allMarkdownRemark.edges.filter(
        (edge: any) => edge.node.frontmatter.tags?.includes(tag)
    );

    const content = (
        <>
            <div style={{ marginBottom: '0.5rem' }}>
                <strong>
                    {postsWithTag.length} post{postsWithTag.length !== 1 ? 's' : ''} tagged
                    with "{tag}"
                </strong>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {postsWithTag.map((post: any) => (
                    <li key={post.node.id} className={postLink}>
                        <Link to={post.node.fields.slug}>
                            {post.node.frontmatter.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: '0.5rem' }}>
                <Link to="/tags/">Browse all tags</Link>
            </div>
        </>
    );

    return (
        <Popover content={content}>
            <Tag style={{ cursor: 'pointer' }}>{tag}</Tag>
        </Popover>
    );
};
