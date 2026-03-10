import React from "react";

import { ResourceNode } from "../types";

interface ResourceComponentProps {
    resources: ResourceNode[];
}

// TODO: this is a placeholder, and we will remove it when MaterialsAndMethods starts consuming
// the new resource collection
export const ResourcesComponent: React.FC<ResourceComponentProps> = ({
    resources,
}) => {
    if (!resources || resources.length === 0) {
        return null;
    }

    const renderResourceItem = (resource: ResourceNode) => {
        if (!resource) {
            return null;
        }
        return (
            <li>
                <a href={resource.link ?? ""} target="_blank" rel="noreferrer">
                    {resource.name}
                </a>
                {resource.description && <p>{resource.description}</p>}
            </li>
        );
    };
    return (
        <div>
            <h2>Resources</h2>
            {resources.map((resource, index) => (
                <div key={index}>{renderResourceItem(resource)}</div>
            ))}
        </div>
    );
};

export default ResourcesComponent;
