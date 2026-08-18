import React from "react";

import {
    IdeaPostTemplate,
    IdeaPostTemplateProps,
} from "../../templates/idea-post";
import { PreliminaryFindings } from "../../types";
import { ImmutableLike, fromImmutable } from "../utils/immutable";
import {
    FieldsMetaData,
    GetAsset,
    resolveAllenite,
    resolveFigures,
    resolveRelatedIdea,
    resolveRelationList,
    resolveResource,
} from "../utils/resolvers";

interface PreviewProps {
    entry?: ImmutableLike;
    value?: unknown;
    fieldsMetaData?: FieldsMetaData;
    getAsset?: GetAsset;
}

/**
 * Normalize CMS form data into the shape IdeaPostTemplate expects.
 * Decap gives us raw widget values which differ from resolved Gatsby data:
 *   - relation widgets return value_field strings, not resolved objects
 *   - single select widgets return a string, not an array
 */
function normalizeCmsData(
    raw: Record<string, unknown>,
    fieldsMetaData?: FieldsMetaData,
    getAsset?: GetAsset,
): Partial<IdeaPostTemplateProps> {
    const v = raw as Partial<IdeaPostTemplateProps>;

    // program: single select string → array
    const program = v.program;
    const normalizedProgram = program
        ? Array.isArray(program)
            ? program
            : [String(program)]
        : undefined;

    // authors: relation gives ["name1", "name2"]; resolve each to its
    // { name, contactId } node via metadata (falls back to the bare name).
    const authors = resolveRelationList(v.authors, (name) =>
        resolveAllenite(fieldsMetaData, "authors", name),
    );

    // primaryContact: single relation → a name string; resolve the same way.
    const rawPrimaryContact = v.primaryContact;
    const primaryContact =
        typeof rawPrimaryContact === "string"
            ? resolveAllenite(
                  fieldsMetaData,
                  "primaryContact",
                  rawPrimaryContact,
              )
            : rawPrimaryContact;

    // resources: relation gives slugs; resolve each to its flattened ResourceNode
    // so MaterialsAndMethodsComponent can render (unhydrated entries dropped).
    const resources = resolveRelationList(v.resources, (slug) =>
        resolveResource(fieldsMetaData, slug),
    );

    // related_ideas: relation gives slugs; resolve each to { title, slug }.
    const relatedIdeas = resolveRelationList(raw.related_ideas, (slug) =>
        resolveRelatedIdea(fieldsMetaData, slug),
    );

    // preliminaryFindings.figures: uploaded images arrive as raw paths (no
    // childImageSharp yet); resolve them to URLs so FigureGallery can render.
    const rawFindings = raw.preliminaryFindings as
        | Record<string, unknown>
        | undefined;
    const preliminaryFindings = rawFindings
        ? ({
              ...rawFindings,
              figures: resolveFigures(rawFindings.figures, getAsset),
          } as unknown as PreliminaryFindings)
        : (rawFindings as PreliminaryFindings | undefined);

    // date: datetime widget returns a Date/object, template expects a string
    const rawDate = raw.date;
    const date = rawDate
        ? typeof rawDate === "string"
            ? rawDate
            : new Date(rawDate as string | number).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  timeZone: "UTC",
              })
        : undefined;

    return {
        ...v,
        authors,
        date,
        isPreview: true,
        preliminaryFindings,
        primaryContact,
        program: normalizedProgram,
        relatedIdeas,
        resources,
    };
}

const IdeaPostPreview: React.FC<PreviewProps> = ({
    entry,
    fieldsMetaData,
    getAsset,
    value,
}) => {
    const raw = value ?? (entry?.get("data") as ImmutableLike | undefined);
    const v = fromImmutable<Record<string, unknown>>(raw) ?? {};
    return (
        <>
            <div
                style={{
                    background: "#fffbe6",
                    border: "1px solid #ffe58f",
                    borderRadius: 4,
                    color: "#874d00",
                    fontSize: 12,
                    margin: 8,
                    padding: "6px 12px",
                }}
            >
                Previews are approximate/under development — content and styling
                may differ from production, and not all functionality will be
                available.
            </div>
            <IdeaPostTemplate
                {...(normalizeCmsData(
                    v,
                    fieldsMetaData,
                    getAsset,
                ) as IdeaPostTemplateProps)}
            />
        </>
    );
};

export default IdeaPostPreview;
