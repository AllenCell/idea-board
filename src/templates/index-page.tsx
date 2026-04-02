import React from "react";

import { BulbOutlined, DatabaseOutlined, EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link, graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";

import PropTypes from "prop-types";

import FullWidthImage from "../components/FullWidthImage";
import IdeaRoll from "../components/IdeaRoll";

const {
    audience,
    card,
    cardGrid,
    cardIcon,
    container,
    contentTypes,
    contentTypesInner,
    cta,
    ctaButtons,
    intro,
    introStatement,
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
    subheading: string;
    mainpitch: MainPitch;
}

const CONTENT_TYPES = [
    {
        icon: <BulbOutlined />,
        title: "New Idea or Question",
        description:
            "An unexamined research question that could be investigated using one of our datasets — minimal preliminary work done, high potential for discovery.",
    },
    {
        icon: <DatabaseOutlined />,
        title: "Software Project",
        description:
            "Apply one of our software tools to your own data, or convert a one time use script to a ready-to-use software module.",
    },
    {
        icon: <EyeOutlined />,
        title: "Observation",
        description:
            "Something we've seen in our data that could be an interesting jumping-off point for a project, or corroborating evidence for work in another model system.",
    },
];

export const IndexPageTemplate: React.FC<IndexPageTemplateProps> = ({
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

            {/* ── Intro: what is this + who it's for ── */}
            <section className={intro}>
                <div className={introStatement}>
                    <h2>{mainpitch.title}</h2>
                    <p>{mainpitch.description}</p>
                </div>
                <div className={audience}>
                    <h3>Who this is for</h3>
                    <ul>
                        <li>External researchers looking to use AICS data in novel ways</li>
                        <li>Students and postdocs seeking a project or collaboration</li>
                        <li>Anyone curious about the open questions driving cell biology at scale</li>
                    </ul>
                </div>
            </section>

            {/* ── What you'll find ── */}
            <section className={contentTypes}>
                <div className={contentTypesInner}>
                    <h2>What you&apos;ll find here</h2>
                    <div className={cardGrid}>
                        {CONTENT_TYPES.map(({ description, icon, title: cardTitle }) => (
                            <div className={card} key={cardTitle}>
                                <span className={cardIcon}>{icon}</span>
                                <h3>{cardTitle}</h3>
                                <p>{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Call to action ── */}
            <section className={cta}>
                <h2>Ready to explore?</h2>
                <div className={ctaButtons}>
                    <Link to="/ideas">
                        <Button size="large" type="primary">
                            Browse Ideas
                        </Button>
                    </Link>
                </div>
            </section>

            {/* ── Most recent additions ── */}
            <div className={listWrapper}>
                <h3>Most recent additions</h3>
                <IdeaRoll count={3} />
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
            subheading={frontmatter.subheading}
            mainpitch={frontmatter.mainpitch}
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
                subheading
                mainpitch {
                    title
                    description
                }
            }
        }
    }
`;
