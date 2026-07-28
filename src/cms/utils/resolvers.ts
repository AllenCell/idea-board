import { ResourceNode } from "../../types";
import { fromImmutable } from "./immutable";

/** Decap's Immutable metadata side-channel, keyed [field, collection, value]. */
export interface FieldsMetaData {
    getIn: (path: string[]) => unknown;
}

/**
 * Relation widgets (referenced via dropdowns in the CMS) need their cotent resolved
 * via Decap's metadata side-channel.
 *
 * Relation widgets store only the value_field (a name or slug) in entry data;
 * Decap stashes the full referenced node in `fieldsMetaData` under
 * [field, collection, value]. This is populated asynchronously — on opening an
 * existing entry the relation control hydrates the selected values — so this
 * returns null until the lookup resolves. Each caller supplies the shape its
 * template needs and decides how to handle null (fall back, or filter out).
 */
export function resolveRelation(
    fieldsMetaData: FieldsMetaData | undefined,
    field: string,
    collection: string,
    value: string,
): Record<string, unknown> | null {
    return fromImmutable<Record<string, unknown>>(
        fieldsMetaData?.getIn([field, collection, value]),
    );
}

/**
 * Map an array of relation values (value_field strings) through a resolver,
 * dropping entries that haven't hydrated yet (resolver returned null). Decap
 * hands relation values as an array of value_field strings in the preview, so
 * non-string entries are ignored.
 */
export function resolveRelationList<T>(
    values: unknown,
    resolve: (value: string) => T | null,
): T[] | undefined {
    if (!Array.isArray(values)) return undefined;
    return values
        .filter((v): v is string => typeof v === "string")
        .map(resolve)
        .filter((v): v is T => v != null);
}

/** The subset of an allenite node the idea post template actually consumes. */
export type ResolvedAllenite = { name: string; contactId: string | null };

/** allenite relation (name) → { name, contactId }; falls back to the bare name. */
export function resolveAllenite(
    fieldsMetaData: FieldsMetaData | undefined,
    field: string,
    name: string,
): ResolvedAllenite {
    const node = resolveRelation(fieldsMetaData, field, "allenite", name);
    return {
        name: typeof node?.name === "string" ? node.name : name,
        contactId: typeof node?.contactId === "string" ? node.contactId : null,
    };
}

/**
 * resource relation (slug) → flattened ResourceNode. The full frontmatter lives
 * in metadata as `{ name, resourceDetails: {...} }`; Gatsby flattens
 * resourceDetails up onto the node (see createNode in gatsby-node.js), so we
 * mirror that. Returns null until hydrated; the caller filters those out.
 */
export function resolveResource(
    fieldsMetaData: FieldsMetaData | undefined,
    slug: string,
): ResourceNode | null {
    const node = resolveRelation(
        fieldsMetaData,
        "resources",
        "resources",
        slug,
    );
    if (!node) return null;
    const { resourceDetails, ...rest } = node;
    const details =
        resourceDetails && typeof resourceDetails === "object"
            ? (resourceDetails as Record<string, unknown>)
            : {};
    return { ...rest, ...details, slug } as unknown as ResourceNode;
}

/**
 * Decap's preview asset resolver. Maps a stored media path to a browser-usable
 * URL, transparently handling both committed public paths (e.g. "/img/x.png")
 * and freshly-uploaded, not-yet-committed files (returned as blob URLs). Returns
 * an AssetProxy whose toString() is the URL.
 */
export type GetAsset = (path: string) => { toString: () => string };

/**
 * Normalize a figure list's uploaded images for preview.
 *
 * In production, uploaded figures are processed by gatsby-transformer-sharp into
 * `file.childImageSharp`; the preview only has the raw upload path in `file`.
 * We resolve that path through getAsset and expose it as `url` — the shape
 * FigureGallery renders with a plain <img>. Figures that already have an external
 * `url` render as-is and pass through untouched.
 */
export function resolveFigures(
    figures: unknown,
    getAsset: GetAsset | undefined,
): Record<string, unknown>[] | undefined {
    if (!Array.isArray(figures)) return undefined;
    return figures.map((figure) => {
        const f = (figure ?? {}) as Record<string, unknown>;
        if (!f.url && getAsset && typeof f.file === "string" && f.file) {
            return { ...f, url: getAsset(f.file).toString() };
        }
        return f;
    });
}

/** The subset of a related idea the template renders (title + routing slug). */
type ResolvedRelatedIdea = { title: string; slug: string };

/**
 * related_ideas relation (slug) → { title, slug }. The stored value is the CMS
 * slug (not the Gatsby routing path), so links can't navigate inside the preview
 * iframe — the template renders these as plain text under isPreview. Falls back
 * to the slug as the label until the title hydrates.
 */
export function resolveRelatedIdea(
    fieldsMetaData: FieldsMetaData | undefined,
    slug: string,
): ResolvedRelatedIdea {
    const node = resolveRelation(
        fieldsMetaData,
        "related_ideas",
        "ideas",
        slug,
    );
    return {
        title: typeof node?.title === "string" ? node.title : slug,
        slug,
    };
}
