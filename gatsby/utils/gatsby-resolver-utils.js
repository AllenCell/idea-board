const { SOFTWARE_PATH } = require("../constants");
const slugify = require("slugify");

/**
 * Returns the raw value if it's a non-empty string, otherwise returns the fallback.
 * @param {unknown} rawValue - The value to check
 * @param {T} fallback - The fallback value to return if rawValue is not a valid string
 * @returns {string|T} The raw string value or the fallback
 * @template T
 */
function stringWithDefault(rawValue, fallback) {
    if (typeof rawValue !== "string") return fallback;
    if (rawValue.trim() === "") return fallback;
    return rawValue;
}

/**
 * Ensures the value is returned as an array.
 * @param {unknown} value - The value to convert to an array
 * @returns {Array} The original array if value is an array, otherwise an empty array
 */
function resolveToArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [];
}

/**
 * Prepares software tool references for Gatsby's @link directive.
 * Transforms tool names into slug paths that @link(by: "fields.slug") uses
 * to resolve the actual MarkdownRemark nodes. Filters out invalid entries
 * and preserves custom descriptions.
 * @param {Array<{softwareTool?: string, customDescription?: string}>|unknown} rawSoftware - Array of software tool objects from frontmatter
 * @returns {Array<{softwareTool: string|null, customDescription: string|null}>} Array with slug keys for @link resolution
 */
const resolveSoftwareTools = (rawSoftware) => {
    if (!Array.isArray(rawSoftware)) {
        return [];
    }
    return rawSoftware
        .map((item) => {
            if (item && typeof item === "object" && item.softwareTool) {
                return {
                    softwareTool: resolveSlug(item.softwareTool, SOFTWARE_PATH),
                    customDescription: stringWithDefault(
                        item.customDescription,
                        null
                    ),
                };
            }
            return null;
        })
        .filter((item) => item !== null);
};

/**
 * Builds slugs from directory paths and ids/names.
 * Uses slugs in place of names to prevent namespace
 * collisions when using @link directive in Gatsby schema.
 * @param {string|null|undefined} id - The identifier to slugify (e.g., "My Dataset")
 * @param {string} directory - The directory prefix (e.g., "dataset", "software")
 * @returns {string|null} The full slug path (e.g., "/dataset/my-dataset/") or null if id is falsy
 */
const resolveSlug = (id, directory) => {
    if (!id) return null;
    const slugPart = slugify(id, { lower: true, strict: true }).replace(
        /^\/+|\/+$/g,
        ""
    ); // Slugify and remove leading/trailing slashes
    return `/${directory}/${slugPart}/`;
};

module.exports = {
    stringWithDefault,
    resolveToArray,
    resolveSlug,
    resolveSoftwareTools,
};