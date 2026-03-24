import { graphql } from "gatsby";

export const SoftwareToolResourceFields = graphql`
    fragment SoftwareToolResourceFields on Resource {
        slug
        type
        name
        description
        links {
            name
            url
            description
        }
        readmeLink
        status
        date
    }
`;

export const DatasetResourceFields = graphql`
    fragment DatasetResourceFields on Resource {
        slug
        type
        name
        description
        links {
            name
            url
            description
        }
        status
        date
    }
`;

export const CellLineResourceFields = graphql`
    fragment CellLineResourceFields on Resource {
        slug
        type
        name
        links {
            name
            url
            description
        }
    }
`;

export const ProtocolLinkResourceFields = graphql`
    fragment ProtocolLinkResourceFields on Resource {
        slug
        type
        name
        description
        links {
            name
            url
            description
        }
    }
`;

export const ProtocolFileResourceFields = graphql`
    fragment ProtocolFileResourceFields on Resource {
        slug
        type
        name
        description
        links {
            name
            url
            description
        }
        file
    }
`;

/**
 * Composite fragment for querying mixed resource lists.
 * Results include all fields across all resource types;
 * use the `type` field to discriminate at runtime.
 */
export const ResourceFields = graphql`
    fragment ResourceFields on Resource {
        ...SoftwareToolResourceFields
        ...DatasetResourceFields
        ...CellLineResourceFields
        ...ProtocolLinkResourceFields
        ...ProtocolFileResourceFields
    }
`;