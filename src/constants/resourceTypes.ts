export const RESOURCE_TYPES = {
    SOFTWARE_TOOL: "softwareTool",
    DATASET: "dataset",
    PROTOCOL_LINK: "protocolLink",
    PROTOCOL_FILE: "protocolFile",
    CELL_LINE: "cellLine",
} as const;

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];
