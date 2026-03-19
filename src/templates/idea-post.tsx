import React from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import {
    ArrowLeftOutlined,
    MessageOutlined,
    StarOutlined,
} from "@ant-design/icons";
import { Layout as AntdLayout, Card, Flex } from "antd";

import { CustomReactMarkdown } from "../components/CustomReactMarkdown";
import FigureComponent from "../components/Figure";
import IconText from "../components/IconText";
import { MaterialsAndMethodsComponent } from "../components/MaterialsAndMethods";
import ResourcesComponent from "../components/ResourcesComponent";
import { TagPopover } from "../components/TagPopover";
import { IdeaFields, IdeaFrontmatter, IdeaPostQuery } from "../types";

const Header = AntdLayout.Header;

const {
    actionIcons,
    card,
    proposal,
    section,
    sectionTitle,
    taglist,
} = require("../style/idea-post.module.css");

export const IdeaPostTemplate: React.FC<IdeaFrontmatter & IdeaFields> = ({
    authors,
    introduction,
    materialsAndMethods,
    nextSteps,
    preliminaryFindings,
    publication,
    resources,
    slug,
    tags, // TODO: migrate MaterialsAndMethods to use resources
    title,
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
    const hasPreliminaryFindings =
        preliminaryFindings && (preliminaryFindings!.summary || hasFigures);

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
                    {introduction && (
                        <div className={proposal}>
                            <CustomReactMarkdown content={introduction} />
                        </div>
                    )}
                    {getAuthorsList(authors)}
                    {publication && (
                        <>
                            <h4 className={sectionTitle}>Publication </h4>
                            <p> {publication}</p>
                        </>
                    )}
                </div>

                {hasPreliminaryFindings && (
                    <div className={section}>
                        <h4 className={sectionTitle}>Preliminary Findings</h4>
                        {preliminaryFindings.summary && (
                            <CustomReactMarkdown
                                content={preliminaryFindings.summary}
                            />
                        )}
                        <Flex>
                            {hasFigures &&
                                preliminaryFindings.figures.map(
                                    (figure, index) => {
                                        return (
                                            <FigureComponent
                                                key={index}
                                                figure={figure}
                                            />
                                        );
                                    },
                                )}
                        </Flex>
                    </div>
                )}
                {nextSteps && (
                    <div className={section}>
                        <h4 className={sectionTitle}>Suggested next steps:</h4>
                        <CustomReactMarkdown content={nextSteps} />
                    </div>
                )}
                {!!resources?.length && (
                    <ResourcesComponent resources={[...resources]} />
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
        return <p>Post not found.</p>;
    }

    const { description, title } = markdownRemark.frontmatter;

    return (
        <>
            <Helmet titleTemplate="%s | Ideas">
                <title>{title}</title>
                <meta name="description" content={description ?? ""} />
            </Helmet>
            <IdeaPostTemplate
                {...markdownRemark.frontmatter}
                {...markdownRemark.fields}
            />
        </>
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
                        type
                        url
                        file {
                            childImageSharp {
                                gatsbyImageData(width: 600, quality: 90)
                            }
                        }
                        caption
                    }
                }
                nextSteps
                resources {
                    ...ResourceFields
                }
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
