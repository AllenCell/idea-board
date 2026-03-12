import React from "react";

import { MaterialsAndMethods } from "../types";
import ResourceItem from "./ResourceItem";

const { section, sectionTitle } = require("../style/idea-post.module.css");

interface MaterialsAndMethodsProps {
    materialsAndMethods: MaterialsAndMethods;
    onExpandDescription?: (
        content: string,
        label: string,
        sectionKey: string,
    ) => void;
}

export const MaterialsAndMethodsComponent: React.FC<
    MaterialsAndMethodsProps
> = ({ materialsAndMethods, onExpandDescription }) => {
    const { cellLines, dataset, protocols, software } = materialsAndMethods;
    const dsfm = dataset?.frontmatter ?? null;

    return (
        <>
            {dsfm && (
                <div id="datasets" className={section}>
                    <h4 className={sectionTitle}>Datasets</h4>
                    <ResourceItem
                        description={dsfm.description}
                        link={dsfm.link}
                        name={dsfm.name}
                        onExpand={
                            onExpandDescription && dsfm.description
                                ? () =>
                                      onExpandDescription(
                                          dsfm.description!,
                                          dsfm.name ?? "Dataset",
                                          "datasets",
                                      )
                                : undefined
                        }
                        shortDescription={dsfm.shortDescription}
                    />
                </div>
            )}

            {cellLines?.length > 0 && (
                <div id="cell-lines" className={section}>
                    <h4 className={sectionTitle}>Cell Lines</h4>
                    {cellLines.map((item, index) => (
                        <ResourceItem
                            key={index}
                            link={item.link}
                            name={item.name}
                        />
                    ))}
                </div>
            )}

            {protocols?.length > 0 && (
                <div id="protocols" className={section}>
                    <h4 className={sectionTitle}>Protocols</h4>
                    <ul>
                        {protocols.map((item, index) => (
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
                </div>
            )}

            {software?.length > 0 && (
                <div id="software-tools" className={section}>
                    <h4 className={sectionTitle}>Software Tools</h4>
                    {software.map((item, index) => {
                        const { description, link, name } =
                            item.softwareTool?.frontmatter ?? {};
                        const displayDescription =
                            item.customDescription ?? description;
                        return (
                            <ResourceItem
                                key={index}
                                description={displayDescription}
                                link={link}
                                name={name}
                                onExpand={
                                    onExpandDescription && displayDescription
                                        ? () =>
                                              onExpandDescription(
                                                  displayDescription,
                                                  name ?? "Software Tool",
                                                  "software-tools",
                                              )
                                        : undefined
                                }
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
};
