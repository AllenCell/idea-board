import React, { useState } from "react";

import { HOW_TO_START_TITLE } from "../../constants/sectionQuestions";
import {
    IdeaHowToStartTemplate,
    IdeaHowToStartTemplateProps,
} from "../../templates/idea-how-to-start";
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
    resolveResourceImage,
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
    // Uploaded images need the same getAsset treatment figures get.
    const resources = resolveRelationList(v.resources, (slug) => {
        const node = resolveResource(fieldsMetaData, slug, "resources");
        return node && resolveResourceImage(node, getAsset);
    });

    // Separate relation field, so Decap keys its metadata separately.
    const flagshipResources = resolveRelationList(
        v.flagshipResources,
        (slug) => {
            const node = resolveResource(
                fieldsMetaData,
                slug,
                "flagshipResources",
            );
            return node && resolveResourceImage(node, getAsset);
        },
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
        flagshipResources,
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
    // One preview per collection, so switch between the idea's two pages.
    const [page, setPage] = useState<"overview" | "howToStart">("overview");
    const normalized = normalizeCmsData(v, fieldsMetaData, getAsset);
    return (
        <>
            <div
                style={{
                    display: "flex",
                    gap: 8,
                    margin: 8,
                    fontSize: 12,
                }}
            >
                {(
                    [
                        ["overview", "Overview"],
                        ["howToStart", HOW_TO_START_TITLE],
                    ] as const
                ).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setPage(key)}
                        style={{
                            padding: "4px 10px",
                            borderRadius: 4,
                            cursor: "pointer",
                            border: "1px solid",
                            borderColor: page === key ? "#6464ff" : "#ddd",
                            background: page === key ? "#6464ff" : "#fff",
                            color: page === key ? "#fff" : "#333",
                            fontWeight: 600,
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>
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
            {page === "overview" ? (
                <IdeaPostTemplate {...(normalized as IdeaPostTemplateProps)} />
            ) : (
                <IdeaHowToStartTemplate
                    {...(normalized as unknown as IdeaHowToStartTemplateProps)}
                    isPreview
                />
            )}
        </>
    );
};

export default IdeaPostPreview;
