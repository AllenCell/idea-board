import React, { useEffect, useState } from "react";

import { Collapse } from "antd";

import { RESOURCE_GROUP_AUTO_EXPAND_LIMIT } from "../constants";
import { RESOURCE_TYPES } from "../constants/resourceTypes";
import { ResourceNode } from "../types";
import { CustomReactMarkdown } from "./CustomReactMarkdown";
import ResourceItem from "./ResourceItem";

const {
    publicationText,
    resourceCount,
    resourceGroup,
    resourceGroupLabel,
    resourceList,
} = require("../style/idea-post.module.css");

interface MaterialsAndMethodsProps {
    resources: ResourceNode[];
    publication?: string | null;
    /** Per-idea relevance notes, keyed by resource slug. */
    relevanceBySlug?: Map<string, string>;
    onExpandDescription?: (
        content: string,
        label: string,
        sectionKey: string,
    ) => void;
}

// `content` is a node so the publication can sit in the accordion too
interface ResourceGroup {
    key: string;
    label: string;
    count: number;
    content: React.ReactNode;
}

export const MaterialsAndMethodsComponent: React.FC<
    MaterialsAndMethodsProps
> = ({ onExpandDescription, publication, relevanceBySlug, resources }) => {
    const byType = (type: string) => resources.filter((r) => r.type === type);

    const typeGroups = [
        {
            key: "datasets",
            label: "Datasets",
            items: byType(RESOURCE_TYPES.DATASET),
        },
        {
            key: "cell-lines",
            label: "Cell Lines",
            items: byType(RESOURCE_TYPES.CELL_LINE),
        },
        {
            key: "protocols",
            label: "Protocols",
            items: [
                ...byType(RESOURCE_TYPES.PROTOCOL_LINK),
                ...byType(RESOURCE_TYPES.PROTOCOL_FILE),
            ],
        },
        {
            key: "software-tools",
            label: "Software Tools",
            items: byType(RESOURCE_TYPES.SOFTWARE_TOOL),
        },
        {
            key: "images",
            label: "Images",
            items: byType(RESOURCE_TYPES.IMAGE),
        },
    ].filter((group) => group.items.length > 0);

    const groups: ResourceGroup[] = [
        // Publication leads, matching the order of the page nav
        ...(publication?.trim()
            ? [
                  {
                      key: "publication",
                      label: "Publication",
                      count: 1,
                      content: (
                          <ul className={resourceList}>
                              <li>
                                  <CustomReactMarkdown
                                      className={publicationText}
                                      content={publication}
                                  />
                              </li>
                          </ul>
                      ),
                  },
              ]
            : []),
        ...typeGroups.map((group) => ({
            key: group.key,
            label: group.label,
            count: group.items.length,
            content: (
                <ul className={resourceList}>
                    {group.items.map((item, index) => (
                        <ResourceItem
                            key={item.slug ?? index}
                            resource={item}
                            relevance={
                                item.slug
                                    ? relevanceBySlug?.get(item.slug)
                                    : undefined
                            }
                            sectionKey={group.key}
                            onExpand={onExpandDescription}
                        />
                    ))}
                </ul>
            ),
        })),
    ];

    const total = groups.reduce((sum, group) => sum + group.count, 0);

    // Short lists open; long ones are what the accordion is for.
    const [openKeys, setOpenKeys] = useState<string[]>(() =>
        total <= RESOURCE_GROUP_AUTO_EXPAND_LIMIT
            ? groups.map((group) => group.key)
            : [],
    );

    // Open a group when a shared link points at it.
    useEffect(() => {
        const openFromHash = () => {
            const key = window.location.hash.replace("#", "");
            if (!key) return;
            setOpenKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
        };
        openFromHash();
        window.addEventListener("hashchange", openFromHash);
        return () => window.removeEventListener("hashchange", openFromHash);
    }, []);

    if (groups.length === 0) {
        return null;
    }

    const toggle = (key: string) =>
        setOpenKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
        );

    return (
        <>
            {groups.map((group) => (
                <div className={resourceGroup} id={group.key} key={group.key}>
                    <Collapse
                        ghost
                        activeKey={
                            openKeys.includes(group.key) ? [group.key] : []
                        }
                        onChange={() => toggle(group.key)}
                        items={[
                            {
                                key: group.key,
                                label: (
                                    <span className={resourceGroupLabel}>
                                        {group.label}
                                        <span className={resourceCount}>
                                            {group.count}
                                        </span>
                                    </span>
                                ),
                                children: group.content,
                            },
                        ]}
                    />
                </div>
            ))}
        </>
    );
};
