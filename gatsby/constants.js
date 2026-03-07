// templateKey is typically interchangeable with path
// used in templateKey in markdown and to build slugs
const ALLENITE_TEMPLATE_KEY = `allenite`;
const SOFTWARE_TEMPLATE_KEY = `software`;
const DATASET_TEMPLATE_KEY = `dataset`;
const PROGRAM_TEMPLATE_KEY = `program`;

const ALLENITE_GATSBY_NODE_KEY = `Allenite`;
const MARKDOWN_REMARK_GATSBY_NODE_KEY = `MarkdownRemark`;

/**
 * Maps frontmatter templateKey → a distinct GraphQL node type.
 * gatsby-transformer-remark collapses every .md file into one flat MarkdownRemark
 * type regardless of which collection it lives in. Adding entries here causes
 * onCreateNode to emit a second, collection-specific node so you can query
 * allAllenite, allIdeaPost, etc. with their own inferred schemas.
 */
const TEMPLATE_KEY_TO_TYPE = {
    [ALLENITE_TEMPLATE_KEY]: ALLENITE_GATSBY_NODE_KEY,
};

module.exports = {
    DATASET_TEMPLATE_KEY,
    SOFTWARE_TEMPLATE_KEY,
    ALLENITE_TEMPLATE_KEY,
    PROGRAM_TEMPLATE_KEY,
    ALLENITE_GATSBY_NODE_KEY,
    MARKDOWN_REMARK_GATSBY_NODE_KEY,
    TEMPLATE_KEY_TO_TYPE,
};
