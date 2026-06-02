import React from "react";

import { Link, graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import { TagPopover } from "./TagPopover";

const {
    byline,
    container,
    eyebrowTag,
    listItem,
    tagEyebrow,
    tagSeparator,
    textBlock,
    thumbnail,
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
                    preliminaryFindings {
                        figures {
                            type
                            url
                            file {
                                childImageSharp {
                                    gatsbyImageData(
                                        width: 80
                                        height: 64
                                        layout: FIXED
                                        quality: 80
                                    )
                                }
                            }
                        }
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
                {ideas.map((item) => {
                    const firstFigure =
                        item.preliminaryFindings?.figures?.[0] ?? null;
                    const gatsbyImage = firstFigure?.file?.childImageSharp
                        ? getImage(firstFigure.file.childImageSharp)
                        : null;

                    return (
                        <li key={item.id} className={listItem}>
                            <div className={textBlock}>
                                {item.tags.length > 0 && (
                                    <div className={tagEyebrow}>
                                        {item.tags.map((tag, i) => (
                                            <React.Fragment key={tag}>
                                                {i > 0 && (
                                                    <span
                                                        className={tagSeparator}
                                                        aria-hidden="true"
                                                    >
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
                                    by{" "}
                                    {item.authors
                                        .map((a) => a.name)
                                        .join(" · ")}
                                    {item.dataset
                                        ? ` — ${item.dataset}`
                                        : " — No public dataset"}
                                </div>
                            </div>

                            {(gatsbyImage || firstFigure?.url) && (
                                <Link
                                    to={item.slug}
                                    tabIndex={-1}
                                    aria-hidden="true"
                                >
                                    {gatsbyImage ? (
                                        <GatsbyImage
                                            image={gatsbyImage}
                                            alt=""
                                            className={thumbnail}
                                        />
                                    ) : (
                                        <img
                                            src={firstFigure!.url!}
                                            alt=""
                                            className={thumbnail}
                                        />
                                    )}
                                </Link>
                            )}
                        </li>
                    );
                })}
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
