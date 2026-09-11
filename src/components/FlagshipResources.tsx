import React from "react";

import { ResourceNode } from "../types";
import FlagshipResourceCard from "./FlagshipResourceCard";

const { flagshipGrid } = require("../style/idea-post.module.css");

interface FlagshipResourcesProps {
    resources: readonly ResourceNode[];
    relevanceBySlug?: Map<string, string>;
    onExpandDescription?: (
        content: string,
        label: string,
        sectionKey: string,
    ) => void;
}

export const FlagshipResources: React.FC<FlagshipResourcesProps> = ({
    onExpandDescription,
    relevanceBySlug,
    resources,
}) => {
    // Decap's preview yields slug strings until a relation hydrates.
    const resolved = resources.filter(
        (r): r is ResourceNode => typeof r === "object" && r !== null,
    );

    if (resolved.length === 0) {
        return null;
    }

    return (
        <ul className={flagshipGrid}>
            {resolved.map((resource, index) => (
                <FlagshipResourceCard
                    key={resource.slug ?? resource.name ?? index}
                    resource={resource}
                    relevance={
                        resource.slug
                            ? relevanceBySlug?.get(resource.slug)
                            : undefined
                    }
                    onExpandDescription={onExpandDescription}
                />
            ))}
        </ul>
    );
};

export default FlagshipResources;
