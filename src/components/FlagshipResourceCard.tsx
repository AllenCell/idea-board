import React from "react";

import { Button } from "antd";

import { MAX_RESOURCE_DESCRIPTION_LENGTH } from "../constants";
import { getResourceTypeLabel } from "../constants/resourceTypes";
import { ResourceNode } from "../types";
import {
    ResourceDetailSource,
    buildResourceDetailMarkdown,
    getPrimaryResourceLink,
    getResourceFacts,
    getSecondaryResourceLinks,
    hasExpandableDetail,
} from "../utils/resourceDetail";
import { truncateAtWord } from "../utils/utils";
import { CustomReactMarkdown } from "./CustomReactMarkdown";
import FigureThumbnail from "./FigureThumbnail";

const {
    flagshipCard,
    flagshipFact,
    flagshipFactKey,
    flagshipFactRow,
    flagshipFooter,
    flagshipImage,
    flagshipLede,
    flagshipLink,
    flagshipLinkRow,
    flagshipName,
    flagshipTextButton,
    flagshipType,
} = require("../style/idea-post.module.css");

interface FlagshipResourceCardProps {
    resource: ResourceNode;
    onExpandDescription?: (
        content: string,
        label: string,
        sectionKey: string,
    ) => void;
}

/** The opening blurb: the short description, or the description trimmed to fit. */
function getLede(resource: ResourceDetailSource): string | null {
    if (resource.shortDescription?.trim()) {
        return resource.shortDescription;
    }
    if (!resource.description?.trim()) {
        return null;
    }
    return resource.description.length > MAX_RESOURCE_DESCRIPTION_LENGTH
        ? truncateAtWord(resource.description, MAX_RESOURCE_DESCRIPTION_LENGTH)
        : resource.description;
}

export const FlagshipResourceCard: React.FC<FlagshipResourceCardProps> = ({
    onExpandDescription,
    resource,
}) => {
    // Widened once so field access doesn't depend on GraphQL codegen
    const detail: ResourceDetailSource = resource;

    const typeLabel = getResourceTypeLabel(resource.type);
    const primaryLink = getPrimaryResourceLink(detail);
    const secondaryLinks = getSecondaryResourceLinks(detail);
    const facts = getResourceFacts(detail);
    const lede = getLede(detail);
    const canExpand =
        Boolean(onExpandDescription) && hasExpandableDetail(detail);
    const hasFooter =
        facts.length > 0 || secondaryLinks.length > 0 || canExpand;

    /*
     * An image resource may be a plain image or a still of an interactive view.
     * Either way the picture is the point, so it sits above the copy, and it
     * links through to the viewer when there is one.
     */
    const hasImage = Boolean(resource.imageFile || detail.imageUrl);
    const image = hasImage ? (
        <FigureThumbnail
            alt={detail.altText ?? ""}
            className={flagshipImage}
            figure={{ file: resource.imageFile, url: detail.imageUrl }}
        />
    ) : null;

    return (
        <li className={flagshipCard}>
            {typeLabel && <span className={flagshipType}>{typeLabel}</span>}
            <h4 className={flagshipName}>
                {primaryLink ? (
                    <a href={primaryLink} target="_blank" rel="noreferrer">
                        {resource.name}
                    </a>
                ) : (
                    resource.name
                )}
            </h4>

            {image &&
                (primaryLink ? (
                    <a href={primaryLink} target="_blank" rel="noreferrer">
                        {image}
                    </a>
                ) : (
                    image
                ))}

            {lede && (
                <CustomReactMarkdown className={flagshipLede} content={lede} />
            )}

            {hasFooter && (
                <div className={flagshipFooter}>
                    {facts.length > 0 && (
                        <dl className={flagshipFactRow}>
                            {facts.map((fact) => (
                                <div className={flagshipFact} key={fact.label}>
                                    <dt className={flagshipFactKey}>
                                        {fact.label}
                                    </dt>
                                    <dd>{fact.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    {secondaryLinks.length > 0 && (
                        <div className={flagshipLinkRow}>
                            {secondaryLinks.map((link) => (
                                <a
                                    className={flagshipLink}
                                    href={link.url}
                                    key={link.url}
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    )}

                    {canExpand && (
                        <Button
                            className={flagshipTextButton}
                            type="link"
                            onClick={() =>
                                onExpandDescription!(
                                    buildResourceDetailMarkdown(detail),
                                    resource.name ?? "Resource",
                                    "flagship-resources",
                                )
                            }
                        >
                            See more
                        </Button>
                    )}
                </div>
            )}
        </li>
    );
};

export default FlagshipResourceCard;
