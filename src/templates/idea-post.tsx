import React from "react";
import { Helmet } from "react-helmet-async";
import { graphql, Link, PageProps } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Layout as AntdLayout, Card, Flex } from "antd";
import {
    ArrowLeftOutlined,
    MessageOutlined,
    StarOutlined,
} from "@ant-design/icons";

import Layout from "../components/Layout";
import IconText from "../components/IconText";
import { MaterialsAndMethodsComponent } from "../components/MaterialsAndMethods";
import { IdeaFields, IdeaFrontmatter, IdeaPostQuery } from "../types";
import { TagPopover } from "../components/TagPopover";
import FigureComponent from "../components/Figure";

const Header = AntdLayout.Header;

const {
    section,
    sectionTitle,
    taglist,
    proposal,
    card,
    actionIcons,
} = require("../style/idea-post.module.css");

export const IdeaPostTemplate: React.FC<IdeaFrontmatter & IdeaFields> = ({
    authors,
    introduction,
    slug,
    tags,
    title,
    materialsAndMethods,
    nextSteps,
    preliminaryFindings,
    publication,
}) => {
    const getTagList = (tags: readonly string[]) => {
        return (
            <ul className={taglist}>
                {tags.map((tag) => (
                    <li key={tag}>
                        <TagPopover tag={tag} currentSlug={slug} />
                    </li>
                ))}
            </ul>
        );
    };

    const getAuthorsList = (authors: readonly string[]) => {
        if (authors.length === 0) {
            return null;
        }
        return (
            <>
                <h4 className={sectionTitle}>Proposed by: </h4>
                <p> {authors.join(", ")}</p>
            </>
        );
    };

    const hasFigures =
        preliminaryFindings?.figures && preliminaryFindings.figures.length > 0;

    return (
        <div>
            <Header>
                <Link to="/">
                    <ArrowLeftOutlined />
                    <span> All proposals </span>
                </Link>
            </Header>
            <Card className={card}>
                <div>
                    <Flex
                        justify="space-between"
                        align="center"
                        className={sectionTitle}
                    >
                        <h3>{title}</h3>
                        <Flex className={actionIcons} gap={6}>
                            <IconText
                                icon={StarOutlined}
                                text="2"
                                key="star-o"
                            />
                            <IconText
                                icon={MessageOutlined}
                                text="2"
                                key="message-o"
                            />
                        </Flex>
                    </Flex>

                    <p className={proposal}>{introduction}</p>
                    {getAuthorsList(authors)}
                    {publication && (
                        <>
                            <h4 className={sectionTitle}>Publication </h4>
                            <p> {publication}</p>
                        </>
                    )}
                </div>

                {preliminaryFindings && (
                    <div className={section}>
                        <h4 className={sectionTitle}>Preliminary Findings</h4>
                        <p>{preliminaryFindings.summary}</p>

                        {hasFigures &&
                            preliminaryFindings.figures.map((figure) => {
                                return (
                                    <FigureComponent
                                        figure={figure}
                                    />
                                );
                            })}
                    </div>
                )}

                {nextSteps && (
                    <div className={section}>
                        <h4 className={sectionTitle}>Suggested next steps:</h4>
                        <ul>
                            {nextSteps.map((step: string, index: number) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <MaterialsAndMethodsComponent {...materialsAndMethods} />
                {tags && tags.length ? <div>{getTagList(tags)}</div> : null}
            </Card>
        </div>
    );
};

const IdeaPost: React.FC<PageProps<IdeaPostQuery>> = ({ data }) => {
    const markdownRemark = data.markdownRemark;
    // Runtime guard - markdownRemark can be null if query doesn't find matching ID
    if (!markdownRemark) {
        return (
            <Layout>
                <p>Post not found.</p>
            </Layout>
        );
    }

    const { title, description } = markdownRemark.frontmatter;

    return (
        <Layout>
            <Helmet titleTemplate="%s | Ideas">
                <title>{title}</title>
                <meta name="description" content={description ?? ""} />
            </Helmet>

            <IdeaPostTemplate
                {...markdownRemark.frontmatter}
                {...markdownRemark.fields}
            />
        </Layout>
    );
};

export default IdeaPost;

export const pageQuery = graphql`
    query IdeaPostByID($id: String!) {
        markdownRemark(id: { eq: $id }) {
            id
            html
            fields {
                slug
            }
            frontmatter {
                authors
                publication
                date(formatString: "MMMM DD, YYYY")
                introduction
                title
                description
                tags
                preliminaryFindings {
                    summary
                    figures {
                        figure {
                            childImageSharp {
                                gatsbyImageData(width: 600, quality: 90)
                            }
                        }
                        caption
                    }
                }
                publication
                nextSteps
                materialsAndMethods {
                    dataset {
                        frontmatter {
                            name
                            description
                            link
                            status
                            date
                        }
                    }
                    protocols {
                        protocol
                    }
                    cellLines {
                        name
                        link
                    }
                    software {
                        softwareTool {
                            frontmatter {
                                name
                                description
                                link
                            }
                        }
                        customDescription
                    }
                }
            }
        }
    }
`;
