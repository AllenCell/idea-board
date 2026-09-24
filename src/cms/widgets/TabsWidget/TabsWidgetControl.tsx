import React from "react";

import type { CmsWidgetControlProps } from "decap-cms-core";
import type { List as ImmutableList, Map as ImmutableMap } from "immutable";

/**
 * Groups a field's sub-fields into tabs.
 *
 * Decap has no native tabs, and no way to group fields without nesting the
 * stored value, so the nesting is flattened again in gatsby-node's
 * onCreateNode and in IdeaPostPreview.
 *
 * A class, not a function component: Decap reads `shouldComponentUpdate`,
 * `validate` and `focus` off the control instance, and validates nested
 * fields through refs the way its own object widget does. It cannot extend
 * that widget directly because the admin bundle compiles this file to ES5,
 * which cannot subclass a native class.
 *
 * Config shape (plus the usual object-widget `fields` list):
 *   tabs:
 *     - { label: "Basics", hint: "Who and what.", fields: ["title", "date"] }
 *     - { label: "Detail", fields: ["summary"] }
 */

type Field = ImmutableMap<string, unknown>;

interface FieldError {
    parentIds?: string[];
}

/** A child field's Decap Widget wrapper, as handed to `controlRef`. */
interface ChildWidget {
    props: { field: Field; uniqueFieldId: string };
    innerWrappedControl?: { validate?: () => void };
    validate?: () => void;
    focus?: (path: string) => void;
}

interface TabsWidgetControlProps extends CmsWidgetControlProps {
    editorControl: React.ComponentType<Record<string, unknown>>;
    onChangeObject: (...args: unknown[]) => void;
    onValidateObject?: (...args: unknown[]) => void;
    clearFieldErrors: (...args: unknown[]) => void;
    metadata?: unknown;
    fieldsErrors?: ImmutableMap<string, FieldError[]>;
    parentIds?: string[];
    isFieldDuplicate?: (field: Field) => boolean;
    isFieldHidden?: (field: Field) => boolean;
    locale?: string;
}

interface TabsState {
    activeTab: number;
}

interface TabConfig {
    label: string;
    hint: string;
    fields: string[];
}

const styles = {
    container: {
        border: "1px solid #dfdfe3",
        borderRadius: 4,
        background: "#fff",
    } as React.CSSProperties,
    tabBar: {
        display: "flex",
        gap: 2,
        borderBottom: "1px solid #dfdfe3",
        padding: "0 4px",
        background: "#f7f7f9",
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    } as React.CSSProperties,
    tab: (active: boolean, hasError: boolean) =>
        ({
            appearance: "none",
            border: "none",
            borderBottom: active
                ? "2px solid #3a69c7"
                : "2px solid transparent",
            background: "transparent",
            padding: "10px 14px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: active ? 700 : 500,
            color: hasError ? "#ff003b" : active ? "#3a69c7" : "#5d5d67",
        }) as React.CSSProperties,
    errorDot: {
        marginLeft: 6,
        fontSize: 16,
        lineHeight: 1,
        verticalAlign: "middle",
    } as React.CSSProperties,
    panel: { padding: "10px 14px 14px" } as React.CSSProperties,
    tabHint: {
        fontStyle: "italic",
        fontSize: 13,
        lineHeight: 1.5,
        color: "#5d5d67",
        margin: "2px 0 14px",
        maxWidth: "70ch",
    } as React.CSSProperties,
    /* Inactive tabs stay mounted: Decap validates children through refs, so
       unmounting a tab would silently skip validating its fields. */
    hidden: { display: "none" } as React.CSSProperties,
};

const nameOf = (f: Field) => String(f.get("name") ?? "");

const isMap = (v: unknown): v is Field =>
    typeof (v as Field | undefined)?.get === "function";

/** Tabs from config, or one tab holding everything when none are configured. */
function readTabs(field: Field, fields: Field[]): TabConfig[] {
    const tabs =
        (field.get("tabs") as ImmutableList<Field> | undefined)?.toArray() ??
        [];
    if (tabs.length === 0) {
        return [
            {
                label: String(field.get("label") ?? field.get("name")),
                hint: "",
                fields: fields.map(nameOf),
            },
        ];
    }
    return tabs.map((tab) => ({
        label: String(tab.get("label") ?? ""),
        hint: String(tab.get("hint") ?? ""),
        fields:
            (
                tab.get("fields") as ImmutableList<string> | undefined
            )?.toArray() ?? [],
    }));
}

/**
 * One field group per tab, in tab order. Fields the tab config doesn't name go
 * in the last tab, so a field can never become unreachable.
 */
function groupFields(fields: Field[], tabs: TabConfig[]): Field[][] {
    const byName = new Map(fields.map((f): [string, Field] => [nameOf(f), f]));
    const named = new Set(tabs.flatMap((t) => t.fields));
    const groups = tabs.map((t) =>
        t.fields.flatMap((n) => byName.get(n) ?? []),
    );
    groups[groups.length - 1].push(
        ...fields.filter((f) => !named.has(nameOf(f))),
    );
    return groups;
}

class TabsWidgetControl extends React.Component<
    TabsWidgetControlProps,
    TabsState
> {
    state: TabsState = { activeTab: 0 };

    /** Child Widget instances keyed by field name. */
    private childRefs: Record<string, ChildWidget | undefined> = {};

    private processControlRef = (ref: ChildWidget | null) => {
        if (ref) this.childRefs[nameOf(ref.props.field)] = ref;
    };

    /** Decap's wrapper only re-renders on value changes; nested widgets need more. */
    shouldComponentUpdate() {
        return true;
    }

    /** Called by Decap on publish; mirrors its object widget. */
    validate = () => {
        for (const field of this.fields()) {
            if (field.get("widget") === "hidden") continue;
            const control = this.childRefs[nameOf(field)];
            if (control?.innerWrappedControl?.validate) {
                control.innerWrappedControl.validate();
            } else {
                control?.validate?.();
            }
        }
    };

    /** Reveal the tab holding the field, then let the child scroll to it. */
    focus(path?: string) {
        if (!path) return;
        const [name, ...rest] = path.split(".");
        const focusChild = () => this.childRefs[name]?.focus?.(rest.join("."));
        const tab = this.layout().groups.findIndex((group) =>
            group.some((f) => nameOf(f) === name),
        );
        if (tab === -1 || tab === this.state.activeTab) {
            focusChild();
        } else {
            this.setState({ activeTab: tab }, focusChild);
        }
    }

    private fields(): Field[] {
        const list = this.props.field.get("fields") as
            | ImmutableList<Field>
            | undefined;
        return list?.toArray() ?? [];
    }

    private layout() {
        const fields = this.fields();
        const tabs = readTabs(this.props.field, fields);
        return { tabs, groups: groupFields(fields, tabs) };
    }

    /**
     * Errors are keyed by Decap's per-instance field id, which the child ref
     * knows; errors in deeper fields list their ancestors in `parentIds`.
     */
    private fieldHasError(name: string): boolean {
        const { fieldsErrors } = this.props;
        const id = this.childRefs[name]?.props.uniqueFieldId;
        if (!fieldsErrors || !id) return false;
        return fieldsErrors.some((errors = [], key) =>
            key === id
                ? errors.length > 0
                : errors.some((e) => e.parentIds?.includes(id) ?? false),
        );
    }

    /** Mirrors Decap's object widget so nested fields behave as usual. */
    private controlFor(field: Field) {
        const {
            clearFieldErrors,
            editorControl: EditorControl,
            fieldsErrors,
            forID,
            isFieldDuplicate,
            isFieldHidden,
            locale,
            metadata,
            onChangeObject,
            onValidateObject,
            parentIds = [],
            value,
        } = this.props;
        if (field.get("widget") === "hidden") return null;
        const name = nameOf(field);
        return (
            <EditorControl
                key={name}
                field={field}
                value={isMap(value) ? value.get(name) : value}
                onChange={onChangeObject}
                clearFieldErrors={clearFieldErrors}
                fieldsMetaData={metadata}
                fieldsErrors={fieldsErrors}
                onValidate={onValidateObject}
                controlRef={this.processControlRef}
                parentIds={[...parentIds, forID]}
                isDisabled={isFieldDuplicate?.(field)}
                isHidden={isFieldHidden?.(field)}
                isFieldDuplicate={isFieldDuplicate}
                isFieldHidden={isFieldHidden}
                locale={locale}
            />
        );
    }

    render() {
        const { forID } = this.props;
        const { activeTab } = this.state;
        const { groups, tabs } = this.layout();
        return (
            <div id={forID} style={styles.container}>
                <div role="tablist" style={styles.tabBar}>
                    {tabs.map((tab, i) => {
                        const active = i === activeTab;
                        const hasError = groups[i].some((f) =>
                            this.fieldHasError(nameOf(f)),
                        );
                        return (
                            <button
                                key={tab.label}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => this.setState({ activeTab: i })}
                                style={styles.tab(active, hasError)}
                            >
                                {tab.label}
                                {hasError && (
                                    <span style={styles.errorDot}>•</span>
                                )}
                            </button>
                        );
                    })}
                </div>
                {groups.map((group, i) => (
                    <div
                        key={tabs[i].label}
                        role="tabpanel"
                        style={i === activeTab ? styles.panel : styles.hidden}
                    >
                        {tabs[i].hint && (
                            <p style={styles.tabHint}>{tabs[i].hint}</p>
                        )}
                        {group.map((f) => this.controlFor(f))}
                    </div>
                ))}
            </div>
        );
    }
}

export default TabsWidgetControl;
