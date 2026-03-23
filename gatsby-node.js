const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const { createIdeaPostResolver } = require("./gatsby/resolvers/resolvers");
const {
    stringWithDefault,
    resolveToArray,
    resourceQuery,
} = require("./gatsby/utils/gatsby-resolver-utils");
const {
    RESOURCES_GATSBY_NODE_KEY,
    MARKDOWN_REMARK_GATSBY_NODE_KEY,
    TEMPLATE_KEY_TO_TYPE,
    ALLENITE_TEMPLATE_KEY,
    PROGRAM_TEMPLATE_KEY,
} = require("./gatsby/constants");

const read = (p) => fs.readFileSync(path.join(__dirname, p), "utf8");

/**
 * Markdown in /src/pages/ with these templateKeys are data-only
 * and do not get their own pages.
 * They serve as single source of truth, can be added/edited via CMS,
 * and are referenced by other markdown files.
 */

const DATA_ONLY_PAGES = [ALLENITE_TEMPLATE_KEY, PROGRAM_TEMPLATE_KEY];

const templateKeysWithNodes = Object.keys(TEMPLATE_KEY_TO_TYPE);

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions;
    createTypes(read("gatsby/schema/base.gql"));
};

/**
 * Resolvers ensure data shape/presence after queries, or provide
 * custom resolution logic. Takes the place of downstream data unpacking
 * functions where possible
 */
exports.createResolvers = ({ reporter, createResolvers }) => {
    createResolvers({
        MarkdownRemark: {
            fields: {
                resolve: (source) => ({
                    slug: source.fields?.slug || "/",
                }),
            },
        },
        IdeaPost: createIdeaPostResolver(reporter),
    });
};

/**
 * Create pages for markdown files based on their templateKey frontmatter.
 * Also create tag pages for all unique tags found in markdown files.
 * Skips creating pages for data-only pages.
 */
exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions;

    // Create pages for any markdown files that are configured to have their
    // own node type (e.g. Resource) based on their templateKey.
    const typedNodePages = templateKeysWithNodes.map((templateKey) => {
        const nodeKey = TEMPLATE_KEY_TO_TYPE[templateKey];
        const allKeyString = `all${nodeKey}`;
        return graphql(`
        {
            ${allKeyString} {
                nodes {
                    id
                    slug
                }
            }
        }
    `).then((result) => {
            if (result.errors) {
                result.errors.forEach((e) => console.error(e.toString()));
                return Promise.reject(result.errors);
            }

            result.data[allKeyString].nodes.forEach((node) => {
                createPage({
                    path: node.slug,
                    component: path.resolve(`src/templates/${templateKey}.tsx`),
                    context: { id: node.id },
                });
            });
        });
    });

    /**
     * We make pages from all markdown files that are consumed by gatsby-transformer-remark,
     * unless they are specified in DATA_ONLY_PAGES, or TEMPLATE_KEY_TO_TYPE.
     * In practice this block makes pages for idea posts and tags.
     */
    const markdownPages = graphql(`
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
            if (
                DATA_ONLY_PAGES.includes(templateKey) ||
                templateKeysWithNodes.includes(templateKey)
            ) {
                return;
            }

            // Skip creating pages for drafts
            // Toggle boolean flag on dev-example pages during development
            if (edge.node.frontmatter.draft === true) {
                return;
            }

            createPage({
                path: edge.node.fields.slug,
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

    return Promise.all([...typedNodePages, markdownPages]);
};

exports.onCreateNode = ({
    node,
    actions,
    getNode,
    createNodeId,
    createContentDigest,
}) => {
    const { createNodeField, createNode } = actions;

    // By default all markdown files are transformed into MarkdownRemark nodes by gatsby-transformer-remark.
    // We add a slug field to these nodes.
    if (node.internal.type === MARKDOWN_REMARK_GATSBY_NODE_KEY) {
        const slug = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value: slug,
        });

        // Here me make nodes for any types defined in TEMPLATE_KEY_TO_TYPE
        // Once these nodes are in the data layer, we can query them directly by their type (e.g. allResource)
        // This type of query is used when mapping over the same TEMPLATE_KEY_TO_TYPE object
        // in the createPages.
        if (
            node.frontmatter?.templateKey &&
            templateKeysWithNodes.includes(node.frontmatter?.templateKey)
        ) {
            const nodeType = TEMPLATE_KEY_TO_TYPE[node.frontmatter.templateKey];

            let fields = { ...node.frontmatter };

            // The structure of our variable type widget leads to a nested field
            // that we can flatten out here.
            if (nodeType === RESOURCES_GATSBY_NODE_KEY) {
                fields = {
                    ...node.frontmatter,
                    ...node.frontmatter.resourceDetails,
                };
                delete fields.resourceDetails; // avoid duplication in GraphQL node
            }
            createNode({
                ...fields,
                id: createNodeId(`${node.id}-${nodeType}`),
                parent: node.id,
                children: [],
                slug,
                internal: {
                    type: nodeType,
                    contentDigest: createContentDigest(node.frontmatter || {}),
                },
            });
        }
    }
};
