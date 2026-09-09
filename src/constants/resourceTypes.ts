export const RESOURCE_TYPES = {
    SOFTWARE_TOOL: "softwareTool",
    DATASET: "dataset",
    PROTOCOL_LINK: "protocolLink",
    PROTOCOL_FILE: "protocolFile",
    CELL_LINE: "cellLine",
    IMAGE: "image",
} as const;

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];

/** Human-readable labels, for naming a resource's type outside its grouped section. */
export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
    [RESOURCE_TYPES.SOFTWARE_TOOL]: "Software Tool",
    [RESOURCE_TYPES.DATASET]: "Dataset",
    [RESOURCE_TYPES.PROTOCOL_LINK]: "Protocol",
    [RESOURCE_TYPES.PROTOCOL_FILE]: "Protocol",
    [RESOURCE_TYPES.CELL_LINE]: "Cell Line",
    [RESOURCE_TYPES.IMAGE]: "Image",
};

export function getResourceTypeLabel(type?: string | null): string | null {
    if (!type) return null;
    return RESOURCE_TYPE_LABELS[type as ResourceType] ?? null;
}
