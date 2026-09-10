import { RESOURCE_TYPES } from "../../../constants/resourceTypes";
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
    {
        value: RESOURCE_TYPES.IMAGE,
        label: "Image",
        fields: [
            {
                label: "Viewer URL",
                name: "viewerUrl",
                type: "input",
                hint: "If the image lives in an interactive viewer (Neuroglancer, etc.), link to that view here.",
            },
            {
                label: "Image or Screenshot",
                name: "imageFile",
                type: "file",
                hint: "The image itself, or a screenshot of the view above so something shows on the idea page. Most viewers have a screenshot option.",
            },
            {
                label: "Image URL",
                name: "imageUrl",
                type: "input",
                hint: "Only if the image is hosted elsewhere. Ignored when a file is set.",
            },
            {
                label: "Alt Text",
                name: "altText",
                type: "input",
                hint: "Describes the image for screen readers.",
            },
        ],
    },
];
