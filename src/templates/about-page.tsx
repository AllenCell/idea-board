import React, { useEffect } from "react";

import { Link, graphql } from "gatsby";

import { BulbOutlined, DatabaseOutlined, EyeOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { useSetLayoutConfig } from "../LayoutContext";

const {
    audience,
    card,
    cardGrid,
    cardHeader,
    cardIcon,
    container,
    contentTypes,
    contentTypesInner,
    cta,
    heroAccent,
    heroContent,
    heroImage,
    heroOverlay,
    heroSection,
    howToUse,
    howToUseInner,
    intro,
    introStatement,
    stepCard,
    stepGrid,
    stepNumber,
} = require("../style/about-page.module.css");

const ICON_MAP: Record<string, React.ReactElement> = {
    bulb: <BulbOutlined />,
    database: <DatabaseOutlined />,
    eye: <EyeOutlined />,
};

interface ContentTypeItem {
    title: string;
    description: string;
    icon: string;
}

interface Step {
    title: string;
    description: string;
}

interface AboutPageTemplateProps {
    bannerImage?: string;
    title: string;
    intro: {
        title: string;
        paragraphs: string[];
    };
    audience: {
        title: string;
        items: string[];
    };
    contentTypes: {
        title: string;
        items: ContentTypeItem[];
    };
    howToUse: {
        title: string;
        steps: Step[];
    };
    cta: {
        title: string;
        buttonText: string;
    };
}

interface QueryResult {
    data: {
        markdownRemark: {
            frontmatter: Omit<AboutPageTemplateProps, "bannerImage"> & {
                bannerImage?: { publicURL: string } | null;
            };
        };
    };
}

export const AboutPageTemplate = ({
    audience: audienceData,
    bannerImage,
    contentTypes: contentTypesData,
    cta: ctaData,
    howToUse: howToUseData,
    intro: introData,
    title,
}: AboutPageTemplateProps) => {
    return (
        <div className={container}>
            {/* ── Hero banner ── */}
            <section className={heroSection}>
                {bannerImage && (
                    <img className={heroImage} src={bannerImage} alt="" />
                )}
                <div className={heroOverlay} />
                <div className={heroContent}>
                    <h1>{title}</h1>
                    <div className={heroAccent} />
                </div>
            </section>

            {/* ── Intro: what is this + who it's for ── */}
            <section className={intro}>
                <div className={introStatement}>
                    <h2>{introData.title}</h2>
                    {introData.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>
                <div className={audience}>
                    <h3>{audienceData.title}</h3>
                    <ul>
                        {audienceData.items.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── What you'll find ── */}
            <section className={contentTypes}>
                <div className={contentTypesInner}>
                    <h2>{contentTypesData.title}</h2>
                    <div className={cardGrid}>
                        {contentTypesData.items.map(
                            ({ description, icon, title: cardTitle }) => (
                                <div className={card} key={cardTitle}>
                                    <div className={cardHeader}>
                                        <span className={cardIcon}>
                                            {ICON_MAP[icon]}
                                        </span>
                                        <h3>{cardTitle}</h3>
                                    </div>
                                    <p>{description}</p>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {/* ── How to use this site ── */}
            <section className={howToUse}>
                <div className={howToUseInner}>
                    <h2>{howToUseData.title}</h2>
                    <div className={stepGrid}>
                        {howToUseData.steps.map((step, i) => (
                            <div className={stepCard} key={step.title}>
                                <span className={stepNumber}>{i + 1}</span>
                                <h3>{step.title}</h3>
                                {step.description && <p>{step.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Call to action ── */}
            <section className={cta}>
                <h2>{ctaData.title}</h2>
                <Link to="/">
                    <Button size="large" type="primary">
                        {ctaData.buttonText}
                    </Button>
                </Link>
            </section>
        </div>
    );
};

const AboutPage = ({ data }: QueryResult) => {
    const { frontmatter } = data.markdownRemark;
    const setLayout = useSetLayoutConfig();

    useEffect(() => {
        setLayout({ fullWidthPage: true });
        return () => setLayout({ fullWidthPage: undefined });
    }, []);

    return (
        <AboutPageTemplate
            bannerImage={frontmatter.bannerImage?.publicURL}
            title={frontmatter.title}
            intro={frontmatter.intro}
            audience={frontmatter.audience}
            contentTypes={frontmatter.contentTypes}
            howToUse={frontmatter.howToUse}
            cta={frontmatter.cta}
        />
    );
};

export default AboutPage;

export const aboutPageQuery = graphql`
    query AboutPage($id: String!) {
        markdownRemark(id: { eq: $id }) {
            frontmatter {
                bannerImage {
                    publicURL
                }
                title
                intro {
                    title
                    paragraphs
                }
                audience {
                    title
                    items
                }
                contentTypes {
                    title
                    items {
                        title
                        description
                        icon
                    }
                }
                howToUse {
                    title
                    steps {
                        title
                        description
                    }
                }
                cta {
                    title
                    buttonText
                }
            }
        }
    }
`;
