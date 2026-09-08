const {
    stringWithDefault,
    resolveToArray,
    ideaPostQuery,
    resourceQuery,
    alleniteQuery,
} = require("../utils/gatsby-resolver-utils");

/**
 * Resolves a frontmatter list of resource names into Resource nodes.
 * Names that don't match an existing resource file are reported and dropped.
 * @param {object} reporter - Gatsby reporter
 * @param {string} frontmatterKey - the idea frontmatter field holding the names
 */
const createResourceListResolver = (reporter, frontmatterKey) => ({
    resolve: async (source, _args, context) => {
        const names = resolveToArray(source[frontmatterKey]);
        const results = await Promise.all(
            names.map((name) => {
                // A blank entry can't be slugified into a query; treat as not found
                const query = resourceQuery(name);
                return query ? context.nodeModel.findOne(query) : null;
            }),
        );
        results.forEach((result, i) => {
            if (!result) {
                const msg = `Resource "${names[i]}" not found for idea "${source.title}". Check for typos and ensure the resource file exists with the correct templateKey.`;
                reporter.error(msg, new Error(msg));
            }
        });
        return results.filter(Boolean);
    },
});

const createIdeaPostResolver = (reporter) => ({
    title: {
        resolve: (source) =>
            stringWithDefault(source.title, "No title provided."),
    },
    description: {
        resolve: (source) =>
            stringWithDefault(source.description, "No description provided."),
    },
    nextSteps: {
        resolve: (source) => source.nextSteps ?? null,
    },
    resourcesIntro: {
        resolve: (source) => source.resourcesIntro ?? null,
    },
    relatedIdeas: {
        resolve: async (source, _args, context) => {
            const names = resolveToArray(source.related_ideas);
            const results = await Promise.all(
                names.map((name) =>
                    context.nodeModel.findOne(ideaPostQuery(name)),
                ),
            );
            results.forEach((result, i) => {
                if (!result) {
                    const msg = `Idea post "${names[i]}" not found for idea "${source.title}". Check for typos and ensure the idea post file exists with the correct templateKey.`;
                    reporter.error(msg, new Error(msg));
                }
            });
            return results.filter(Boolean);
        },
    },
    authors: {
        resolve: async (source, _args, context) => {
            const names = resolveToArray(source.authors);
            const results = await Promise.all(
                names
                    .filter(Boolean)
                    .map((name) =>
                        context.nodeModel.findOne(alleniteQuery(name)),
                    ),
            );
            return results.filter(Boolean);
        },
    },
    primaryContact: {
        resolve: async (source, _args, context) => {
            const query = alleniteQuery(source.primaryContact);
            if (!query) return null;
            return context.nodeModel.findOne(query);
        },
    },
    tags: {
        resolve: (source) => resolveToArray(source.tags),
    },
    program: {
        resolve: (source) => resolveToArray(source.program),
    },
    accelerator: {
        resolve: (source) => resolveToArray(source.accelerator),
    },
    scope: {
        resolve: (source) => source.scope ?? null,
    },
    researcherLevel: {
        resolve: (source) => resolveToArray(source.researcherLevel),
    },
    resources: createResourceListResolver(reporter, "resources"),
    flagshipResources: createResourceListResolver(
        reporter,
        "flagshipResources",
    ),
    preliminaryFindings: {
        resolve: (source) => {
            const raw = source.preliminaryFindings;
            if (!raw || typeof raw !== "object") {
                return { summary: "", figures: [] };
            }
            return {
                summary: stringWithDefault(raw.summary, ""),
                figures: resolveToArray(raw.figures),
            };
        },
    },
    maturity: {
        resolve: (source) => source.maturity ?? "speculative",
    },
});

module.exports = { createIdeaPostResolver };
