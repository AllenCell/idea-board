import React from "react";

import type { CmsWidgetControlProps } from "decap-cms-core";

import VariableTypeWidgetControl from "../VariableTypeWidget/VariableTypeWidgetControl";
import { VARIABLE_TYPE_RESOURCE_CONFIG } from "./constants";

/**
 * Implementation of VariableTypeWidgetControl for a union of different
 * resource types (software tools, datasets, etc.).
 * Config defined in VARIABLE_TYPE_RESOURCE_CONFIG.
 */
const ResourceUnionControl = (props: CmsWidgetControlProps) => {
    return (
        <VariableTypeWidgetControl
            {...props}
            types={VARIABLE_TYPE_RESOURCE_CONFIG}
            defaultType="softwareTool"
        />
    );
};

export default ResourceUnionControl;
