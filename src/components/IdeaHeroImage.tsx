import React from "react";

import { ResourceNode } from "../types";
import {
    ResourceDetailSource,
    getPrimaryResourceLink,
    getResourceImageSrc,
} from "../utils/resourceDetail";
import ResourceImage from "./ResourceImage";

const {
    heroCaption,
    heroFigure,
    heroImage,
} = require("../style/idea-post.module.css");

interface IdeaHeroImageProps {
    resources: readonly ResourceNode[];
}

/** The first flagship resource carrying an image, shown at the top of the idea. */
export const IdeaHeroImage: React.FC<IdeaHeroImageProps> = ({ resources }) => {
    const resource = resources.find(
        (r) =>
            typeof r === "object" &&
            r !== null &&
            getResourceImageSrc(r) !== null,
    );
    if (!resource) {
        return null;
    }

    const detail: ResourceDetailSource = resource;
    const link = getPrimaryResourceLink(detail);
    const image = (
        <ResourceImage
            alt={detail.altText ?? ""}
            className={heroImage}
            imageFile={resource.imageFile}
            imageUrl={detail.imageUrl}
        />
    );

    return (
        <figure className={heroFigure}>
            {link ? (
                <a href={link} target="_blank" rel="noreferrer">
                    {image}
                </a>
            ) : (
                image
            )}
            <figcaption className={heroCaption}>
                {resource.name}
                {link && (
                    <a href={link} target="_blank" rel="noreferrer">
                        {detail.viewerUrl ? "Open viewer" : "Open"}
                    </a>
                )}
            </figcaption>
        </figure>
    );
};

export default IdeaHeroImage;
