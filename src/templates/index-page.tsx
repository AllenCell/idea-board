import React from "react";

import { graphql } from "gatsby";

import PropTypes from "prop-types";

import IdeaRoll from "../components/IdeaRoll";

const {
    container,
    header,
    info,
    listWrapper,
} = require("../style/index-page.module.css");
interface QueryResult {
    data: {
        markdownRemark: {
            frontmatter: {
                title: string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                image: any; // TODO: Replace `any` with a more specific type if possible
                heading: string;
                subheading: string;
                mainpitch: MainPitch;
                description: string;
            };
        };
    };
}

interface MainPitch {
    title: string;
    description: string;
}

interface IndexPageTemplateProps {
    heading: string;
    mainpitch: MainPitch;
    description: string;
}

export const IndexPageTemplate: React.FC<IndexPageTemplateProps> = ({
    description,
    heading,
    mainpitch,
}) => {
    return (
        <div className={container}>
            <div className={header}>
                <h4>{mainpitch.title}</h4>
                <p>{mainpitch.description}</p>
                <div className={info}>
                    <div>{heading}</div>
                    <p>{description}</p>
                </div>
            </div>
            <div>
                <div className={listWrapper}>
                    <h3>Most recent additions</h3>
                    <IdeaRoll count={3} />
                </div>
            </div>
        </div>
    );
};

const IndexPage = ({ data }: QueryResult) => {
    const { frontmatter } = data.markdownRemark;

    return (
        <IndexPageTemplate
            heading={frontmatter.heading}
            mainpitch={frontmatter.mainpitch}
            description={frontmatter.description}
        />
    );
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
                heading
                mainpitch {
                    title
                    description
                }
                description
            }
        }
    }
`;
