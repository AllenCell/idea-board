import React from "react";
import PropTypes from "prop-types";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import Layout from "../components/Layout";
import IdeaRoll from "../components/IdeaRoll";
import FullWidthImage from "../components/FullWidthImage";

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
        <div>
            <FullWidthImage
                img={heroImage}
                title={title}
                subheading={subheading}
            />
            <section className="section section--gradient">
                <div className="container">
                    <div className="section">
                        <div className="columns">
                            <div className="column is-10 is-offset-1">
                                <div className="content">
                                    <div className="content">
                                        <div className="tile">
                                            <h1 className="title">
                                                {mainpitch.title}
                                            </h1>
                                        </div>
                                        <div className="tile">
                                            <h3 className="subtitle">
                                                {mainpitch.description}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="columns">
                                        <div className="column is-12">
                                            <h3 className="has-text-weight-semibold is-size-2">
                                                {heading}
                                            </h3>
                                            <p>{description}</p>
                                        </div>
                                    </div>
                                    <div className="column is-12">
                                        <h3 className="has-text-weight-semibold is-size-2">
                                            Most recent additions
                                        </h3>
                                        <IdeaRoll />
                                        <div className="column is-12 has-text-centered">
                                            <Link className="btn" to="/ideas">
                                                Read more
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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
