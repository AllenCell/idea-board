import React from "react";

import { Collapse } from "antd";
import type { CollapseProps } from "antd";

import { RESOURCE_TYPES } from "../constants/resourceTypes";
import { ResourceNode } from "../types";
import { NameWithLink } from "../utils/formattingUtils";
import { CustomReactMarkdown } from "./CustomReactMarkdown";

const { section, sectionTitle } = require("../style/idea-post.module.css");
const { subText } = require("../style/materials.module.css");

interface MaterialsAndMethodsProps {
    resources: ResourceNode[];
}

export const MaterialsAndMethodsComponent: React.FC<
    MaterialsAndMethodsProps
> = ({ resources }) => {
    const byType = (type: string) => resources.filter((r) => r.type === type);

    const datasets = byType(RESOURCE_TYPES.DATASET);
    const softwareTools = byType(RESOURCE_TYPES.SOFTWARE_TOOL);
    const cellLines = byType(RESOURCE_TYPES.CELL_LINE);
    const protocols = [
        ...byType(RESOURCE_TYPES.PROTOCOL_LINK),
        ...byType(RESOURCE_TYPES.PROTOCOL_FILE),
    ];

    const items: CollapseProps["items"] = [];

    if (datasets.length > 0) {
        items.push({
            key: "dataset",
            label: "Dataset",
            children: (
                <div>
                    {datasets.map((dataset, index) => (
                        <div key={index}>
                            <p>
                                <strong>Name: </strong>
                                <NameWithLink
                                    name={dataset.name}
                                    link={dataset.link}
                                />
                            </p>
                            {dataset.description && (
                                <div>
                                    <strong>Description:</strong>
                                    <CustomReactMarkdown
                                        content={dataset.description}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ),
        });
    }

    // TODO: protocols haven't been totally fleshed out yet
    if (protocols.length > 0) {
        items.push({
            key: "protocols",
            label: "Protocols",
            children: (
                <ul>
                    {protocols.map((item, index) => (
                        <li key={index}>
                            <NameWithLink name={item.name} link={item.link} />
                        </li>
                    ))}
                </ul>
            ),
        });
    }

    if (cellLines.length > 0) {
        items.push({
            key: "cellLines",
            label: "Cell Lines",
            children: (
                <ul>
                    {cellLines.map((item, index) => (
                        <li key={index}>
                            <NameWithLink name={item.name} link={item.link} />
                        </li>
                    ))}
                </ul>
            ),
        });
    }

    if (softwareTools.length > 0) {
        items.push({
            key: "software",
            label: "Software Tools",
            children: (
                <div>
                    {softwareTools.map((tool, index) => (
                        <div key={index}>
                            <p>
                                <strong>Name: </strong>
                                <NameWithLink
                                    name={tool.name}
                                    link={tool.link}
                                />
                            </p>
                            {tool.description && (
                                <div>
                                    <strong>Description: </strong>
                                    <CustomReactMarkdown
                                        content={tool.description}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ),
        });
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div className={section}>
            <h2 className={sectionTitle}>Materials and methods available:</h2>
            <Collapse items={items} />
            <div className={subText}>
                Data and tools made available for use by researchers, that may
                be of use in pursuing this idea, some available free online, and
                some available to be purchased or licensed through AICS.
            </div>
        </div>
    );
};
