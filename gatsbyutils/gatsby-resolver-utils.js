const { SOFTWARE_PATH } = require("../gatsbyutils/constants");
const slugify = require("slugify");

function stringWithDefault(rawValue, fallback) {
    if (typeof rawValue !== "string") return fallback;
    if (rawValue.trim() === "") return fallback;
    return rawValue;
}

function resolveToArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [];
}

const resolveSoftwareTools = (rawSoftware) => {
    if (!Array.isArray(rawSoftware)) {
        return [];
    }
    return rawSoftware
        .map((item) => {
            if (
                item &&
                typeof item === "object" &&
                item.softwareTool
            ) {
                return {
                    softwareTool: resolveSlug(
                        item.softwareTool,
                        SOFTWARE_PATH
                    ),
                    customDescription: stringWithDefault(
                        item.customDescription,
                        null
                    ),
                };
            }
            return null;
        })
        .filter((item) => item !== null);
}

/**
 * Builds slugs from directory paths and ids/names.
 * Usings slugs in place of names helps prevent namespace
 * colliions when using @link directive in Gatsby schema.
 */
const resolveSlug = (id, directory) => {
    if (!id) return null;
    const slugPart = slugify(id, { lower: true, strict: true }).replace(
        /^\/+|\/+$/g,
        ""
    ); // Slugify and remove leading/trailing slashes
    return `/${directory}/${slugPart}/`;
}



module.exports = {
    stringWithDefault,
    resolveToArray,
    resolveSlug,
    resolveSoftwareTools,
};
