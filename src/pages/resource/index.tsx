import * as React from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import { CustomReactMarkdown } from "../../components/CustomReactMarkdown";
import Layout from "../../components/Layout";

const ResourcesPage: React.FC<PageProps<Queries.ResourcesIndexQueryQuery>> = ({
    data,
}) => {
    const {
        cellLineResources,
        datasetResources,
        protocolFileResources,
        protocolLinkResources,
        site,
        softwareResources,
    } = data;

    if (!site) {
        return (
            <Layout>
                <p>Data not found.</p>
            </Layout>
        );
    }

    const title = site.siteMetadata?.title || "Title";
    return (
        <Layout>
            <section>
                <Helmet title={`Resources | ${title}`} />
                <div>
                    <h1>Resources</h1>
                    {!!softwareResources?.nodes.length && (
                        <>
                            <h2>Software</h2>
                            <ul>
                                {softwareResources.nodes.map((node) => (
                                    <li key={node.slug}>
                                        <Link to={node.slug}>{node.name}</Link>
                                        {node.description && (
                                            <p>{node.description}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {!!datasetResources?.nodes.length && (
                        <>
                            <h2>Datasets</h2>
                            <ul>
                                {datasetResources.nodes.map((node) => (
                                    <li key={node.slug}>
                                        <Link to={node.slug}>{node.name}</Link>
                                        {node.description && (
                                            <CustomReactMarkdown
                                                content={node.description}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {!!cellLineResources?.nodes.length && (
                        <>
                            <h2>Cell Lines</h2>
                            <ul>
                                {cellLineResources.nodes.map((node) => (
                                    <li key={node.slug}>
                                        <Link to={node.slug}>{node.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {!!(
                        protocolLinkResources?.nodes.length ||
                        protocolFileResources?.nodes.length
                    ) && (
                        <>
                            <h2>Protocols</h2>
                            <ul>
                                {protocolLinkResources?.nodes.map((node) => (
                                    <li key={node.slug}>
                                        <Link to={node.slug}>{node.name}</Link>
                                        {node.description && (
                                            <p>{node.description}</p>
                                        )}
                                    </li>
                                ))}
                                {protocolFileResources?.nodes.map((node) => (
                                    <li key={node.slug}>
                                        <Link to={node.slug}>{node.name}</Link>
                                        {node.description && (
                                            <p>{node.description}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
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
        datasetResources: allResource(filter: { type: { eq: "dataset" } }) {
            nodes {
                ...DatasetResourceFields
            }
        }
        softwareResources: allResource(
            filter: { type: { eq: "softwareTool" } }
        ) {
            nodes {
                ...SoftwareToolResourceFields
            }
        }
        cellLineResources: allResource(filter: { type: { eq: "cellLine" } }) {
            nodes {
                ...CellLineResourceFields
            }
        }
        protocolLinkResources: allResource(
            filter: { type: { eq: "protocolLink" } }
        ) {
            nodes {
                ...ProtocolLinkResourceFields
            }
        }
        protocolFileResources: allResource(
            filter: { type: { eq: "protocolFile" } }
        ) {
            nodes {
                ...ProtocolFileResourceFields
            }
        }
    }
`;
