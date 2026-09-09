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

const {
    resourceItem,
    resourceItemBlurb,
    resourceItemMeta,
    resourceItemName,
    resourceTextButton,
} = require("../style/idea-post.module.css");

interface ResourceItemProps {
    resource: ResourceNode;
    sectionKey: string;
    onExpand?: (content: string, label: string, sectionKey: string) => void;
}

/** Short description if there is one, otherwise a clipped description. */
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

    return (
        <li className={resourceItem}>
            <div>
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
