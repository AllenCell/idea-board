import { describe, expect, it, vi } from "vitest";

import { createIdeaPostResolver } from "../resolvers";

/**
 * Faithful stand-in for Gatsby's nodeModel.findOne. The real implementation
 * (gatsby/dist/schema/node-model.js) begins with `const { query = {} } = args`,
 * so calling it with a null/undefined query object throws a TypeError — exactly
 * what happens when a resolver passes it the null returned by resourceQuery()/
 * ideaPostQuery() for a blank reference name.
 */
const makeContext = (nodesBySlug) => ({
    nodeModel: {
        findOne: vi.fn(async (args) => {
            const { query = {} } = args; // throws if args is null/undefined
            const slug = query?.filter?.slug?.eq;
            return nodesBySlug[slug] ?? null;
        }),
    },
});

const makeReporter = () => ({ error: vi.fn() });

describe("createIdeaPostResolver relational lookups", () => {
    it("resolves resources, skipping blank entries without crashing", async () => {
        const reporter = makeReporter();
        const resolver = createIdeaPostResolver(reporter);
        const context = makeContext({
            "/resource/simularium/": {
                id: "res-1",
                slug: "/resource/simularium/",
            },
        });
        // A blank row (empty string) is easy to produce via the Decap CMS list widget.
        const source = { title: "My Idea", resources: ["Simularium", ""] };

        const result = await resolver.resources.resolve(source, {}, context);

        expect(result).toEqual([
            { id: "res-1", slug: "/resource/simularium/" },
        ]);
    });

    it("resolves related ideas, skipping blank entries without crashing", async () => {
        const reporter = makeReporter();
        const resolver = createIdeaPostResolver(reporter);
        const context = makeContext({
            "/ideas/some-idea/": { id: "idea-1", slug: "/ideas/some-idea/" },
        });
        const source = { title: "My Idea", related_ideas: ["", "Some Idea"] };

        const result = await resolver.relatedIdeas.resolve(source, {}, context);

        expect(result).toEqual([{ id: "idea-1", slug: "/ideas/some-idea/" }]);
    });
});
