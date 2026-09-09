import React from "react";

import { Button } from "antd";

import { MAX_LIST_DESCRIPTION_LENGTH } from "../constants";
import { ResourceNode } from "../types";
import {
    ResourceDetailSource,
    buildResourceDetailMarkdown,
    getPrimaryResourceLink,
    getResourceFacts,
    hasExpandableDetail,
} from "../utils/resourceDetail";
import { truncateAtWord } from "../utils/utils";
import { CustomReactMarkdown } from "./CustomReactMarkdown";
import FigureThumbnail from "./FigureThumbnail";

const {
    resourceItem,
    resourceItemBlurb,
    resourceItemBody,
    resourceItemMeta,
    resourceItemName,
    resourceItemThumb,
    resourceTextButton,
} = require("../style/idea-post.module.css");

interface ResourceItemProps {
    resource: ResourceNode;
    sectionKey: string;
    onExpand?: (content: string, label: string, sectionKey: string) => void;
}

/**
 * A one-line-ish blurb. Authors give wildly varying amounts here — some
 * resources have nothing but a name, others a full document — so the short
 * description wins and a long description is clipped rather than dumped.
 */
function getBlurb(resource: ResourceDetailSource): string | null {
    if (resource.shortDescription?.trim()) {
        return resource.shortDescription.trim();
    }
    const description = resource.description?.trim();
    if (!description) {
        return null;
    }
    return description.length > MAX_LIST_DESCRIPTION_LENGTH
        ? truncateAtWord(description, MAX_LIST_DESCRIPTION_LENGTH)
        : description;
}

const ResourceItem: React.FC<ResourceItemProps> = ({
    onExpand,
    resource,
    sectionKey,
}) => {
    const detail: ResourceDetailSource = resource;
    const link = getPrimaryResourceLink(detail);
    const blurb = getBlurb(detail);
    const facts = getResourceFacts(detail);
    const canExpand = Boolean(onExpand) && hasExpandableDetail(detail);
    const hasThumb = Boolean(resource.imageFile || detail.imageUrl);

    return (
        <li className={resourceItem}>
            {hasThumb && (
                <FigureThumbnail
                    alt={detail.altText ?? ""}
                    className={resourceItemThumb}
                    figure={{ file: resource.imageFile, url: detail.imageUrl }}
                />
            )}
            <div className={resourceItemBody}>
                {resource.name && (
                    <span className={resourceItemName}>
                        {link ? (
                            <a href={link} target="_blank" rel="noreferrer">
                                {resource.name}
                            </a>
                        ) : (
                            resource.name
                        )}
                    </span>
                )}
                {blurb && (
                    <CustomReactMarkdown
                        className={resourceItemBlurb}
                        content={blurb}
                    />
                )}
                {facts.length > 0 && (
                    <div className={resourceItemMeta}>
                        {facts.map((fact) => (
                            <span key={fact.label}>
                                {fact.label} {fact.value}
                            </span>
                        ))}
                    </div>
                )}
                {canExpand && (
                    <Button
                        className={resourceTextButton}
                        type="link"
                        onClick={() =>
                            onExpand!(
                                buildResourceDetailMarkdown(detail),
                                resource.name ?? "Resource",
                                sectionKey,
                            )
                        }
                    >
                        See more
                    </Button>
                )}
            </div>
        </li>
    );
};

export default ResourceItem;
