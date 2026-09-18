import React from "react";

import { Link, graphql, useStaticQuery } from "gatsby";

const {
    filterLabel,
    filterLink,
    filterLinkActive,
    filterRow,
} = require("../style/accelerator-filter.module.css");

interface AcceleratorFilterProps {
    /** Slug of the accelerator currently being shown, if any. */
    activeSlug?: string;
}

/**
 * Each option is a link to a real page rather than a stateful control, so the
 * filtered view is shareable and the back button works.
 */
export const AcceleratorFilter: React.FC<AcceleratorFilterProps> = ({
    activeSlug,
}) => {
    const data = useStaticQuery(graphql`
        query AcceleratorFilterOptions {
            allAccelerator(
                sort: { name: ASC }
                filter: { active: { eq: true } }
            ) {
                nodes {
                    slug
                    name
                }
            }
            allIdeaPost {
                nodes {
                    accelerators {
                        slug
                    }
                }
            }
        }
    `);

    // An accelerator with no ideas keeps its page but earns no button
    const used = new Set<string>();
    data.allIdeaPost.nodes.forEach(
        (idea: { accelerators: { slug: string }[] }) =>
            idea.accelerators.forEach((a) => used.add(a.slug)),
    );

    const accelerators = data.allAccelerator.nodes.filter(
        (accelerator: { slug: string }) =>
            used.has(accelerator.slug) || accelerator.slug === activeSlug,
    );
    if (accelerators.length === 0) {
        return null;
    }

    return (
        <nav className={filterRow} aria-label="Filter ideas by accelerator">
            <span className={filterLabel}>Accelerator</span>
            <Link
                to="/"
                className={activeSlug ? filterLink : filterLinkActive}
                aria-current={activeSlug ? undefined : "page"}
            >
                All ideas
            </Link>
            {accelerators.map(
                (accelerator: { slug: string; name: string | null }) => {
                    const isActive = accelerator.slug === activeSlug;
                    return (
                        <Link
                            key={accelerator.slug}
                            to={accelerator.slug}
                            className={isActive ? filterLinkActive : filterLink}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {accelerator.name}
                        </Link>
                    );
                },
            )}
        </nav>
    );
};

export default AcceleratorFilter;
