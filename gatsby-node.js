const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const {
    stringWithDefault,
    resolveToArray,
    resolveSlug,
    resolveSoftwareTools,
    alleniteQuery,
} = require("./gatsby/utils/gatsby-resolver-utils");
const {
    DATASET_TEMPLATE_KEY,
    TEMPLATE_KEY_TO_TYPE,
    ALLENITE_TEMPLATE_KEY,
    SOFTWARE_TEMPLATE_KEY,
    PROGRAM_TEMPLATE_KEY,
    MARKDOWN_REMARK_GATSBY_NODE_KEY,
} = require("./gatsby/constants");

const read = (p) => fs.readFileSync(path.join(__dirname, p), "utf8");

/**
 * Markdown in /src/pages/ with these templateKeys are data-only
 * and do not get their own pages.
 * They serve as single source of truth, can be added/edited via CMS,
 * and are referenced by other markdown files.
 */
const DATA_ONLY_PAGES = [
    SOFTWARE_TEMPLATE_KEY,
    DATASET_TEMPLATE_KEY,
    ALLENITE_TEMPLATE_KEY,
    PROGRAM_TEMPLATE_KEY,
];

exports.createSchemaCustomization = ({ actions }) => {
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
exports.createResolvers = ({ createResolvers }) => {
    createResolvers({
        MarkdownRemark: {
            fields: {
                resolve: (source) => ({
                    slug: source.fields?.slug || "/",
                }),
            },
        },
        Frontmatter: {
            description: {
                resolve: (source) =>
                    stringWithDefault(
                        source.description,
                        "No description provided.",
                    ),
            },
            title: {
                resolve: (source) =>
                    stringWithDefault(source.title, "No title provided."),
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
            materialsAndMethods: {
                resolve: (source) => {
                    const raw = source.materialsAndMethods;
                    const current = {
                        dataset: null,
                        cellLines: [],
                        protocols: [],
                        software: [],
                    };

                    if (!raw || typeof raw !== "object") {
                        return current;
                    }

                    const resolvedDatasetSlug = resolveSlug(
                        raw.dataset,
                        DATASET_TEMPLATE_KEY,
                    );
                    current.dataset = resolvedDatasetSlug;
                    current.cellLines = resolveToArray(raw.cellLines);
                    current.protocols = resolveToArray(raw.protocols);
                    current.software = resolveSoftwareTools(raw.software);

                    return current;
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
exports.createPages = ({ actions, graphql }) => {
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
            result.errors.forEach((e) => console.error(e.toString()));
            return Promise.reject(result.errors);
        }

        const posts = result.data.allMarkdownRemark.edges;

        posts.forEach((edge) => {
            const id = edge.node.id;
            const templateKey = edge.node.frontmatter.templateKey;

            // Skip creating pages for data-only pages (software, dataset, etc.)
            if (DATA_ONLY_PAGES.includes(templateKey)) {
                return;
            }

            // Skip creating pages for drafts
            // Toggle boolean flag on dev-example pages during development
            if (edge.node.frontmatter.draft === true) {
                return;
            }

            createPage({
                path: edge.node.fields.slug,
                tags: edge.node.frontmatter.tags,
                component: path.resolve(
                    `src/templates/${String(templateKey)}.tsx`,
                ),
                // additional data can be passed via context
                context: {
                    id,
                },
            });
        });

        // Tag pages:
        let tags = [];
        // Iterate through each post, putting all found tags into `tags`
        posts.forEach((edge) => {
            if (_.get(edge, `node.frontmatter.tags`)) {
                tags = tags.concat(edge.node.frontmatter.tags);
            }
        });
        // Eliminate duplicate tags
        tags = _.uniq(tags);

        // Make tag pages
        tags.forEach((tag) => {
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

// gatsby-transformer-remark fires BEFORE this hook for every .md file it processes.
// By the time onCreateNode is called with a MarkdownRemark node, the plugin has already:
//   1. Detected a File node whose mediaType is `text/markdown` or `text/x-markdown`
//   2. Parsed frontmatter with gray-matter (available as node.frontmatter)
//   3. Parsed the markdown body into a remark AST (used to produce node.html, node.excerpt, etc.)
//   4. Called Gatsby's internal createNode({ internal: { type: "MarkdownRemark" }, ... })
// This hook is our first opportunity to react to that node.
exports.onCreateNode = ({
    node,
    actions,
    getNode,
    createNodeId,
    createContentDigest,
}) => {
    const { createNodeField, createNode } = actions;

    if (node.internal.type === MARKDOWN_REMARK_GATSBY_NODE_KEY) {
        // createFilePath walks up to the parent File node (created by gatsby-source-filesystem
        // before gatsby-transformer-remark ran) and builds a slug from the file path.
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value,
        });

        // Create a typed derived node for each collection so queries like
        // allAllenite are available in addition to allMarkdownRemark.
        // The typed node holds the raw frontmatter fields plus a reference back to
        // the MarkdownRemark node so HTML / excerpt remain reachable.
        const templateKey = node.frontmatter?.templateKey;
        const nodeType = TEMPLATE_KEY_TO_TYPE[templateKey];

        if (nodeType) {
            createNode({
                // Spread frontmatter so all CMS fields are top-level on the typed node.
                ...node.frontmatter,
                slug: value,
                // Link back to the MarkdownRemark node for HTML / excerpt access.
                markdownRemarkId: node.id,
                id: createNodeId(`${nodeType}-${node.id}`),
                parent: node.id,
                children: [],
                internal: {
                    type: nodeType,
                    contentDigest: createContentDigest(node.frontmatter ?? {}),
                },
            });
        }
    }
};
