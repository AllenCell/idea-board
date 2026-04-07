import React from "react";

import { RESOURCE_TYPES } from "../constants/resourceTypes";
import { ResourceNode } from "../types";
import ResourceItem from "./ResourceItem";

const { section, sectionTitle } = require("../style/idea-post.module.css");

interface MaterialsAndMethodsProps {
    resources: ResourceNode[];
    onExpandDescription?: (
        content: string,
        label: string,
        sectionKey: string,
    ) => void;
}

export const MaterialsAndMethodsComponent: React.FC<
    MaterialsAndMethodsProps
> = ({ onExpandDescription, resources }) => {
    const byType = (type: string) => resources.filter((r) => r.type === type);

    const datasets = byType(RESOURCE_TYPES.DATASET);
    const softwareTools = byType(RESOURCE_TYPES.SOFTWARE_TOOL);
    const cellLines = byType(RESOURCE_TYPES.CELL_LINE);
    const protocols = [
        ...byType(RESOURCE_TYPES.PROTOCOL_LINK),
        ...byType(RESOURCE_TYPES.PROTOCOL_FILE),
    ];

    const hasContent =
        datasets.length > 0 ||
        cellLines.length > 0 ||
        protocols.length > 0 ||
        softwareTools.length > 0;

    if (!hasContent) {
        return null;
    }

    const getPrimaryLink = (resource: ResourceNode): string | null => {
        if (resource.links && resource.links.length > 0) {
            return resource.links[0].url;
        }
        return null;
    };

    return (
        <>
            {datasets.length > 0 && (
                <div id="datasets" className={section}>
                    <h4 className={sectionTitle}>Datasets</h4>
                    {datasets.map((dataset, index) => (
                        <ResourceItem
                            key={index}
                            description={dataset.description}
                            link={getPrimaryLink(dataset)}
                            name={dataset.name}
                            shortDescription={dataset.shortDescription}
                            onExpand={
                                onExpandDescription && dataset.description
                                    ? () =>
                                          onExpandDescription(
                                              dataset.description!,
                                              dataset.name ?? "Dataset",
                                              "datasets",
                                          )
                                    : undefined
                            }
                        />
                    ))}
                </div>
            )}

            {cellLines.length > 0 && (
                <div id="cell-lines" className={section}>
                    <h4 className={sectionTitle}>Cell Lines</h4>
                    {cellLines.map((item, index) => (
                        <ResourceItem
                            key={index}
                            link={getPrimaryLink(item)}
                            name={item.name}
                        />
                    ))}
                </div>
            )}

            {protocols.length > 0 && (
                <div id="protocols" className={section}>
                    <h4 className={sectionTitle}>Protocols</h4>
                    {protocols.map((item, index) => (
                        <ResourceItem
                            key={index}
                            link={getPrimaryLink(item)}
                            name={item.name}
                        />
                    ))}
                </div>
            )}

            {softwareTools.length > 0 && (
                <div id="software-tools" className={section}>
                    <h4 className={sectionTitle}>Software Tools</h4>
                    {softwareTools.map((tool, index) => (
                        <ResourceItem
                            key={index}
                            description={tool.description}
                            link={getPrimaryLink(tool)}
                            name={tool.name}
                            shortDescription={tool.shortDescription}
                            onExpand={
                                onExpandDescription && tool.description
                                    ? () =>
                                          onExpandDescription(
                                              tool.description!,
                                              tool.name ?? "Software Tool",
                                              "software-tools",
                                          )
                                    : undefined
                            }
                        />
                    ))}
                </div>
            )}
        </>
    );
};
