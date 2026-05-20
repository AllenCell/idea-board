import React, { useEffect } from "react";

import { graphql } from "gatsby";

import PropTypes from "prop-types";

import { useSetLayoutConfig } from "../LayoutContext";
import IdeaRoll from "../components/IdeaRoll";

const {
    hero,
    heroBreadcrumb,
    heroInner,
    heroSubtitle,
    heroTitle,
    listWrapper,
} = require("../style/index-page.module.css");

interface QueryResult {
    data: {
        markdownRemark: {
            frontmatter: Record<string, unknown>;
        };
    };
}

export const IndexPageTemplate: React.FC = () => {
    const setLayout = useSetLayoutConfig();

    useEffect(() => {
        setLayout({ fullWidthPage: true });
        return () => setLayout({ fullWidthPage: undefined });
    }, [setLayout]);

    return (
        <div>
            <section className={hero}>
                <div className={heroInner}>
                    <p className={heroBreadcrumb}>
                        allen institute / cell science / open ideas/
                    </p>
                    <h1 className={heroTitle}>Idea Board</h1>
                    <p className={heroSubtitle}>
                        A living collection of early-stage ideas, proposals, and
                        open questions from Allen Institute scientists.
                    </p>
                </div>
            </section>
            <div className={listWrapper}>
                <IdeaRoll />
            </div>
        </div>
    );
};

const IndexPage = ({ data: _ }: QueryResult) => {
    return <IndexPageTemplate />;
};

IndexPage.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.shape({
            frontmatter: PropTypes.object,
        }),
    }),
};

export default IndexPage;

export const pageQuery = graphql`
    query IndexPageTemplate {
        markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
            frontmatter {
                templateKey
            }
        }
    }
`;
