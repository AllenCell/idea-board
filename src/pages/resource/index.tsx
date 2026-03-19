import * as React from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

const ResourcesPage: React.FC<PageProps<Queries.ResourcesIndexQueryQuery>> = ({
    data,
}) => {
    const { allResource, site } = data;

    if (!allResource || !site) {
        return <p>Data not found.</p>;
    }

    const { nodes } = allResource;
    const title = site.siteMetadata?.title || "Title";
    return (
        <section>
            <Helmet title={`Resources | ${title}`} />
            <div>
                <h1>Resources</h1>
                <ul>
                    {nodes.map((node) => (
                        <li key={node.slug}>
                            <Link to={node.slug}>{node.name}</Link>
                            {node.description && <p>{node.description}</p>}
                            {node.type && <p>{node.type}</p>}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default ResourcesPage;

export const resourcePageQuery = graphql`
    query ResourcesIndexQuery {
        site {
            siteMetadata {
                title
            }
        }
        allResource {
            nodes {
                slug
                ...ResourceFields
            }
        }
    }
`;
