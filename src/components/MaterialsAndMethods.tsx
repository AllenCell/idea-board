import React from "react";
import { Collapse } from "antd";
import type { CollapseProps } from "antd";

import { CellLineItem, MaterialsAndMethods, SoftwareTool } from "../types";

const { subText } = require("../style/materials.module.css");

export const MaterialsAndMethodsComponent: React.FC<{
    materialsAndMethods: MaterialsAndMethods;
}> = ({ materialsAndMethods }) => {
    const datasetFm = materialsAndMethods?.dataset?.frontmatter;

    const getCellLineRender = (cellLine: CellLineItem) => {
        if (!cellLine.link) {
            return cellLine.name;
        }
        return (
            <a href={cellLine.link} target="_blank" rel="noreferrer">
                {cellLine.name}
            </a>
        );
    };

    const getSoftwareToolRender = (
        software: SoftwareTool,
        index: number
    ) => {
        const { name, description, link } = software.softwareTool.frontmatter;
        const displayDescription = software.customDescription || description;

        const title = link ? (
            <p>
                <strong>{`Name: `}</strong>
                <a href={link} target="_blank" rel="noreferrer">
                    {name}
                </a>
            </p>
        ) : (
            <p>
                <strong>{`Name: `}</strong>
                {name}
            </p>
        );
        return (
            <div key={index}>
                {title}
                {displayDescription && (
                    <p>
                        <strong>{`Description: `}</strong>
                        {displayDescription}
                    </p>
                )}
            </div>
        );
    };

    const items: CollapseProps["items"] = [];

    // Dataset section
    if (datasetFm) {
        items.push({
            key: "dataset",
            label: "Dataset",
            children: (
                <div>
                    <p>
                        <strong>Name:</strong>{" "}
                        {datasetFm.link ? (
                            <a
                                href={datasetFm.link}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {datasetFm.name}
                            </a>
                        ) : (
                            datasetFm.name
                        )}
                    </p>
                    {datasetFm.description && (
                        <p>
                            <strong>Description:</strong>{" "}
                            {datasetFm.description}
                        </p>
                    )}
                </div>
            ),
        });
    }

    // Protocols section
    if (
        materialsAndMethods?.protocols &&
        materialsAndMethods.protocols.length > 0
    ) {
        items.push({
            key: "protocols",
            label: "Protocols",
            children: (
                <ul>
                    {materialsAndMethods.protocols.map((item, index) => (
                        <li key={index}>
                            <a
                                href={item.protocol}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {item.protocol.split("/").pop()}
                            </a>
                        </li>
                    ))}
                </ul>
            ),
        });
    }

    // Cell lines section
    if (
        materialsAndMethods?.cellLines &&
        materialsAndMethods.cellLines.length > 0
    ) {
        items.push({
            key: "cellLines",
            label: "Cell Lines",
            children: (
                <ul>
                    {materialsAndMethods.cellLines.map((item, index) => (
                        <li key={index}>{getCellLineRender(item)}</li>
                    ))}
                </ul>
            ),
        });
    }

    // Software tools section
    if (
        materialsAndMethods?.software &&
        materialsAndMethods.software.length > 0
    ) {
        items.push({
            key: "software",
            label: "Software Tools",
            children: (
                <div>
                    {materialsAndMethods.software.map((item, index) =>
                        getSoftwareToolRender(item, index)
                    )}
                </div>
            ),
        });
    }

    // Don't render if there are no items
    if (items.length === 0) {
        return null;
    }

    return (
        <div>
            <Collapse items={items} />
            <div className={subText}>
                Data and tools made available for use by researchers, that may
                be of use in pursuing this idea, some available free online, and
                some available to be purchased or licensed through AICS.
            </div>
        </div>
    );
};
