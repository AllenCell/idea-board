import * as React from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import Layout from "../../components/Layout";

const ResourcesPage: React.FC<PageProps<Queries.ResourcesIndexQueryQuery>> = ({
    data,
}) => {
    const { allResource, site } = data;
    if (!allResource || !site) {
        return (
            <Layout>
                <p>Data not found.</p>
            </Layout>
        );
    }

    const { nodes } = allResource;
    const title = site.siteMetadata?.title || "Title";
    return (
        <Layout>
            <section>
                <Helmet title={`Resources | ${title}`} />
                <div>
                    <h1>Resources</h1>
                    <ul>
                        {nodes.map((node) => (
                            <li key={node.slug}>
                                <Link to={node.slug}>
                                    {node.resourceDetails!.name}
                                </Link>
                                {node.resourceDetails!.description && (
                                    <p>{node.resourceDetails!.description}</p>
                                )}
                                {node.resourceDetails!.type && (
                                    <p>{node.resourceDetails!.type}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </Layout>
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
                resourceDetails {
                    ...ResourceDetailsFields
                }
            }
        }
    }
`;
