import CMS from "decap-cms-core";

// For some reason I could not import CmsEventListener as a type
// because it was resolving to the global CMS object, so this is the workaround.
type CmsEventListenerHandler = Parameters<
    typeof CMS.registerEventListener
>[0]["handler"];
type CmsEventListenerHandlerArg = Parameters<CmsEventListenerHandler>[0];

/**
 Certain fields are required to be top-level by the CMS, which clutters the UI
 when we have a redundant field in widget. This preSave hook copies the resource.name
 field to the top-level from the nested widget.
 */
export const copyResourceNameHandler = ({
    entry,
}: CmsEventListenerHandlerArg) => {
    const collection = entry.get("collection");

    // Only apply to resources collection
    if (collection !== "resources") {
        return entry.get("data");
    }

    const data = entry.get("data");
    const resource = data.get("resourceDetails");

    if (resource) {
        // Copy resource.name to top-level name
        const resourceName = resource.get
            ? resource.get("name")
            : resource.name;
        if (resourceName) {
            return data.set("name", resourceName);
        }
    }

    return data;
};

export default copyResourceNameHandler;
