import React from "react";

import { Link, graphql, useStaticQuery } from "gatsby";

import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";

import { IconText } from "./IconText";
import { TagPopover } from "./TagPopover";

const { container } = require("../style/idea-roll.module.css");

const ACCENT_COLORS = ["#6464FF", "#8246E1", "#00A59B", "#CD0F55"];

function hashColor(str: string): string {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return ACCENT_COLORS[h % ACCENT_COLORS.length];
}

type IdeaNode = Queries.IdeaRollQuery["allIdeaPost"]["nodes"][number];

type IdeaListItem = Omit<IdeaNode, "resources"> & {
    dataset: string | null;
};

interface IdeaRollProps {
    count?: number;
}

const IdeaRoll = ({ count }: IdeaRollProps) => {
    const queryData = useStaticQuery(graphql`
        query IdeaRoll {
            allIdeaPost(sort: { date: DESC }, filter: { draft: { ne: true } }) {
                nodes {
                    id
                    slug
                    title
                    tags
                    authors
                    resources {
                        type
                        name
                    }
                }
            }
        }
    `);

    const filteredNodes = queryData.allIdeaPost.nodes.slice(0, count);
    const ideasForIdeaRoll: IdeaListItem[] = filteredNodes.map(
        (post: IdeaNode) => ({
            ...post,
            dataset:
                post.resources.find((r) => r?.type === "dataset")?.name ?? null,
        }),
    );

    return (
        <List
            className={container}
            itemLayout="vertical"
            bordered={true}
            dataSource={ideasForIdeaRoll}
            footer={
                count ? (
                    <div>
                        <Link className="btn" to="/">
                            See more
                        </Link>
                    </div>
                ) : (
                    ""
                )
            }
            renderItem={(item) => {
                const accentColor = hashColor(item.title);
                return (
                    <List.Item
                        key={item.title}
                        style={
                            {
                                "--item-color": accentColor,
                            } as React.CSSProperties
                        }
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
                                <TagPopover
                                    key={tag}
                                    tag={tag}
                                    currentSlug={item.slug}
                                />
                            )),
                        ]}
                    >
                        <List.Item.Meta
                            title={<a href={item.slug}>{item.title}</a>}
                            avatar={
                                <Avatar.Group>
                                    {item.authors.map((author) => (
                                        <Avatar
                                            key={author}
                                            style={{
                                                backgroundColor:
                                                    hashColor(author),
                                                color: "#fff",
                                            }}
                                        >
                                            {author[0].toUpperCase()}
                                        </Avatar>
                                    ))}
                                </Avatar.Group>
                            }
                            description={
                                <span>
                                    {item.dataset ?? "No public dataset"}
                                </span>
                            }
                        />
                    </List.Item>
                );
            }}
        />
    );
};

export default IdeaRoll;
