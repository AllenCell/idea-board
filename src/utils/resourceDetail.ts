/**
 * Helpers for presenting a resource.
 *
 * Both the flagship cards and the grouped resource list need the same three
 * things — the facts worth showing at a glance, which link is the primary one,
 * and a full record for the expanded view — so they live here rather than being
 * derived twice and drifting apart.
 *
 * The input is declared structurally rather than as the generated `ResourceNode`
 * so these functions and their tests don't depend on GraphQL codegen.
 */

export interface ResourceDetailLink {
    name: string;
    url: string;
    description?: string | null;
}

export interface ResourceDetailSource {
    altText?: string | null;
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

/**
 * Structured attributes worth showing at a glance. Order is fixed rather than
 * type-driven; a type simply leaves the ones it doesn't use empty.
 */
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

/**
 * Links shown as chips beside a resource: the primary one is omitted because
 * the title already points at it.
 */
export function getSecondaryResourceLinks(
    resource: ResourceDetailSource,
): ResourceDetailLink[] {
    const [, ...rest] = getResourceLinks(resource);
    return rest;
}

/**
 * True when expanding would reveal more than is already on screen. Callers show
 * the short description, facts and link chips in full, so only the full
 * description and per-link notes are held back.
 */
export function hasExpandableDetail(resource: ResourceDetailSource): boolean {
    return (
        isNonEmpty(resource.description) ||
        getResourceLinks(resource).some((l) => isNonEmpty(l.description))
    );
}

/**
 * Composes the markdown shown in the expanded view: everything known about the
 * resource, not just its description.
 *
 * Headings are `###` to sit under the view's own `<h3>` title and to match the
 * heading level authors already use inside `description`.
 */
export function buildResourceDetailMarkdown(
    resource: ResourceDetailSource,
): string {
    const sections: string[] = [];

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
