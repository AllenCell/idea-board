import type { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";

import fs from "fs";
import _ from "lodash";
import path from "path";

import { DATASET_PATH } from "./gatsby/constants";
import {
    resolveSlug,
    resolveSoftwareTools,
    resolveToArray,
    stringWithDefault,
} from "./gatsby/utils/gatsby-resolver-utils";

const read = (p: string) => fs.readFileSync(path.join(__dirname, p), "utf8");

/**
 * Markdown in /src/pages/ with these templateKeys are data-only
 * and do not get their own pages.
 * They serve as single source of truth, can be added/edited via CMS,
 * and are referenced by other markdown files.
 */
const DATA_ONLY_PAGES = [
    "software",
    "dataset",
    "allenite",
    "program",
    "resource",
];

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
    ({ actions }) => {
        const { createTypes } = actions;
        const typeDefs = [
            `"""
        Nested materials and methods block for idea posts.
        """
        type MaterialsAndMethods {
        dataset: MarkdownRemark @link(by: "fields.slug")
        protocols: [ProtocolItem!]!
        cellLines: [CellLineItem!]!
        software: [SoftwareTool!]!
        }

        type ProtocolItem {
        protocol: String!
        }

        type CellLineItem {
            name: String!
            link: String
        }

        type PreliminaryFindings {
            summary: String!
            figures: [ImgWithCaption!]!
        }

        type ImgWithCaption @dontInfer {
            type: String!
            url: String
            file: File @fileByRelativePath
            caption: String
        }

        """
        Software tool reference with optional custom description.
        """
        type SoftwareTool {
            softwareTool: MarkdownRemark @link(by: "fields.slug")
            customDescription: String
        }`,
        ];
        createTypes(read("gatsby/schema/base.gql"));
        createTypes(typeDefs);
    };

/**
 * Resolvers ensure data shape/presence after queries, or provide
 * custom resolution logic. Takes the place of downstream data unpacking
 * functions where possible
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResolverSource = Record<string, any>;

export const createResolvers: GatsbyNode["createResolvers"] = ({
    createResolvers,
}) => {
    createResolvers({
        MarkdownRemark: {
            fields: {
                resolve: (source: ResolverSource) => ({
                    slug: source.fields?.slug || "/",
                }),
            },
        },
        Frontmatter: {
            description: {
                resolve: (source: ResolverSource) =>
                    stringWithDefault(
                        source.description,
                        "No description provided.",
                    ),
            },
            authors: {
                resolve: (source: ResolverSource) =>
                    resolveToArray(source.authors),
            },
            title: {
                resolve: (source: ResolverSource) =>
                    stringWithDefault(source.title, "No title provided."),
            },
            materialsAndMethods: {
                resolve: (source: ResolverSource) => {
                    const raw = source.materialsAndMethods;
                    const current = {
                        dataset: null as string | null,
                        cellLines: [] as unknown[],
                        protocols: [] as unknown[],
                        software: [] as unknown[],
                    };

                    if (!raw || typeof raw !== "object") {
                        return current;
                    }

                    const resolvedDatasetSlug = resolveSlug(
                        raw.dataset,
                        DATASET_PATH,
                    );
                    current.dataset = resolvedDatasetSlug;
                    current.cellLines = resolveToArray(raw.cellLines);
                    current.protocols = resolveToArray(raw.protocols);
                    current.software = resolveSoftwareTools(raw.software);

                    return current;
                },
            },
            nextSteps: {
                resolve: (source: ResolverSource) => source.nextSteps ?? null,
            },
            program: {
                resolve: (source: ResolverSource) =>
                    resolveToArray(source.program),
            },
            preliminaryFindings: {
                resolve: (source: ResolverSource) => {
                    const raw = source.preliminaryFindings;
                    if (!raw || typeof raw !== "object") {
                        return {
                            summary: "",
                            figures: [],
                        };
                    }
                    return {
                        summary: stringWithDefault(raw.summary, ""),
                        figures: resolveToArray(raw.figures),
                    };
                },
            },
        },
    });
};

/**
 * Create pages for markdown files based on their templateKey frontmatter.
 * Also create tag pages for all unique tags found in markdown files.
 * Skips creating pages for data-only pages.
 */
export const createPages: GatsbyNode["createPages"] = ({
    actions,
    graphql,
}) => {
    const { createPage } = actions;

    return graphql(`
        {
            allMarkdownRemark(limit: 1000) {
                edges {
                    node {
                        id
                        fields {
                            slug
                        }
                        frontmatter {
                            tags
                            templateKey
                            draft
                        }
                    }
                }
            }
        }
    `).then((result) => {
        if (result.errors) {
            result.errors.forEach((e: Error) => console.error(e.toString()));
            return Promise.reject(result.errors);
        }

        const data = result.data as ResolverSource;
        const posts = data.allMarkdownRemark.edges;

        posts.forEach(
            (edge: {
                node: {
                    id: string;
                    fields: { slug: string };
                    frontmatter: {
                        tags: string[];
                        templateKey: string;
                        draft: boolean;
                    };
                };
            }) => {
                const id = edge.node.id;
                const templateKey = edge.node.frontmatter.templateKey;

                if (DATA_ONLY_PAGES.includes(templateKey)) {
                    return;
                }

                if (edge.node.frontmatter.draft === true) {
                    return;
                }

                createPage({
                    path: edge.node.fields.slug,
                    component: path.resolve(
                        `src/templates/${String(templateKey)}.tsx`,
                    ),
                    context: {
                        id,
                    },
                });
            },
        );

        let tags: string[] = [];
        posts.forEach((edge: { node: { frontmatter: { tags: string[] } } }) => {
            if (_.get(edge, `node.frontmatter.tags`)) {
                tags = tags.concat(edge.node.frontmatter.tags);
            }
        });
        tags = _.uniq(tags);

        tags.forEach((tag: string) => {
            const tagPath = `/tags/${_.kebabCase(tag)}/`;

            createPage({
                path: tagPath,
                component: path.resolve(`src/templates/tags.tsx`),
                context: {
                    tag,
                },
            });
        });
    });
};

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
    actions,
    getNode,
    node,
}) => {
    const { createNodeField } = actions;

    if (node.internal.type === `MarkdownRemark`) {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value,
        });
    }
};
