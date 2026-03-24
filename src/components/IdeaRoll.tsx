import React from "react";

import { Link, graphql, useStaticQuery } from "gatsby";

import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import { useLocation } from "@reach/router";
import { Avatar, List } from "antd";

import { IconText } from "./IconText";
import { TagPopover } from "./TagPopover";

const { container } = require("../style/idea-roll.module.css");

type IdeaNode = Queries.IdeaRollQuery["allIdeaPost"]["nodes"][number];

type IdeaListItem = Omit<IdeaNode, "resources"> & {
    dataset: string | null;
};

interface IdeaRollProps {
    count?: number;
}

const IdeaRoll = ({ count }: IdeaRollProps) => {
    const path = useLocation().pathname;

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
                post.resources.find((r) => r?.type === "dataset")?.name ??
                null,
        }),
    );

    return (
        <List
            className={container}
            itemLayout="vertical"
            bordered={true}
            dataSource={ideasForIdeaRoll}
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
                                            backgroundColor: "gray",
                                        }}
                                    >
                                        {author[0].toUpperCase()}
                                    </Avatar>
                                ))}
                            </Avatar.Group>
                        }
                        description={
                            <span>{item.dataset ?? "No public dataset"}</span>
                        }
                    />
                </List.Item>
            )}
        />
    );
};

export default IdeaRoll;
