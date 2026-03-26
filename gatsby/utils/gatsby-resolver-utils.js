const {
    RESOURCES_TEMPLATE_KEY,
    TEMPLATE_KEY_TO_TYPE,
    ALLENITE_TEMPLATE_KEY,
} = require("../constants");
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
        "",
    ); // Slugify and remove leading/trailing slashes
    return `/${directory}/${slugPart}/`;
};

/**
 * Builds a nodeModel query for a single node by display name and template key.
 * Uses slugs in place of names to prevent namespace collisions when querying
 * via Gatsby's nodeModel. Returns null if the name can't be slugified (falsy input).
 * @param {string|null|undefined} name - The node's display name (e.g., "Software Y", "Jane Smith")
 * @param {string} templateKey - The template key used for slug resolution and type lookup (e.g., RESOURCES_TEMPLATE_KEY)
 * @returns {{ query: object, type: string } | null} A nodeModel-compatible query/type pair, or null
 */
const buildNodeQuery = (name, templateKey) => {
    const slug = resolveSlug(name, templateKey);
    if (!slug) return null;
    return {
        query: { filter: { slug: { eq: slug } } },
        type: TEMPLATE_KEY_TO_TYPE[templateKey],
    };
};

const resourceQuery = (name) => buildNodeQuery(name, RESOURCES_TEMPLATE_KEY);
const alleniteQuery = (name) => buildNodeQuery(name, ALLENITE_TEMPLATE_KEY);

module.exports = {
    stringWithDefault,
    resolveToArray,
    resolveSlug,
    resourceQuery,
    alleniteQuery,
    buildNodeQuery,
};
