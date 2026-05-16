import React from "react";

import { graphql } from "gatsby";

import PropTypes from "prop-types";

import IdeaRoll from "../components/IdeaRoll";

const {
    hero,
    heroBreadcrumb,
    heroSubtitle,
    heroTitle,
    listWrapper,
    pageBackground,
} = require("../style/index-page.module.css");

interface QueryResult {
    data: {
        markdownRemark: {
            frontmatter: Record<string, unknown>;
        };
    };
}

export const IndexPageTemplate: React.FC = () => {
    return (
        <div className={pageBackground}>
            <div className={hero}>
                <p className={heroBreadcrumb}>
                    allen institute / cell science / open ideas/
                </p>
                <h1 className={heroTitle}>Idea Board</h1>
                <p className={heroSubtitle}>
                    A living collection of early-stage ideas, proposals, and
                    open questions from Allen Institute scientists.
                </p>
            </div>
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
