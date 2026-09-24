import React from "react";

import type { CmsWidgetControlProps } from "decap-cms-core";
import type { Map as ImmutableMap } from "immutable";

import { fromImmutable } from "../../utils/immutable";

/**
 * Picks from values already chosen in another field of the same entry — for
 * ideas, the resources selected under Resources & related work.
 *
 * Decap's `relation` widget can only filter on fixed values (`filters` takes a
 * field name and a static list), so it cannot narrow itself to a sibling
 * field's current value. Every widget control is handed the whole `entry`,
 * though, so this reads the sibling off the draft directly.
 *
 * Config:
 *   source: "ideaDetails.resources"  # dotted path into the entry's data
 *   multiple: true                   # checkbox list; otherwise a single select
 *   empty_hint: "..."                # shown while the source field is empty
 */

interface ResourceSubsetControlProps extends CmsWidgetControlProps<unknown> {
    entry?: ImmutableMap<string, unknown>;
}

const styles = {
    empty: {
        fontSize: 13,
        fontStyle: "italic",
        color: "#7a7a85",
        margin: "4px 0",
    } as React.CSSProperties,
    list: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
        margin: "4px 0",
    } as React.CSSProperties,
    row: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
        cursor: "pointer",
    } as React.CSSProperties,
    select: {
        width: "100%",
        padding: 8,
        border: "1px solid #ddd",
        borderRadius: 4,
        fontSize: 14,
    } as React.CSSProperties,
};

/** `/resource/junction-tracking-workspace/` → `Junction Tracking Workspace` */
function labelFor(slug: string): string {
    const part =
        slug
            .replace(/^\/+|\/+$/g, "")
            .split("/")
            .pop() ?? slug;
    return part
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

/** Immutable List, plain array, or a single string → string[] */
function toStringArray(value: unknown): string[] {
    const plain = fromImmutable<unknown[]>(value) ?? value;
    if (Array.isArray(plain)) {
        return plain.filter((v): v is string => typeof v === "string");
    }
    return typeof plain === "string" ? [plain] : [];
}

/** The raw value at the field's `source` path, read off the entry draft. */
function sourceValue({ entry, field }: ResourceSubsetControlProps): unknown {
    const path = String(field.get("source") ?? "")
        .split(".")
        .filter(Boolean);
    return path.length > 0 ? entry?.getIn(["data", ...path]) : undefined;
}

const ResourceSubsetField: React.FC<ResourceSubsetControlProps> = (props) => {
    const { classNameWrapper, field, forID, onChange, value } = props;
    const options = toStringArray(sourceValue(props));
    const selected = toStringArray(value);

    if (options.length === 0) {
        return (
            <div className={classNameWrapper}>
                <p style={styles.empty}>
                    {String(
                        field.get("empty_hint") ??
                            "Nothing to choose from yet.",
                    )}
                </p>
            </div>
        );
    }

    if (field.get("multiple") !== true) {
        return (
            <div className={classNameWrapper}>
                <select
                    id={forID}
                    style={styles.select}
                    value={selected[0] ?? ""}
                    onChange={(e) => onChange(e.target.value || null)}
                >
                    <option value="">— none —</option>
                    {options.map((slug) => (
                        <option key={slug} value={slug}>
                            {labelFor(slug)}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    const toggle = (slug: string) =>
        onChange(
            selected.includes(slug)
                ? selected.filter((s) => s !== slug)
                : [...selected, slug],
        );

    return (
        <div className={classNameWrapper}>
            <div style={styles.list} id={forID}>
                {options.map((slug) => (
                    <label key={slug} style={styles.row}>
                        <input
                            type="checkbox"
                            checked={selected.includes(slug)}
                            onChange={() => toggle(slug)}
                        />
                        {labelFor(slug)}
                    </label>
                ))}
            </div>
        </div>
    );
};

/**
 * A class only so Decap can read `shouldComponentUpdate` off the instance: its
 * wrapper re-renders a control when `value` changes, never when `entry` does,
 * and our options come from `entry`.
 */
class ResourceSubsetControl extends React.Component<ResourceSubsetControlProps> {
    shouldComponentUpdate(next: ResourceSubsetControlProps) {
        return (
            this.props.value !== next.value ||
            this.props.classNameWrapper !== next.classNameWrapper ||
            sourceValue(this.props) !== sourceValue(next)
        );
    }

    render() {
        return <ResourceSubsetField {...this.props} />;
    }
}

export default ResourceSubsetControl;
