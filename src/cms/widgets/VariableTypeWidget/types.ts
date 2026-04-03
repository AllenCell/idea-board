export interface FieldConfig {
    name: string;
    label: string;
    type: "input" | "textarea" | "select" | "file" | "markdown" | "links";
    options?: string[];
    placeholder?: string;
    hint?: string;
    rows?: number;
}

export interface TypeConfig {
    value: string;
    label: string;
    fields: FieldConfig[];
    baseFields?: FieldConfig[];
}
