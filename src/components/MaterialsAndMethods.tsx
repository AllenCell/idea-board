import React from "react";
import { Collapse } from "antd";
import type { CollapseProps } from "antd";
import { CellLine, MaterialsAndMethods, SoftwareTool } from "../types";

const { section, sectionTitle } = require("../style/idea-post.module.css");

const { subText } = require("../style/materials.module.css");

export const MaterialsAndMethodsComponent: React.FC<MaterialsAndMethods> = ({
    dataset,
    cellLines,
    protocols,
    software,
}) => {
    const datasetFm = dataset?.frontmatter ?? null;

    const getCellLineRender = (cellLine: CellLine) => {
        if (!cellLine.link) {
            return cellLine.name;
        }
        return (
            <a href={cellLine.link} target="_blank" rel="noreferrer noopener">
                {cellLine.name}
            </a>
        );
    };

    const getSoftwareToolRender = (software: SoftwareTool, index: number) => {
        const { name, description, link } =
            software.softwareTool?.frontmatter ?? {};
        const displayDescription = software.customDescription ?? description;

        const title = link ? (
            <p>
                <strong>{`Name: `}</strong>
                <a href={link} target="_blank" rel="noreferrer noopener">
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
                                rel="noreferrer noopener"
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
    if (protocols.length > 0) {
        items.push({
            key: "protocols",
            label: "Protocols",
            children: (
                <ul>
                    {protocols.map((item, index) => {
                        const href =
                            item.type === "protocolLink"
                                ? item.url
                                : item.file?.publicURL;
                        return (
                            <li key={index}>
                                <a
                                    href={href ?? "#"}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {item.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            ),
        });
    }

    // Cell lines section
    if (cellLines.length > 0) {
        items.push({
            key: "cellLines",
            label: "Cell Lines",
            children: (
                <ul>
                    {cellLines.map((item, index) => (
                        <li key={index}>{getCellLineRender(item)}</li>
                    ))}
                </ul>
            ),
        });
    }

    // Software tools section
    if (software.length > 0) {
        items.push({
            key: "software",
            label: "Software Tools",
            children: (
                <div>
                    {software.map((item, index) =>
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
