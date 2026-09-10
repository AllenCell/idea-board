import { describe, expect, it, vi } from "vitest";

import { createIdeaPostResolver } from "../resolvers";

const mockReporter = { error: () => {}, warn: () => {} };

describe("createIdeaPostResolver - maturity", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the maturity value when present", () => {
        expect(resolver.maturity.resolve({ maturity: "speculative" })).toBe(
            "speculative",
        );
        expect(resolver.maturity.resolve({ maturity: "exploratory" })).toBe(
            "exploratory",
        );
        expect(resolver.maturity.resolve({ maturity: "supported" })).toBe(
            "supported",
        );
        expect(resolver.maturity.resolve({ maturity: "validated" })).toBe(
            "validated",
        );
    });

    it("returns 'speculative' when maturity is absent", () => {
        expect(resolver.maturity.resolve({})).toBe("speculative");
        expect(resolver.maturity.resolve({ maturity: null })).toBe(
            "speculative",
        );
        expect(resolver.maturity.resolve({ maturity: undefined })).toBe(
            "speculative",
        );
    });
});

describe("createIdeaPostResolver - accelerator", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the accelerator list when present", () => {
        expect(
            resolver.accelerator.resolve({ accelerator: ["Cell Science"] }),
        ).toEqual(["Cell Science"]);
    });

    it("returns an empty array when accelerator is absent", () => {
        expect(resolver.accelerator.resolve({})).toEqual([]);
        expect(resolver.accelerator.resolve({ accelerator: null })).toEqual([]);
    });

    it("returns an empty array for a non-array value", () => {
        expect(
            resolver.accelerator.resolve({ accelerator: "Cell Science" }),
        ).toEqual([]);
    });
});

describe("createIdeaPostResolver - scope", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the scope value when present", () => {
        expect(resolver.scope.resolve({ scope: "Summer project" })).toBe(
            "Summer project",
        );
    });

    it("returns null when scope is absent", () => {
        expect(resolver.scope.resolve({})).toBeNull();
        expect(resolver.scope.resolve({ scope: null })).toBeNull();
        expect(resolver.scope.resolve({ scope: undefined })).toBeNull();
    });
});

describe("createIdeaPostResolver - researcherLevel", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the levels when present", () => {
        expect(
            resolver.researcherLevel.resolve({
                researcherLevel: ["Graduate student", "Postdoc"],
            }),
        ).toEqual(["Graduate student", "Postdoc"]);
    });

    it("returns an empty array when absent", () => {
        expect(resolver.researcherLevel.resolve({})).toEqual([]);
        expect(
            resolver.researcherLevel.resolve({ researcherLevel: null }),
        ).toEqual([]);
    });

    it("returns an empty array for a non-array value", () => {
        expect(
            resolver.researcherLevel.resolve({ researcherLevel: "Postdoc" }),
        ).toEqual([]);
    });
});

/** nodeModel stub resolving only the slugs it is told about. */
const makeContext = (known) => ({
    nodeModel: {
        findOne: vi.fn(async ({ query }) =>
            known.includes(query.filter.slug.eq)
                ? { slug: query.filter.slug.eq }
                : null,
        ),
    },
});

const EMT = "/resource/released-emt-dataset/";
const TFE = "/resource/timelapse-feature-explorer/";

describe("createIdeaPostResolver - flagshipResources", () => {
    it("resolves flagship names into resource nodes", async () => {
        const resolver = createIdeaPostResolver(mockReporter);
        const result = await resolver.flagshipResources.resolve(
            {
                title: "Test idea",
                flagshipResources: [
                    "released-emt-dataset",
                    "timelapse-feature-explorer",
                ],
            },
            {},
            makeContext([EMT, TFE]),
        );
        expect(result).toEqual([{ slug: EMT }, { slug: TFE }]);
    });

    it("returns an empty array when the field is absent", async () => {
        const resolver = createIdeaPostResolver(mockReporter);
        const context = makeContext([]);
        expect(
            await resolver.flagshipResources.resolve({}, {}, context),
        ).toEqual([]);
        expect(context.nodeModel.findOne).not.toHaveBeenCalled();
    });

    it("drops unresolvable names and reports them", async () => {
        const reporter = { error: vi.fn() };
        const resolver = createIdeaPostResolver(reporter);
        const result = await resolver.flagshipResources.resolve(
            {
                title: "Test idea",
                flagshipResources: ["released-emt-dataset", "does-not-exist"],
            },
            {},
            makeContext([EMT]),
        );
        expect(result).toEqual([{ slug: EMT }]);
        expect(reporter.error).toHaveBeenCalledTimes(1);
        expect(reporter.error.mock.calls[0][0]).toContain("does-not-exist");
    });

    it("reports a blank entry instead of querying for it", async () => {
        const reporter = { error: vi.fn() };
        const resolver = createIdeaPostResolver(reporter);
        const context = makeContext([EMT]);
        const result = await resolver.flagshipResources.resolve(
            {
                title: "Test idea",
                flagshipResources: ["", "released-emt-dataset"],
            },
            {},
            context,
        );
        expect(result).toEqual([{ slug: EMT }]);
        expect(context.nodeModel.findOne).toHaveBeenCalledTimes(1);
        expect(reporter.error).toHaveBeenCalledTimes(1);
    });
});

describe("createIdeaPostResolver - resources (unchanged by the shared helper)", () => {
    it("still resolves `resources` independently of flagshipResources", async () => {
        const resolver = createIdeaPostResolver(mockReporter);
        const result = await resolver.resources.resolve(
            {
                title: "Test idea",
                resources: ["timelapse-feature-explorer"],
                flagshipResources: ["released-emt-dataset"],
            },
            {},
            makeContext([TFE]),
        );
        expect(result).toEqual([{ slug: TFE }]);
    });
});

describe("createIdeaPostResolver - resourceNotes", () => {
    const RELEASED = "/resource/released-emt-dataset/";
    const context = (known) => ({
        nodeModel: {
            findOne: vi.fn(async ({ query }) =>
                known.includes(query.filter.slug.eq)
                    ? { slug: query.filter.slug.eq }
                    : null,
            ),
        },
    });

    it("resolves a note's resource and keeps its relevance text", async () => {
        const resolver = createIdeaPostResolver(mockReporter);
        const result = await resolver.resourceNotes.resolve(
            {
                title: "Test idea",
                resources: ["released-emt-dataset"],
                resourceNotes: [
                    {
                        resource: "released-emt-dataset",
                        relevance: "Start here.",
                    },
                ],
            },
            {},
            context([RELEASED]),
        );
        expect(result).toEqual([
            { relevance: "Start here.", resource: { slug: RELEASED } },
        ]);
    });

    it("returns an empty array when there are no notes", async () => {
        const resolver = createIdeaPostResolver(mockReporter);
        expect(
            await resolver.resourceNotes.resolve({}, {}, context([])),
        ).toEqual([]);
    });

    it("reports a note whose resource does not exist", async () => {
        const reporter = { error: vi.fn(), warn: vi.fn() };
        const resolver = createIdeaPostResolver(reporter);
        await resolver.resourceNotes.resolve(
            {
                title: "Test idea",
                resources: ["nope"],
                resourceNotes: [{ resource: "nope", relevance: "x" }],
            },
            {},
            context([]),
        );
        expect(reporter.error).toHaveBeenCalledTimes(1);
    });

    it("warns when a note refers to a resource the idea no longer selects", async () => {
        const reporter = { error: vi.fn(), warn: vi.fn() };
        const resolver = createIdeaPostResolver(reporter);
        await resolver.resourceNotes.resolve(
            {
                title: "Test idea",
                resources: [],
                resourceNotes: [
                    { resource: "released-emt-dataset", relevance: "x" },
                ],
            },
            {},
            context([RELEASED]),
        );
        expect(reporter.error).not.toHaveBeenCalled();
        expect(reporter.warn).toHaveBeenCalledTimes(1);
        expect(reporter.warn.mock.calls[0][0]).toContain(
            "released-emt-dataset",
        );
    });
});
