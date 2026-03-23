import * as React from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";


type ResourceNode = { slug: string; name: string | null; description?: string | null };

function renderResourceList(nodes: ResourceNode[]) {
    if (!nodes.length) return null;
    return (
        <ul>
            {nodes.map((node) => (
                <li key={node.slug}>
                    <Link to={node.slug}>{node.name}</Link>
                    {node.description && <p>{node.description}</p>}
                </li>
            ))}
        </ul>
    );
}

const resourceSections: {
    title: string;
    keys: (keyof Omit<Queries.ResourcesIndexQuery, "site">)[];
}[] = [
    { title: "Software", keys: ["softwareResources"] },
    { title: "Datasets", keys: ["datasetResources"] },
    { title: "Cell Lines", keys: ["cellLineResources"] },
    {
        title: "Protocols",
        keys: ["protocolLinkResources", "protocolFileResources"],
    },
];

const ResourcesPage: React.FC<PageProps<Queries.ResourcesIndexQuery>> = ({
    data,
}) => {
    if (!data.site) {
        return <p>Data not found.</p>;
    }

    const title = data.site.siteMetadata?.title || "Title";
    return (
        <section>
            <Helmet title={`Resources | ${title}`} />
            <div>
                <h1>Resources</h1>
                {resourceSections.map(({ keys, title: sectionTitle }) => {
                    const nodes = keys.flatMap(
                        (key) => data[key]?.nodes ?? []
                    );
                    if (!nodes.length) return null;
                    return (
                        <React.Fragment key={sectionTitle}>
                            <h2>{sectionTitle}</h2>
                            {renderResourceList(nodes)}
                        </React.Fragment>
                    );
                })}
            </div>
        </section>
    );
};

export default ResourcesPage;

export const resourcePageQuery = graphql`
    query ResourcesIndex {
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
