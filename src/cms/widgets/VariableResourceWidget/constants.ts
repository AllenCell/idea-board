import { TypeConfig } from "../VariableTypeWidget/types";
import { RESOURCE_TYPES } from "../../../constants/resourceTypes";

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
        value: RESOURCE_TYPES.SOFTWARE_TOOL,
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
        value: RESOURCE_TYPES.DATASET,
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
        value: RESOURCE_TYPES.PROTOCOL_LINK,
        label: "Protocol (Link)",
        fields: [],
    },
    {
        value: RESOURCE_TYPES.PROTOCOL_FILE,
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
        value: RESOURCE_TYPES.CELL_LINE,
        label: "Cell Line",
        fields: [],
    },
];
