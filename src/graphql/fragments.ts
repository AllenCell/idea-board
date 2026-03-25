import { graphql } from "gatsby";

export const SoftwareToolResourceFields = graphql`
    fragment SoftwareToolResourceFields on Resource {
        slug
        type
        name
        description
        link
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
        link
        status
        date
    }
`;

export const CellLineResourceFields = graphql`
    fragment CellLineResourceFields on Resource {
        slug
        type
        name
        link
    }
`;

export const ProtocolLinkResourceFields = graphql`
    fragment ProtocolLinkResourceFields on Resource {
        slug
        type
        name
        description
        link
    }
`;

export const ProtocolFileResourceFields = graphql`
    fragment ProtocolFileResourceFields on Resource {
        slug
        type
        name
        description
        link
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