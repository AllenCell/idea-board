import React from "react";
import { Link, graphql, StaticQuery } from "gatsby";
import { Avatar, List, Space } from "antd";
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
        excerpt: post.excerpt,
        featuredpost: post.frontmatter.featuredpost,
        featuredimage: post.frontmatter.featuredimage,
    }));
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
                            text="156"
                            key="list-vertical-star-o"
                        />,
                        <IconText
                            icon={LikeOutlined}
                            text="156"
                            key="list-vertical-like-o"
                        />,
                        <IconText
                            icon={MessageOutlined}
                            text="2"
                            key="list-vertical-message"
                        />,
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
                        avatar={
                            <PreviewCompatibleImage
                                imageInfo={
                                    item.featuredimage
                                        ? {
                                              ...item.featuredimage,
                                              image: item.featuredimage,
                                          }
                                        : { image: {}, alt: "Default alt text" }
                                }
                            />
                        }
                        // title={<a href={item.fields}>{item.title}</a>}
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
