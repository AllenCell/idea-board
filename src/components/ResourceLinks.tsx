import React from "react";

import { ResourceLink } from "../types";

interface ResourceLinksProps {
    name: string | null | undefined;
    links: readonly ResourceLink[] | null;
}

export const ResourceLinks: React.FC<ResourceLinksProps> = ({
    links,
    name,
}) => {
    if (!links || links.length === 0) {
        return <>{name}</>;
    }

    if (links.length === 1) {
        return (
            <a
                href={links[0].url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {links[0].name || name}
            </a>
        );
    }

    return (
        <div>
            {name}
            <ul style={{ margin: "4px 0" }}>
                {links.map((l, i) => (
                    <li key={i}>
                        <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {l.name || l.url}
                        </a>
                        {l.description ? ` — ${l.description}` : null}
                    </li>
                ))}
            </ul>
        </div>
    );
};
