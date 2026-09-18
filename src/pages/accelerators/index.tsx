import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import { useSetLayoutConfig } from "../../LayoutContext";

const {
    hero,
    heroBreadcrumb,
    heroInner,
    heroSubtitle,
    heroTitle,
    listWrapper,
} = require("../../style/index-page.module.css");

const AcceleratorsPage: React.FC<PageProps<Queries.AcceleratorsIndexQuery>> = ({
    data,
}) => {
    const setLayout = useSetLayoutConfig();

    useEffect(() => {
        setLayout({ fullWidthPage: true });
        return () => setLayout({ fullWidthPage: undefined });
    }, [setLayout]);

    const counts = new Map<string, number>();
    data.allIdeaPost.nodes.forEach((idea) => {
        idea.accelerators.forEach((accelerator) => {
            const current = counts.get(accelerator.slug) ?? 0;
            counts.set(accelerator.slug, current + 1);
        });
    });

    return (
        <div>
            <Helmet titleTemplate="%s | Ideas">
                <title>Accelerators</title>
            </Helmet>
            <section className={hero}>
                <div className={heroInner}>
                    <p className={heroBreadcrumb}>
                        allen institute / open ideas / accelerators/
                    </p>
                    <h1 className={heroTitle}>Accelerators</h1>
                    <p className={heroSubtitle}>
                        Browse ideas by the accelerator they belong to.
                    </p>
                </div>
            </section>
            <div className={listWrapper}>
                <ul>
                    {data.allAccelerator.nodes.map((accelerator) => {
                        const count = counts.get(accelerator.slug) ?? 0;
                        return (
                            <li key={accelerator.slug}>
                                <Link to={accelerator.slug}>
                                    {accelerator.name}
                                </Link>{" "}
                                ({count})
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default AcceleratorsPage;

export const pageQuery = graphql`
    query AcceleratorsIndex {
        allAccelerator(sort: { name: ASC }, filter: { active: { eq: true } }) {
            nodes {
                slug
                name
            }
        }
        allIdeaPost {
            nodes {
                accelerators {
                    slug
                }
            }
        }
    }
`;
