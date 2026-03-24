const {
    stringWithDefault,
    resolveToArray,
    ideaPostQuery,
    resourceQuery,
} = require("../utils/gatsby-resolver-utils");

const createIdeaPostResolver = (reporter) => ({
    title: {
        resolve: (source) =>
            stringWithDefault(source.title, "No title provided."),
    },
    description: {
        resolve: (source) =>
            stringWithDefault(
                source.description,
                "No description provided.",
            ),
    },
    nextSteps: {
        resolve: (source) => source.nextSteps ?? null,
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
        resolve: (source) => resolveToArray(source.authors),
    },
    tags: {
        resolve: (source) => resolveToArray(source.tags),
    },
    program: {
        resolve: (source) => resolveToArray(source.program),
    },
    resources: {
        resolve: async (source, _args, context) => {
            const names = resolveToArray(source.resources);
            const results = await Promise.all(
                names.map((name) =>
                    context.nodeModel.findOne(resourceQuery(name)),
                ),
            );
            results.forEach((result, i) => {
                if (!result) {
                    const msg = `Resource "${names[i]}" not found for idea "${source.title}". Check for typos and ensure the resource file exists with the correct templateKey.`;
                    reporter.error(msg, new Error(msg));
                }
            });
            return results.filter(Boolean);
        },
    },
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
});

module.exports = { createIdeaPostResolver };
