import React from "react";

import { graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import PropTypes from "prop-types";

import FullWidthImage from "../components/FullWidthImage";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: any; // Replace `any` with a more specific type if possible
    title: string;
    heading: string;
    subheading: string;
    mainpitch: MainPitch;
    description: string;
}

export const IndexPageTemplate: React.FC<IndexPageTemplateProps> = ({
    description,
    heading,
    image,
    mainpitch,
    subheading,
    title,
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
        <IndexPageTemplate
            image={frontmatter.image}
            title={frontmatter.title}
            heading={frontmatter.heading}
            subheading={frontmatter.subheading}
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
