import React from "react";
import { ResourceDisplayProps, ResourceTemplate } from "../../templates/resource";

interface ImmutableLike {
    get: (key: string) => unknown;
    toJS: () => ResourceDisplayProps;
}

interface PreviewProps {
    entry?: ImmutableLike;
    value?: unknown;
}

/**
 * Decap CMS passes widget values as Immutable.js Maps on initial load
 * (parsed directly from frontmatter) and as plain JS objects after any
 * edit (emitted by the widget's onChange). This function handles both
 * shapes and returns a plain object safe to spread into ResourceTemplate.
 */
function normalize(raw: unknown): ResourceDisplayProps {
    if (!raw || typeof raw !== "object") return {};
    if (typeof (raw as ImmutableLike).toJS === "function") {
        return (raw as ImmutableLike).toJS();
    }
    return raw as ResourceDisplayProps;
}

const ResourcePreview: React.FC<PreviewProps> = ({ entry, value }) => {
    // `value` is only populated after the user edits a field — it is undefined
    // on initial load. Fall back to reading resourceDetails directly from the
    // entry, mirroring the path used in copyResourceNameHandler.
    const raw = value ?? (entry?.get("data") as ImmutableLike | undefined)?.get("resourceDetails");
    const v = normalize(raw);
    return (
        <ResourceTemplate
            type={v.type}
            name={v.name}
            description={v.description}
            link={v.link}
            status={v.status}
        />
    );
};

export default ResourcePreview;
