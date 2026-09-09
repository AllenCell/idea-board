/**
 * Shared by the flagship cards and the grouped resource list, so the two can't
 * drift. Typed structurally to stay independent of GraphQL codegen.
 */

export interface ResourceDetailLink {
    name: string;
    url: string;
    description?: string | null;
}

interface GatsbyImageLike {
    childImageSharp?: {
        gatsbyImageData?: { images?: { fallback?: { src?: string } } };
    } | null;
}

export interface ResourceDetailSource {
    altText?: string | null;
    imageFile?: GatsbyImageLike | null;
    description?: string | null;
    file?: string | null;
    host?: string | null;
    imageUrl?: string | null;
    links?: readonly ResourceDetailLink[] | null;
    readmeLink?: string | null;
    shortDescription?: string | null;
    status?: string | null;
    viewerUrl?: string | null;
}

export interface LabelledValue {
    label: string;
    value: string;
}

const isNonEmpty = (value?: string | null): value is string =>
    typeof value === "string" && value.trim() !== "";

/** Attributes worth showing at a glance, in fixed display order. */
export function getResourceFacts(
    resource: ResourceDetailSource,
): LabelledValue[] {
    const candidates: Array<{ label: string; value?: string | null }> = [
        { label: "Status", value: resource.status },
        { label: "Host", value: resource.host },
    ];
    return candidates
        .filter((f) => isNonEmpty(f.value))
        .map((f) => ({ label: f.label, value: f.value as string }));
}

/** A plain URL for the resource's image, usable in markdown or an <img>. */
export function getResourceImageSrc(
    resource: ResourceDetailSource,
): string | null {
    if (isNonEmpty(resource.imageUrl)) return resource.imageUrl;
    return (
        resource.imageFile?.childImageSharp?.gatsbyImageData?.images?.fallback
            ?.src ?? null
    );
}

/**
 * Every link for a resource, most specific first: the interactive viewer, then
 * authored links, then the README and file attachment.
 */
export function getResourceLinks(
    resource: ResourceDetailSource,
): ResourceDetailLink[] {
    const links: ResourceDetailLink[] = [];
    if (isNonEmpty(resource.viewerUrl)) {
        links.push({ name: "Open viewer", url: resource.viewerUrl });
    }
    (resource.links ?? [])
        .filter((link) => isNonEmpty(link?.url))
        .forEach((link, i) => {
            links.push({
                name: isNonEmpty(link.name) ? link.name : `Link ${i + 1}`,
                url: link.url,
                description: link.description,
            });
        });
    if (isNonEmpty(resource.readmeLink)) {
        links.push({ name: "README", url: resource.readmeLink });
    }
    if (isNonEmpty(resource.file)) {
        links.push({ name: "Download", url: resource.file });
    }
    return links;
}

/** The URL a resource's title links to, if any. */
export function getPrimaryResourceLink(
    resource: ResourceDetailSource,
): string | null {
    return getResourceLinks(resource)[0]?.url ?? null;
}

/** All links bar the primary, which the title already points at. */
export function getSecondaryResourceLinks(
    resource: ResourceDetailSource,
): ResourceDetailLink[] {
    const [, ...rest] = getResourceLinks(resource);
    return rest;
}

/** True when expanding would reveal more than is already on screen. */
export function hasExpandableDetail(resource: ResourceDetailSource): boolean {
    return (
        isNonEmpty(resource.description) ||
        getResourceLinks(resource).some((l) => isNonEmpty(l.description))
    );
}

/** Everything known about a resource, as markdown for the expanded view. */
export function buildResourceDetailMarkdown(
    resource: ResourceDetailSource,
): string {
    const sections: string[] = [];

    const imageSrc = getResourceImageSrc(resource);
    if (imageSrc) {
        sections.push(`![${resource.altText ?? ""}](${imageSrc})`);
    }

    const body = isNonEmpty(resource.description)
        ? resource.description
        : resource.shortDescription;
    if (isNonEmpty(body)) {
        sections.push(body.trim());
    }

    const facts = getResourceFacts(resource);
    if (facts.length > 0) {
        const rows = facts
            .map((f) => `- **${f.label}:** ${f.value}`)
            .join("\n");
        sections.push(`### Details\n\n${rows}`);
    }

    const links = getResourceLinks(resource);
    if (links.length > 0) {
        const rows = links
            .map((link) => {
                const note = isNonEmpty(link.description)
                    ? ` — ${link.description.trim()}`
                    : "";
                return `- [${link.name}](${link.url})${note}`;
            })
            .join("\n");
        sections.push(`### Links\n\n${rows}`);
    }

    return sections.join("\n\n");
}
