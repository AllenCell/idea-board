import React from "react";

import CMS from "decap-cms-app";
import type { CmsWidgetControlProps } from "decap-cms-core";

import { FieldConfig, TypeConfig } from "./types";

interface VariableTypeWidgetControlProps extends CmsWidgetControlProps {
    types: TypeConfig[];
    defaultType?: string;
    baseFields?: FieldConfig[];
}

// Decap uses Immutable.js internally - this interface helps us
// convert their Map objects to plain JS when needed
interface ImmutableLike {
    toJS: () => Record<string, unknown>;
}

const DEFAULT_BASE_FIELDS: FieldConfig[] = [
    { label: "Name", name: "name", type: "input" },
    { label: "Description", name: "description", type: "textarea", rows: 4 },
    {
        label: "Link",
        name: "link",
        type: "input",
        hint: "https://...  ",
    },
];

/**
 * It's easier to apply styles directly here in the component, than to import a stylesheet,
 * and make sure ensure those styles are correctly injected in the Decap build.
 *
 * To inject styles refer to globalStyles documentation on registerWidget params.
 *
 */
const styles = {
    container: {
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 4,
        backgroundColor: "#fafafa",
    } as React.CSSProperties,
    fieldGroup: {
        marginBottom: 16,
    } as React.CSSProperties,
    typeSelector: {
        marginBottom: 20,
    } as React.CSSProperties,
    label: {
        display: "block",
        fontWeight: 600,
        marginBottom: 4,
    } as React.CSSProperties,
    input: {
        width: "100%",
        padding: 8,
        border: "1px solid #ddd",
        borderRadius: 4,
        boxSizing: "border-box",
    } as React.CSSProperties,
    hint: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    } as React.CSSProperties,
    error: {
        fontSize: 12,
        color: "#b00",
    } as React.CSSProperties,
};

/**
 * Union object control for resources:
 * - value.type determines which fields render
 * - fields are config-driven via the `types` prop
 */
const VariableTypeWidgetControl = (props: VariableTypeWidgetControlProps) => {
    const {
        baseFields = DEFAULT_BASE_FIELDS,
        defaultType,
        onChange,
        types,
        value,
    } = props;

    /**
     * Decap's onChange always expects the entire object for this control
     * when values change.
     *
     * We use getDefaultType as a fallback to ensure there's always a valid "type" field,
     * and on intial render to determine which fields to show.
     *
     * We call normalizeValue in handleChange to ensure we're working with a plain JS object,
     * and have the current value available when any field changes.
     *
     * Then handle change retrieves and passes in the new value.
     */

    const getDefaultType = (): string => {
        return defaultType || (types[0] ? types[0].value : "");
    };

    const normalizeValue = (): Record<string, unknown> => {
        if (!value || typeof value === "string") {
            return { type: getDefaultType() };
        }

        const obj =
            typeof (value as ImmutableLike).toJS === "function"
                ? (value as ImmutableLike).toJS()
                : (value as Record<string, unknown>);

        return { ...obj, type: obj.type || getDefaultType() };
    };

    const handleChange = (field: string, newValue: unknown) => {
        const current = normalizeValue();
        onChange({ ...current, [field]: newValue });
    };

    const handleTypeChange = (newType: string) => {
        onChange({ type: newType });
    };

    const renderInput = (
        cfg: FieldConfig,
        valueObj: Record<string, unknown>,
    ) => {
        const { hint = "", label, name, placeholder = "" } = cfg;
        return (
            <div key={name} style={styles.fieldGroup}>
                <label style={styles.label}>{label}</label>
                <input
                    type="text"
                    style={styles.input}
                    value={(valueObj[name] as string) || ""}
                    onChange={(e) => handleChange(name, e.target.value)}
                    placeholder={placeholder}
                />
                {hint && <div style={styles.hint}>{hint}</div>}
            </div>
        );
    };

    const renderTextarea = (
        cfg: FieldConfig,
        valueObj: Record<string, unknown>,
    ) => {
        const { hint = "", label, name, placeholder = "", rows = 4 } = cfg;
        return (
            <div key={name} style={styles.fieldGroup}>
                <label style={styles.label}>{label}</label>
                <textarea
                    style={styles.input}
                    value={(valueObj[name] as string) || ""}
                    onChange={(e) => handleChange(name, e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                />
                {hint && <div style={styles.hint}>{hint}</div>}
            </div>
        );
    };

    const renderSelect = (
        cfg: FieldConfig,
        valueObj: Record<string, unknown>,
    ) => {
        const { hint = "", label, name, options = [] } = cfg;
        return (
            <div key={name} style={styles.fieldGroup}>
                <label style={styles.label}>{label}</label>
                <select
                    style={styles.input}
                    value={(valueObj[name] as string) || ""}
                    onChange={(e) => handleChange(name, e.target.value)}
                >
                    <option value="">-- Select --</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                {hint && <div style={styles.hint}>{hint}</div>}
            </div>
        );
    };

    const renderFileControl = (
        cfg: FieldConfig,
        valueObj: Record<string, unknown>,
    ) => {
        const { hint = "", label, name } = cfg;

        /**
         * Here we retrieve the default file widget registered in Decap to
         * handle file inputs. It's not typed very explicity in their system,
         * so we have to use <any> a bit. We also check if it exists
         * and render an error if not.
         */
        const widget = CMS.getWidget("file");

        const FileControl = widget?.control as  // eslint-disable-next-line @typescript-eslint/no-explicit-any
            | React.ComponentType<any>
            | undefined;

        if (!FileControl) {
            return (
                <div key={name} style={styles.fieldGroup}>
                    <label style={styles.label}>{label}</label>
                    <div style={styles.error}>File widget not available</div>
                </div>
            );
        }

        return (
            <div key={name} style={styles.fieldGroup}>
                <label style={styles.label}>{label}</label>
                <FileControl
                    {...props}
                    value={valueObj[name] || ""}
                    onChange={(newVal: unknown) => handleChange(name, newVal)}
                />
                {hint && <div style={styles.hint}>{hint}</div>}
            </div>
        );
    };

    const renderField = (
        cfg: FieldConfig,
        valueObj: Record<string, unknown>,
    ) => {
        switch (cfg.type) {
            case "input":
                return renderInput(cfg, valueObj);
            case "textarea":
                return renderTextarea(cfg, valueObj);
            case "select":
                return renderSelect(cfg, valueObj);
            case "file":
                return renderFileControl(cfg, valueObj);
            default:
                return null;
        }
    };

    const valueObj = normalizeValue();
    const selectedType = (valueObj["type"] as string) || getDefaultType();
    const typeConfig = types.find((t) => t.value === selectedType) || types[0];
    const baseForThisType = typeConfig?.baseFields ?? baseFields;
    const fields = [...(baseForThisType || []), ...(typeConfig?.fields || [])];

    return (
        <div style={styles.container}>
            <div style={styles.typeSelector}>
                <label style={styles.label}>Resource Type</label>
                <select
                    style={styles.input}
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                >
                    {types.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </div>
            {fields.map((f) => renderField(f, valueObj))}
        </div>
    );
};

export default VariableTypeWidgetControl;
