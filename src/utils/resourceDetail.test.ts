import { describe, expect, it } from "vitest";

import {
    ResourceDetailSource,
    buildResourceDetailMarkdown,
    getPrimaryResourceLink,
    getResourceFacts,
    getResourceImageSrc,
    getResourceLinks,
    getSecondaryResourceLinks,
    hasExpandableDetail,
} from "./resourceDetail";

const dataset: ResourceDetailSource = {
    description: "### Overview\n\nSimulated actin filaments.",
    shortDescription: "Simulated actin filaments.",
    host: "Quilt",
    status: "Public",
    links: [
        {
            name: "Browse data",
            url: "https://example.com/data",
            description: "Quilt package",
        },
        { name: "Quilt docs", url: "https://example.com/docs" },
    ],
};

describe("getResourceFacts", () => {
    it("returns populated facts in display order", () => {
        expect(getResourceFacts(dataset)).toEqual([
            { label: "Status", value: "Public" },
            { label: "Host", value: "Quilt" },
        ]);
    });

    it("ignores empty and whitespace-only values", () => {
        expect(getResourceFacts({ status: "", host: "   " })).toEqual([]);
    });
});

describe("getResourceLinks", () => {
    it("puts the viewer first, ahead of authored links", () => {
        expect(
            getResourceLinks({
                viewerUrl: "https://viewer.example/view",
                links: [{ name: "Paper", url: "https://example.com/paper" }],
            }).map((l) => l.name),
        ).toEqual(["Open viewer", "Paper"]);
    });

    it("appends README and file links last", () => {
        expect(
            getResourceLinks({
                links: [{ name: "Repo", url: "https://example.com/repo" }],
                readmeLink: "https://example.com/readme",
                file: "/protocols/method.pdf",
            }).map((l) => l.name),
        ).toEqual(["Repo", "README", "Download"]);
    });

    it("skips links with no url and names unnamed ones", () => {
        expect(
            getResourceLinks({
                links: [
                    { name: "", url: "https://example.com/a" },
                    { name: "Nope", url: "" },
                ],
            }),
        ).toEqual([
            {
                name: "Link 1",
                url: "https://example.com/a",
                description: undefined,
            },
        ]);
    });
});

describe("primary and secondary links", () => {
    it("splits the first link off from the rest", () => {
        expect(getPrimaryResourceLink(dataset)).toBe(
            "https://example.com/data",
        );
        expect(getSecondaryResourceLinks(dataset).map((l) => l.name)).toEqual([
            "Quilt docs",
        ]);
    });

    it("makes the viewer the primary link when present", () => {
        expect(
            getPrimaryResourceLink({
                viewerUrl: "https://viewer.example/view",
                links: [{ name: "Paper", url: "https://example.com/paper" }],
            }),
        ).toBe("https://viewer.example/view");
    });

    it("returns no primary link when there are none", () => {
        expect(getPrimaryResourceLink({})).toBeNull();
    });
});

describe("hasExpandableDetail", () => {
    it("is true when a full description exists", () => {
        expect(hasExpandableDetail({ description: "Long text" })).toBe(true);
    });

    it("is true when a link carries a note not shown alongside it", () => {
        expect(
            hasExpandableDetail({
                links: [
                    {
                        name: "Data",
                        url: "https://example.com",
                        description: "The package",
                    },
                ],
            }),
        ).toBe(true);
    });

    it("is false when everything is already on screen", () => {
        expect(
            hasExpandableDetail({
                shortDescription: "Blurb",
                status: "Public",
                links: [{ name: "Data", url: "https://example.com" }],
            }),
        ).toBe(false);
    });
});

describe("buildResourceDetailMarkdown", () => {
    it("includes every section, not just the description", () => {
        const md = buildResourceDetailMarkdown(dataset);
        expect(md).toContain("### Overview");
        expect(md).toContain("### Details");
        expect(md).toContain("- **Status:** Public");
        expect(md).toContain("- **Host:** Quilt");
        expect(md).toContain("### Links");
        expect(md).toContain(
            "- [Browse data](https://example.com/data) — Quilt package",
        );
    });

    it("orders sections description → details → links", () => {
        const md = buildResourceDetailMarkdown(dataset);
        const order = ["### Overview", "### Details", "### Links"].map((h) =>
            md.indexOf(h),
        );
        expect(order).toEqual([...order].sort((a, b) => a - b));
        expect(order.every((i) => i >= 0)).toBe(true);
    });

    it("falls back to the short description when there is no description", () => {
        expect(
            buildResourceDetailMarkdown({ shortDescription: "Just a blurb." }),
        ).toBe("Just a blurb.");
    });

    it("returns an empty string for an empty resource", () => {
        expect(buildResourceDetailMarkdown({})).toBe("");
    });
});

describe("resource images", () => {
    it("prefers an explicit imageUrl", () => {
        expect(
            getResourceImageSrc({ imageUrl: "https://example.com/a.png" }),
        ).toBe("https://example.com/a.png");
    });

    it("falls back to the processed image's src", () => {
        expect(
            getResourceImageSrc({
                imageFile: {
                    childImageSharp: {
                        gatsbyImageData: {
                            images: { fallback: { src: "/static/a.png" } },
                        },
                    },
                },
            }),
        ).toBe("/static/a.png");
    });

    it("returns null when there is no image", () => {
        expect(getResourceImageSrc({})).toBeNull();
    });

    it("leads the expanded view with the image", () => {
        const md = buildResourceDetailMarkdown({
            altText: "A view",
            imageUrl: "https://example.com/a.png",
            description: "Body text.",
        });
        expect(md.startsWith("![A view](https://example.com/a.png)")).toBe(
            true,
        );
        expect(md).toContain("Body text.");
    });
});
