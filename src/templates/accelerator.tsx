import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import { PageProps, graphql } from "gatsby";

import { useSetLayoutConfig } from "../LayoutContext";
import { AcceleratorFilter } from "../components/AcceleratorFilter";
import { CustomReactMarkdown } from "../components/CustomReactMarkdown";
import IdeaRoll from "../components/IdeaRoll";

const {
    hero,
    heroBreadcrumb,
    heroInner,
    heroSubtitle,
    heroTitle,
    listWrapper,
} = require("../style/index-page.module.css");

interface AcceleratorTemplateProps {
    name?: string | null;
    description?: string | null;
    slug: string;
}

export const AcceleratorTemplate: React.FC<AcceleratorTemplateProps> = ({
    description,
    name,
    slug,
}) => (
    <div>
        <section className={hero}>
            <div className={heroInner}>
                <p className={heroBreadcrumb}>
                    allen institute / open ideas / accelerators/
                </p>
                <h1 className={heroTitle}>{name}</h1>
                {description && (
                    <CustomReactMarkdown
                        className={heroSubtitle}
                        content={description}
                    />
                )}
            </div>
        </section>
        <div className={listWrapper}>
            <AcceleratorFilter activeSlug={slug} />
            <IdeaRoll acceleratorSlug={slug} />
        </div>
    </div>
);

const Accelerator: React.FC<PageProps<Queries.AcceleratorByIdQuery>> = ({
    data,
}) => {
    const setLayout = useSetLayoutConfig();
    const accelerator = data.accelerator;

    useEffect(() => {
        setLayout({ fullWidthPage: true });
        return () => setLayout({ fullWidthPage: undefined });
    }, [setLayout]);

    if (!accelerator) {
        return <p>Accelerator not found.</p>;
    }

    return (
        <>
            <Helmet titleTemplate="%s | Ideas">
                <title>{`${accelerator.name ?? "Accelerator"} ideas`}</title>
            </Helmet>
            <AcceleratorTemplate
                name={accelerator.name}
                description={accelerator.description}
                slug={accelerator.slug}
            />
        </>
    );
};

export default Accelerator;

export const pageQuery = graphql`
    query AcceleratorById($id: String!) {
        accelerator(id: { eq: $id }) {
            slug
            name
            description
        }
    }
`;
