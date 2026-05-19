import React from "react";

import ExpandableText from "./ExpandableText";

interface ResourceItemProps {
    description?: string | null;
    link?: string | null;
    name?: string | null;
    onExpand?: () => void;
    shortDescription?: string | null;
}

const ResourceItem: React.FC<ResourceItemProps> = ({
    description,
    link,
    name,
    onExpand,
    shortDescription,
}) => (
    <li>
        {name && (
            <span>
                {link ? (
                    <a href={link} target="_blank" rel="noreferrer">
                        {name}
                    </a>
                ) : (
                    name
                )}
            </span>
        )}
        <ExpandableText
            fullText={description}
            onExpand={onExpand}
            shortText={shortDescription}
        />
    </li>
);

export default ResourceItem;
