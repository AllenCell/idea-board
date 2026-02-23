import { TypeConfig } from "../VariableTypeWidget/types";

const SOFTWARE_STATUS_OPTIONS = [
    "Public",
    "In development",
    "Internal use only",
];

const DATASET_STATUS_OPTIONS = [
    "Public",
    "Not QCed",
    "Preliminary",
    "Need to request data directly",
];

// Optional: override baseFields per type,
// defaults to name, description, link.
export const VARIABLE_TYPE_RESOURCE_CONFIG: TypeConfig[] = [
    {
        value: "softwareTool",
        label: "Software Tool",
        fields: [
            {
                label: "README/Quickstart Link",
                name: "readmeLink",
                type: "input",
            },
            {
                label: "Status",
                name: "status",
                type: "select",
                options: SOFTWARE_STATUS_OPTIONS,
            },
        ],
    },
    {
        value: "dataset",
        label: "Dataset",
        fields: [
            {
                label: "Status",
                name: "status",
                type: "select",
                options: DATASET_STATUS_OPTIONS,
            },
        ],
    },
    {
        value: "protocolLink",
        label: "Protocol (Link)",
        fields: [],
    },
    {
        value: "protocolFile",
        label: "Protocol (File)",
        fields: [
            {
                label: "File Path",
                name: "file",
                type: "file",
                hint: "Use Media Library to upload, then paste path here",
            },
        ],
    },
    {
        value: "cellLine",
        label: "Cell Line",
        fields: [],
    },
];
