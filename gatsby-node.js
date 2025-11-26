const _ = require("lodash");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

/**
 * Markdown in /src/pages/ with these templateKeys are data-only
 * and do not get their own pages.
 * They serve as single source of truth, can be added/edited via CMS,
 * and are referenced by other markdown files.
 */
const DATA_ONLY_TEMPLATES = [
    "software",
    "dataset",
    "allenite",
    "program",
];

/**
 * Define custom GraphQL schema for frontmatter fields.
 * This gives all markdown nodes a consistent typed schema,
 * so optional fields resolve to null instead of changing type,
 * and required fields (like `title`) are enforced at build time.
 */
exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions;
    const typeDefs = `
        type MarkdownRemark implements Node {
            frontmatter: Frontmatter
        }

        """
        Shared frontmatter fields for idea posts (and other markdown).
        """
        type Frontmatter {
            date: Date @dateformat
            title: String!
            description: String
            tags: [String!]
            authors: [String!]
            program: String
            type: String
            concerns: String
            introduction: String
            materialsAndMethods: MaterialsAndMethods
            nextSteps: [String!]
        }

        """
        Nested materials and methods block for idea posts.
        """
        type MaterialsAndMethods {
        dataset: MarkdownRemark @link(by: "frontmatter.name")
        protocols: [ProtocolItem!]
        cellLines: [CellLineItem!]
        software: [SoftwareTool!]
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
            softwareTool: MarkdownRemark @link(by: "frontmatter.name")
            customDescription: String
        }
    `;
    createTypes(typeDefs);
};

/**
 * Create pages for markdown files based on their templateKey frontmatter.
 * Also create tag pages for all unique tags found in markdown files.
 * Skips creating pages for data-only templates.
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

            // Skip creating pages for data-only templates (software, dataset, etc.)
            if (DATA_ONLY_TEMPLATES.includes(templateKey)) {
                return;
            }

            createPage({
                path: edge.node.fields.slug,
                tags: edge.node.frontmatter.tags,
                component: path.resolve(
                    `src/templates/${String(templateKey)}.tsx`
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

exports.onCreateNode = ({ node, actions, getNode }) => {
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
