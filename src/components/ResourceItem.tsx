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
    <div>
        {name && (
            <p>
                {link ? (
                    <a href={link} target="_blank" rel="noreferrer">
                        {name}
                    </a>
                ) : (
                    name
                )}
            </p>
        )}
        <ExpandableText
            fullText={description}
            onExpand={onExpand}
            shortText={shortDescription}
        />
    </div>
);

export default ResourceItem;
