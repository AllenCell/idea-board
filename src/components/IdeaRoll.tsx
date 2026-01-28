import React from "react";
import { Link, graphql, StaticQuery } from "gatsby";
import { Avatar, List, Space, Tag } from "antd";
import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import { useLocation } from "@reach/router";
import { MaterialsAndMethods } from "../types";
import { IconText } from "./IconText";
import { TagPopover } from "./TagPopover";

const { container } = require("../style/idea-roll.module.css");

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
            templateKey: string;
            concerns?: string;
            program: string;
            authors?: string[];
            tags?: string[];
            type: string;
            materialsAndMethods?: MaterialsAndMethods;
        };
    };
}

const IdeaRollTemplate = (props: {
    count?: number;
    data: { allMarkdownRemark: { edges: PostNode[] } };
}) => {
    const path = useLocation().pathname;

    const { edges: posts } = props.data.allMarkdownRemark;

    const data = posts.map(({ node: post }) => ({
        id: post.id,
        title: post.frontmatter.title,
        date: post.frontmatter.date,
        slug: post.fields.slug,
        tags: post.frontmatter.tags || [],
        type: post.frontmatter.type,
        authors: post.frontmatter.authors || [],
        concerns: post.frontmatter.concerns || "",
        dataset: { ...post.frontmatter.materialsAndMethods?.dataset?.frontmatter },
    }));
    if (props.count) {
        data.splice(props.count);
    }
    return (
        <List
            className={container}
            itemLayout="vertical"
            bordered={true}
            dataSource={data}
            footer={
                path.includes("ideas") ? (
                    ""
                ) : (
                    <div>
                        <Link className="btn" to="/ideas">
                            See more
                        </Link>
                    </div>
                )
            }
            renderItem={(item) => (
                <List.Item
                    key={item.title}
                    actions={[
                        <IconText
                            icon={StarOutlined}
                            text="2"
                            key="list-vertical-star-o"
                        />,

                        <IconText
                            icon={MessageOutlined}
                            text="2"
                            key="list-vertical-message"
                        />,
                        ...item.tags.map((tag) => (
                            <TagPopover key={tag} tag={tag} currentSlug={item.slug} />
                        )),
                    ]}
                    // extra={
                    //     <img
                    //         width={272}
                    //         alt="logo"
                    //         src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    //     />
                    // }
                >
                    <List.Item.Meta
                        title={<a href={item.slug}>{item.title}</a>}
                        avatar={
                            <Avatar.Group>
                                {item.authors.map((author) => (
                                    <Avatar
                                        key={author}
                                        style={{
                                            backgroundColor: "gray",
                                        }}
                                    >
                                        {author[0].toUpperCase()}
                                    </Avatar>
                                ))}
                            </Avatar.Group>
                        }
                        description={
                            <>
                                <Space>
                                    {/* {item.dataStatus && (
                                    {/* {item.concerns && (
                                        <span style={{ color: "red" }}>
                                            concerns: {item.concerns}
                                        </span>
                                    )} */}
                                </Space>
                                <span>
                                    {item.dataset.name || "No public dataset"}
                                </span>
                            </>
                        }
                    />
                    <div>{item.dataset.description}</div>
                </List.Item>
            )}
        />
    );
};

export default function IdeaRoll({
    count,
}: {
    count?: number;
}): React.JSX.Element {
    return (
        <StaticQuery
            query={graphql`
                query IdeaRollQuery {
                    allMarkdownRemark(
                        sort: { order: DESC, fields: [frontmatter___date] }
                        filter: {
                            frontmatter: {
                                templateKey: { eq: "idea-post" }
                                draft: { ne: true }
                            }
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
                                    tags
                                    type
                                    authors
                                    concerns
                                    materialsAndMethods {
                                        dataset {
                                            frontmatter {
                                                name
                                                description
                                                link
                                                status
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `}
            render={(data: any) => (
                <IdeaRollTemplate data={data} count={count} />
            )}
        />
    );
}
