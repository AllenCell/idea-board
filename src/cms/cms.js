import CMS from "decap-cms-app";

import AboutPagePreview from "./preview-templates/AboutPagePreview";
import IdeaPostPreview from "./preview-templates/IdeaPostPreview";
import IndexPagePreview from "./preview-templates/IndexPagePreview";
import { UrlImageControl, UrlImagePreview } from "./widgets/UrlImageWidget";

CMS.registerWidget("url-image", UrlImageControl, UrlImagePreview);

CMS.registerPreviewTemplate("index", IndexPagePreview);
CMS.registerPreviewTemplate("about", AboutPagePreview);
CMS.registerPreviewTemplate("idea", IdeaPostPreview);
