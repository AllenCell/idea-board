const DATASET_PATH = `dataset`;
const SOFTWARE_PATH = `software`;

const RESOURCES_TEMPLATE_KEY = `resource`;

const RESOURCES_GATSBY_NODE_KEY = `Resource`;
const MARKDOWN_REMARK_GATSBY_NODE_KEY = `MarkdownRemark`;

/**
 * Maps frontmatter templateKey → a distinct GraphQL node type.
 * gatsby-transformer-remark collapses every .md file into one flat MarkdownRemark
 * type regardless of which collection it lives in. Adding entries here causes
 * onCreateNode to emit a second, collection-specific node so you can query
 * allAllenite, allIdeaPost, etc. with their own inferred schemas.
 */
const TEMPLATE_KEY_TO_TYPE = {
    [RESOURCES_TEMPLATE_KEY]: RESOURCES_GATSBY_NODE_KEY,
};
module.exports = {
    DATASET_PATH,
    SOFTWARE_PATH,
    RESOURCES_TEMPLATE_KEY,
    MARKDOWN_REMARK_GATSBY_NODE_KEY,
    TEMPLATE_KEY_TO_TYPE,
    RESOURCES_GATSBY_NODE_KEY,
};
