import { graphql } from "gatsby";

export const ResourceFieldsBase = graphql`
    fragment ResourceFields on Resource {
        type
        name
        description
        link
        readmeLink
        status
        date
    }
`;
