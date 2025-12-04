import React from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import { Layout as AntdLayout, Flex } from "antd";

import Layout from "../components/Layout";
import IdeaRoll from "../components/IdeaRoll";
import FullWidthImage from "../components/FullWidthImage";

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
                image: any; // Replace `any` with a more specific type if possible
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
    image: any; // Replace `any` with a more specific type if possible
    title: string;
    heading: string;
    subheading: string;
    mainpitch: MainPitch;
    description: string;
}

export const IndexPageTemplate: React.FC<IndexPageTemplateProps> = ({
    image,
    title,
    heading,
    subheading,
    mainpitch,
    description,
}) => {
    const heroImage = getImage(image) || image;

    return (
        <div className={container}>
            <FullWidthImage
                img={heroImage}
                title={title}
                subheading={subheading}
            />
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
        <Layout>
            <IndexPageTemplate
                image={frontmatter.image}
                title={frontmatter.title}
                heading={frontmatter.heading}
                subheading={frontmatter.subheading}
                mainpitch={frontmatter.mainpitch}
                description={frontmatter.description}
            />
        </Layout>
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
                title
                image {
                    childImageSharp {
                        gatsbyImageData(quality: 100, layout: FULL_WIDTH)
                    }
                }
                heading
                subheading
                mainpitch {
                    title
                    description
                }
                description
            }
        }
    }
`;
