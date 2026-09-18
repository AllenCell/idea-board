import React from "react";

import { Link, graphql, useStaticQuery } from "gatsby";

import FigureThumbnail from "./FigureThumbnail";
import { MaturityBadge } from "./MaturityBadge";
import { TagPopover } from "./TagPopover";

const {
    acceleratorEyebrow,
    byline,
    container,
    draftBadge,
    emptyState,
    eyebrowTag,
    listItem,
    tagEyebrow,
    tagSeparator,
    textBlock,
    thumbnail,
    title,
    titleRow,
} = require("../style/idea-roll.module.css");

type IdeaNode = Queries.IdeaRollQuery["allIdeaPost"]["nodes"][number];

type IdeaListItem = Omit<IdeaNode, "resources"> & {
    dataset: string | null;
};

interface IdeaRollProps {
    count?: number;
    /** Slug of an accelerator to narrow the list to. */
    acceleratorSlug?: string;
}

const THUMBNAIL_SIZE = { width: 88, height: 56 };

const IdeaRoll = ({ acceleratorSlug, count }: IdeaRollProps) => {
    const queryData = useStaticQuery(graphql`
        query IdeaRoll {
            allIdeaPost(sort: { date: DESC }) {
                nodes {
                    id
                    slug
                    title
                    tags
                    maturity
                    draft
                    accelerators {
                        name
                        slug
                    }
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
                                        width: 88
                                        height: 56
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

    const allNodes: IdeaNode[] = queryData.allIdeaPost.nodes;
    const matching = acceleratorSlug
        ? allNodes.filter((post) =>
              post.accelerators.some((a) => a?.slug === acceleratorSlug),
          )
        : allNodes;
    const nodes: IdeaNode[] = matching.slice(0, count);
    const ideas: IdeaListItem[] = nodes.map((post) => ({
        ...post,
        dataset:
            post.resources.find((r) => r?.type === "dataset")?.name ?? null,
    }));

    if (ideas.length === 0) {
        return <p className={emptyState}>No ideas yet.</p>;
    }

    return (
        <>
            <ul className={container}>
                {ideas.map((item) => {
                    const firstFigure =
                        item.preliminaryFindings?.figures?.[0] ?? null;

                    return (
                        <li key={item.id} className={listItem}>
                            <div className={textBlock}>
                                {(item.accelerators.length > 0 ||
                                    item.tags.length > 0) && (
                                    <div className={tagEyebrow}>
                                        {item.accelerators.map(
                                            (accelerator) => (
                                                <Link
                                                    key={accelerator.slug}
                                                    to={accelerator.slug}
                                                    className={
                                                        acceleratorEyebrow
                                                    }
                                                >
                                                    {accelerator.name}
                                                </Link>
                                            ),
                                        )}
                                        {item.tags.map((tag, i) => (
                                            <React.Fragment key={tag}>
                                                {(i > 0 ||
                                                    item.accelerators.length >
                                                        0) && (
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
                                <div className={titleRow}>
                                    <Link to={item.slug} className={title}>
                                        {item.title}
                                    </Link>
                                    {item.maturity && (
                                        <MaturityBadge
                                            maturity={item.maturity}
                                        />
                                    )}
                                    {item.draft && (
                                        <span className={draftBadge}>
                                            Draft
                                        </span>
                                    )}
                                </div>
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

                            {firstFigure && (
                                <Link
                                    to={item.slug}
                                    tabIndex={-1}
                                    aria-hidden="true"
                                >
                                    <FigureThumbnail
                                        style={{
                                            width: THUMBNAIL_SIZE.width,
                                            height: THUMBNAIL_SIZE.height,
                                        }}
                                        figure={firstFigure}
                                        className={thumbnail}
                                    />
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
