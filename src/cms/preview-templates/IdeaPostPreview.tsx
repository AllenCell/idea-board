import React from "react";

import {
    IdeaPostTemplate,
    IdeaPostTemplateProps,
} from "../../templates/idea-post";
import { ImmutableLike, fromImmutable } from "../utils/immutable";

interface PreviewProps {
    entry?: ImmutableLike;
    value?: unknown;
}

/**
 * Normalize CMS form data into the shape IdeaPostTemplate expects.
 * Decap gives us raw widget values which differ from resolved Gatsby data:
 *   - relation widgets return value_field strings, not resolved objects
 *   - single select widgets return a string, not an array
 */
function normalizeCmsData(
    raw: Record<string, unknown>,
): Partial<IdeaPostTemplateProps> {
    const v = raw as Partial<IdeaPostTemplateProps>;

    // program: single select string → array
    const program = v.program;
    const normalizedProgram = program
        ? Array.isArray(program)
            ? program
            : [String(program)]
        : undefined;

    // authors: relation gives ["name1", "name2"] → [{ name, contactId }]
    const authors = v.authors
        ? (v.authors as unknown as string[]).map((a) =>
              typeof a === "string" ? { name: a, contactId: "" } : a,
          )
        : undefined;

    // date: datetime widget returns a Date/object, template expects a string
    const rawDate = raw.date;
    const date = rawDate
        ? typeof rawDate === "string"
            ? rawDate
            : new Date(rawDate as string | number).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
              })
        : undefined;

    return {
        ...v,
        authors,
        date,
        isPreview: true,
        program: normalizedProgram,
    };
}

const IdeaPostPreview: React.FC<PreviewProps> = ({ entry, value }) => {
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
                {...(normalizeCmsData(v) as IdeaPostTemplateProps)}
            />
        </>
    );
};

export default IdeaPostPreview;
