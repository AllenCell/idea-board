import CMS from "decap-cms-app";


import AboutPagePreview from "./preview-templates/AboutPagePreview";
import IdeaPostPreview from "./preview-templates/IdeaPostPreview";
import IndexPagePreview from "./preview-templates/IndexPagePreview";
import ResourcePreview from "./preview-templates/ResourcePreview";
import { UrlImageControl, UrlImagePreview } from "./widgets/UrlImageWidget";
import VariableResourceUnionControl from "./widgets/VariableResourceWidget/VariableResourceUnionControl";
import copyResourceNameHandler from "./widgets/VariableResourceWidget/copyResourceNameHandler";


CMS.registerWidget({
    name: "resource_union",
    controlComponent: VariableResourceUnionControl,
    previewComponent: ResourcePreview,
});

CMS.registerWidget("url-image", UrlImageControl, UrlImagePreview);

CMS.registerPreviewTemplate("index", IndexPagePreview);
CMS.registerPreviewTemplate("about", AboutPagePreview);
CMS.registerPreviewTemplate("idea", IdeaPostPreview);

// Decap exposes a number of lifecycle stages we can hook into and register.
CMS.registerEventListener({
    name: "preSave",
    handler: copyResourceNameHandler,
});
