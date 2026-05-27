import React from "react";

import { Link, graphql, useStaticQuery } from "gatsby";

import { TagPopover } from "./TagPopover";

const {
    byline,
    container,
    eyebrowTag,
    listItem,
    tagEyebrow,
    tagSeparator,
    title,
} = require("../style/idea-roll.module.css");

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
                    authors {
                        name
                    }
                    resources {
                        type
                        name
                    }
                }
            }
        }
    `);

    const nodes: IdeaNode[] = queryData.allIdeaPost.nodes.slice(0, count);
    const ideas: IdeaListItem[] = nodes.map((post) => ({
        ...post,
        dataset:
            post.resources.find((r) => r?.type === "dataset")?.name ?? null,
    }));

    return (
        <>
            <ul className={container}>
                {ideas.map((item) => (
                    <li key={item.id} className={listItem}>
                        {item.tags.length > 0 && (
                            <div className={tagEyebrow}>
                                {item.tags.map((tag, i) => (
                                    <React.Fragment key={tag}>
                                        {i > 0 && (
                                            <span className={tagSeparator}>
                                                ·
                                            </span>
                                        )}
                                        <TagPopover
                                            tag={tag}
                                            currentSlug={item.slug}
                                            className={eyebrowTag}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                        <Link to={item.slug} className={title}>
                            {item.title}
                        </Link>
                        <div className={byline}>
                            by {item.authors.map((a) => a.name).join(" · ")}
                            {item.dataset
                                ? ` — ${item.dataset}`
                                : " — No public dataset"}
                        </div>
                    </li>
                ))}
            </ul>
            {count !== undefined && (
                <div>
                    <Link className="btn" to="/">
                        See more
                    </Link>
                </div>
            )}
        </>
    );
};

export default IdeaRoll;
