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

module.exports = {
    stringWithDefault,
    resolveToArray,
};
