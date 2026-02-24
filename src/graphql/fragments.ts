import { graphql } from "gatsby";

export const ResourceDetailsFieldsBase = graphql`
      fragment ResourceDetailsFields on ResourceDetails {
          type
          name
          description
          link
          readmeLink
          status
          date
      }
  `;