import React from "react";
import { Link, graphql, StaticQuery } from "gatsby";
import { Avatar, List, Space, Tag } from "antd";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
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
            templateKey: string;
            tags?: string[];
            dataset?: {
                frontmatter: {
                    name: string;
                    description?: string;
                    link?: string;
                    status?: string;
                    date?: string;
                };
            };
        };
    };
}

const IdeaRollTemplate = (props: {
    data: { allMarkdownRemark: { edges: PostNode[] } };
}) => {
    const { edges: posts } = props.data.allMarkdownRemark;
    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const data = posts.map(({ node: post }) => ({
        id: post.id,
        title: post.frontmatter.title,
        date: post.frontmatter.date,
        slug: post.fields.slug,
        tags: post.frontmatter.tags || [],
        dataset: { ...post.frontmatter.dataset?.frontmatter },
    }));
    console.log("data", data);
    return (
        <List
            itemLayout="vertical"
            dataSource={data}
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
                            <Link to={`/tags/${tag.replace(" ", "-")}/`}>
                                <Tag key="list-vertical-tag">{tag}</Tag>
                            </Link>
                        )),
                    ]}
                    extra={
                        <img
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        />
                    }
                >
                    <List.Item.Meta
                        title={<a href={item.slug}>{item.title}</a>}
                        description={
                            <span>
                                {item.date} -{" "}
                                {item.dataset.name || "No public dataset"}
                            </span>
                        }
                    />
                </List.Item>
            )}
        />
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
                                    tags

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
            `}
            render={(data: any) => <IdeaRollTemplate data={data} />}
        />
    );
}
