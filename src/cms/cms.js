import CMS from "decap-cms-app";

import AboutPagePreview from "./preview-templates/AboutPagePreview";
import IdeaPostPreview from "./preview-templates/IdeaPostPreview";
import IndexPagePreview from "./preview-templates/IndexPagePreview";
import ResourcePreview from "./preview-templates/ResourcePreview";
import ResourceSubsetControl from "./widgets/ResourceSubsetWidget/ResourceSubsetControl";
import TabsWidgetControl from "./widgets/TabsWidget/TabsWidgetControl";
import { UrlImageControl, UrlImagePreview } from "./widgets/UrlImageWidget";
import VariableResourceUnionControl from "./widgets/VariableResourceWidget/VariableResourceUnionControl";
import copyResourceNameHandler from "./widgets/VariableResourceWidget/copyResourceNameHandler";

// Register custom widgets, with optional preview components
// and global styles.
CMS.registerWidget({
    name: "resource_union",
    controlComponent: VariableResourceUnionControl,
    previewComponent: ResourcePreview,
});

CMS.registerWidget("url-image", UrlImageControl, UrlImagePreview);

// Groups a field's sub-fields into tabs; the nesting it creates is flattened
// again in gatsby-node and IdeaPostPreview.
CMS.registerWidget({
    name: "tabs",
    controlComponent: TabsWidgetControl,
});

// Picks from values already chosen in another field of the same entry (its
// `source`). Decap's relation widget can only filter on fixed values, so this
// reads the sibling field off the entry draft instead.
CMS.registerWidget({
    name: "resource_subset",
    controlComponent: ResourceSubsetControl,
});

CMS.registerPreviewTemplate("index", IndexPagePreview);
CMS.registerPreviewTemplate("about", AboutPagePreview);
CMS.registerPreviewTemplate("ideas", IdeaPostPreview);

// Decap exposes a number of lifecycle stages we can hook into and register.
CMS.registerEventListener({
    name: "preSave",
    handler: copyResourceNameHandler,
});
