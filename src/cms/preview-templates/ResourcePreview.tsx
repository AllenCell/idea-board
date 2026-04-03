import React from "react";

import {
    ResourceDisplayProps,
    ResourceTemplate,
} from "../../templates/resource";
import { ImmutableLike, fromImmutable } from "../utils/immutable";

interface PreviewProps {
    entry?: ImmutableLike;
    value?: unknown;
}

const ResourcePreview: React.FC<PreviewProps> = ({ entry, value }) => {
    // `value` is only populated after the user edits a field — it is undefined
    // on initial load. Fall back to reading resourceDetails directly from the
    // entry, mirroring the path used in copyResourceNameHandler.
    const raw =
        value ??
        (entry?.get("data") as ImmutableLike | undefined)?.get(
            "resourceDetails",
        );
    const v = fromImmutable<ResourceDisplayProps>(raw) ?? {};
    return (
        <ResourceTemplate
            type={v.type}
            name={v.name}
            description={v.description}
            links={v.links}
            status={v.status}
        />
    );
};

export default ResourcePreview;
