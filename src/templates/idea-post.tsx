import React, { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";

import { PageProps, graphql } from "gatsby";

import { Flex } from "antd";

import { useSetLayoutConfig } from "../LayoutContext";
import { CustomReactMarkdown } from "../components/CustomReactMarkdown";
import ExpandedDescriptionView from "../components/ExpandableDescriptionView";
import FigureGallery from "../components/FigureGallery";
import { MaterialsAndMethodsComponent } from "../components/MaterialsAndMethods";
import { PageNavSiderMenuItem } from "../components/PageNavSider";
import { TagPopover } from "../components/TagPopover";
import { useExpandedContent } from "../hooks/useExpandedContent";
import { IdeaFields, IdeaFrontmatter, IdeaPostQuery } from "../types";

const {
    authorsClass,
    container,
    mainTitle,
    proposal,
    proposalTitle,
    section,
    sectionText,
    sectionTitle,
    taglist,
} = require("../style/idea-post.module.css");

export const IdeaPostTemplate: React.FC<
    IdeaFrontmatter &
        IdeaFields & {
            onExpandDescription?: (
                content: string,
                label: string,
                sectionKey: string,
            ) => void;
        }
> = ({
    authors,
    introduction,
    materialsAndMethods,
    nextSteps,
    onExpandDescription,
    preliminaryFindings,
    publication,
    slug,
    tags,
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
            <p id="authors" className={authorsClass}>
                {" "}
                {authors.join(", ")}
            </p>
        );
    };

    const hasFigures =
        preliminaryFindings?.figures && preliminaryFindings.figures.length > 0;
    const hasPreliminaryFindings =
        preliminaryFindings && (preliminaryFindings!.summary || hasFigures);

    return (
        <div className={container}>
            <div>
                <Flex
                    justify="space-between"
                    align="center"
                    className={sectionTitle}
                >
                    <h3 id="title" className={mainTitle}>
                        {title}
                    </h3>
                </Flex>
                {getAuthorsList(authors)}
                {introduction && (
                    <div id="introduction" className={section}>
                        <CustomReactMarkdown
                            className={sectionText}
                            content={introduction}
                        />
                    </div>
                )}
                {tags && tags.length ? <div>{getTagList(tags)}</div> : null}
                {nextSteps && (
                    <div id="proposal" className={proposal}>
                        <h4 className={proposalTitle}>Project proposal:</h4>
                        <CustomReactMarkdown
                            className={sectionText}
                            content={nextSteps}
                        />
                    </div>
                )}
                <h3 id="relevant-resources" className={sectionTitle}>
                    Relevant Resources{" "}
                </h3>
                {publication && (
                    <div id="publication">
                        <h4 className={sectionTitle}>Publications </h4>
                        {/* TODO I think it only makes sense to have publications that are links */}
                        <a> {publication}</a>
                    </div>
                )}
            </div>

            {hasPreliminaryFindings && (
                <div id="preliminary-findings" className={section}>
                    <h4 className={sectionTitle}>Preliminary Findings</h4>
                    {preliminaryFindings.summary && (
                        <CustomReactMarkdown
                            className={sectionText}
                            content={preliminaryFindings.summary}
                        />
                    )}
                    {hasFigures && (
                        <>
                            <h4 className={sectionTitle}>Figures</h4>
                            <FigureGallery
                                figures={preliminaryFindings.figures}
                            />
                        </>
                    )}
                </div>
            )}

            {materialsAndMethods && (
                <MaterialsAndMethodsComponent
                    materialsAndMethods={materialsAndMethods}
                    onExpandDescription={onExpandDescription}
                />
            )}
            {tags && tags.length ? <div>{getTagList(tags)}</div> : null}
        </div>
    );
};

function buildIdeaNavItems(fm: IdeaFrontmatter): PageNavSiderMenuItem[] {
    const mm = fm.materialsAndMethods;
    return [
        { key: "title", label: <a href="#title">{fm.title}</a> },
        fm.authors?.length && {
            key: "authors",
            label: <a href="#authors">Authors</a>,
        },
        fm.introduction && {
            key: "introduction",
            label: <a href="#introduction">Introduction</a>,
        },
        fm.nextSteps?.length && {
            key: "proposal",
            label: <a href="#proposal">Proposal</a>,
        },
        {
            key: "relevant-resources",
            label: <a href="#relevant-resources">Relevant Resources</a>,
        },
        fm.publication && {
            key: "publication",
            label: <a href="#publication">Publication</a>,
        },
        fm.preliminaryFindings && {
            key: "preliminary-findings",
            label: <a href="#preliminary-findings">Preliminary Findings</a>,
        },
        fm.preliminaryFindings?.figures?.length && {
            key: "gallery",
            label: <a href="#gallery">Gallery</a>,
        },
        mm?.dataset && {
            key: "datasets",
            label: <a href="#datasets">Datasets</a>,
        },
        mm?.cellLines?.length && {
            key: "cell-lines",
            label: <a href="#cell-lines">Cell Lines</a>,
        },
        mm?.protocols?.length && {
            key: "protocols",
            label: <a href="#protocols">Protocols</a>,
        },
        mm?.software?.length && {
            key: "software-tools",
            label: <a href="#software-tools">Software Tools</a>,
        },
    ].filter(Boolean) as PageNavSiderMenuItem[];
}

const IdeaPost: React.FC<PageProps<IdeaPostQuery>> = ({ data }) => {
    const setLayout = useSetLayoutConfig();
    const markdownRemark = data.markdownRemark;
    const { expandedContent, handleBack, handleExpand, handleNavItemClick } =
        useExpandedContent();

    const PageNavSiderItems = useMemo(
        () =>
            markdownRemark ? buildIdeaNavItems(markdownRemark.frontmatter) : [],
        [markdownRemark],
    );

    useEffect(() => {
        if (!markdownRemark) return;
        setLayout({
            showPageNavSider: true,
            PageNavSiderItems,
        });
        return () => {
            setLayout({
                showPageNavSider: false,
                PageNavSiderItems: [],
            });
        };
    }, [markdownRemark, PageNavSiderItems, setLayout]);

    // Register nav click handler + active key override when in expanded view
    useEffect(() => {
        setLayout({
            onNavItemClick: expandedContent ? handleNavItemClick : null,
            activeNavKey: expandedContent ? expandedContent.sectionKey : null,
        });
    }, [expandedContent, handleNavItemClick, setLayout]);

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
            {expandedContent ? (
                <ExpandedDescriptionView
                    content={expandedContent.content}
                    label={expandedContent.label}
                    onBack={handleBack}
                />
            ) : (
                <IdeaPostTemplate
                    {...markdownRemark.frontmatter}
                    {...markdownRemark.fields}
                    onExpandDescription={handleExpand}
                />
            )}
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
                materialsAndMethods {
                    dataset {
                        frontmatter {
                            name
                            shortDescription
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
