import CMS from "decap-cms-app";

import colorsCSS from "!!raw-loader!../style/colors.css";
import indexCSS from "!!raw-loader!../style/index.css";
import resourceCSS from "!!raw-loader!../style/resource.css";

import AboutPagePreview from "./preview-templates/AboutPagePreview";
import IdeaPostPreview from "./preview-templates/IdeaPostPreview";
import IndexPagePreview from "./preview-templates/IndexPagePreview";
import ResourcePreview from "./preview-templates/ResourcePreview";
import { UrlImageControl, UrlImagePreview } from "./widgets/UrlImageWidget";
import VariableResourceUnionControl from "./widgets/VariableResourceWidget/VariableResourceUnionControl";
import copyResourceNameHandler from "./widgets/VariableResourceWidget/copyResourceNameHandler";

CMS.registerPreviewStyle(colorsCSS, { raw: true });
CMS.registerPreviewStyle(indexCSS, { raw: true });
CMS.registerPreviewStyle(resourceCSS, { raw: true });

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
