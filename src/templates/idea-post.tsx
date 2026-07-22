import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import { Button } from "antd";

import { useSetLayoutConfig } from "../LayoutContext";
import { ContactModal } from "../components/ContactModal";
import { CustomReactMarkdown } from "../components/CustomReactMarkdown";
import ExpandedDescriptionView from "../components/ExpandableDescriptionView";
import FigureGallery from "../components/FigureGallery";
import { MaterialsAndMethodsComponent } from "../components/MaterialsAndMethods";
import { PageNavSiderMenuItem } from "../components/PageNavSider";
import { TagPopover } from "../components/TagPopover";
import { RESOURCE_TYPES } from "../constants/resourceTypes";
import { useExpandedContent } from "../hooks/useExpandedContent";
import { IdeaPostNode, IdeaPostQuery } from "../types";

const {
    container,
    eyebrow,
    metaContact,
    metaGroup,
    metaKey,
    metaStrip,
    metaVal,
    metaValBlue,
    postHeader,
    postTitle,
    proposal,
    proposalTitle,
    relatedList,
    resourceList,
    resourcesIndent,
    sectionLabel,
    sectionText,
    sectionTitle,
    tag,
    tagRow,
    tagRowLabel,
} = require("../style/idea-post.module.css");

export type IdeaPostTemplateProps = IdeaPostNode & {
    isPreview?: boolean;
    onExpandDescription?: (
        content: string,
        label: string,
        sectionKey: string,
    ) => void;
};

export const IdeaPostTemplate: React.FC<IdeaPostTemplateProps> = ({
    authors,
    date,
    introduction,
    isPreview,
    nextSteps,
    onExpandDescription,
    preliminaryFindings,
    primaryContact,
    program,
    publication,
    relatedIdeas,
    resources,
    slug,
    tags,
    title,
    type,
}) => {
    const [contactModalOpen, setContactModalOpen] = useState(false);

    const hasFigures =
        preliminaryFindings?.figures && preliminaryFindings.figures.length > 0;
    const hasPreliminaryFindings =
        preliminaryFindings && (preliminaryFindings!.summary || hasFigures);
    const hasRelatedIdeas = relatedIdeas && relatedIdeas.length > 0;

    return (
        <>
            {/* Blue header block */}
            <div className={postHeader}>
                <div className={eyebrow}>
                    allen institute / ideas
                    {program && program.length > 0
                        ? ` / ${program.join(" / ")} /`
                        : " /"}
                </div>
                <h1 id="title" className={postTitle}>
                    {title}
                </h1>
            </div>

            {/* Metadata strip */}
            <div className={metaStrip}>
                {authors && authors.length > 0 && (
                    <div className={metaGroup}>
                        <span className={metaKey}>Authors</span>
                        <span className={metaValBlue}>
                            {authors.map((a) => a.name).join(" · ")}
                        </span>
                    </div>
                )}
                <div className={metaGroup}>
                    <span className={metaKey}>Date</span>
                    <span className={metaVal}>{date}</span>
                </div>
                {type && (
                    <div className={metaGroup}>
                        <span className={metaKey}>Type</span>
                        <span className={metaVal}>{type}</span>
                    </div>
                )}
                {program && program.length > 0 && (
                    <div className={metaGroup}>
                        <span className={metaKey}>Program</span>
                        <span className={metaVal}>{program.join(", ")}</span>
                    </div>
                )}
                <div className={metaContact}>
                    <Button onClick={() => setContactModalOpen(true)}>
                        Contact
                    </Button>
                </div>
            </div>
            {!isPreview && (
                <ContactModal
                    authors={authors}
                    primaryContact={primaryContact}
                    title={title}
                    open={contactModalOpen}
                    onClose={() => setContactModalOpen(false)}
                />
            )}

            {/* Tag row */}
            {tags && tags.length > 0 && (
                <div className={tagRow}>
                    <span className={tagRowLabel}>Topics</span>
                    {tags.map((t) =>
                        isPreview ? (
                            <span key={t} className={tag}>
                                {t}
                            </span>
                        ) : (
                            <TagPopover
                                key={t}
                                tag={t}
                                currentSlug={slug}
                                className={tag}
                            />
                        ),
                    )}
                </div>
            )}

            {/* Body */}
            <div className={container}>
                {introduction && (
                    <div id="introduction">
                        <div className={sectionLabel}>Introduction</div>
                        <CustomReactMarkdown
                            className={sectionText}
                            content={introduction}
                        />
                    </div>
                )}

                {nextSteps && (
                    <div id="proposal">
                        <div className={sectionLabel}>Project Proposal</div>
                        <div className={proposal}>
                            <h4 className={proposalTitle}>Next steps</h4>
                            <CustomReactMarkdown
                                className={sectionText}
                                content={nextSteps}
                            />
                        </div>
                    </div>
                )}

                {hasPreliminaryFindings && (
                    <div id="preliminary-findings">
                        <div className={sectionLabel}>Preliminary Findings</div>
                        {preliminaryFindings.summary && (
                            <CustomReactMarkdown
                                className={sectionText}
                                content={preliminaryFindings.summary}
                            />
                        )}
                        {hasFigures && (
                            <FigureGallery
                                figures={preliminaryFindings.figures}
                            />
                        )}
                    </div>
                )}

                <div id="relevant-resources">
                    <div className={sectionLabel}>Relevant Resources</div>
                    <div className={resourcesIndent}>
                        {publication && (
                            <div id="publication">
                                <h4 className={sectionTitle}>Publication</h4>
                                <ul className={resourceList}>
                                    <li>{publication}</li>
                                </ul>
                            </div>
                        )}
                        {resources &&
                            (isPreview ? (
                                <ul className={resourceList}>
                                    {(resources as unknown as string[]).map(
                                        (slug) => (
                                            <li key={slug}>{slug}</li>
                                        ),
                                    )}
                                </ul>
                            ) : (
                                <MaterialsAndMethodsComponent
                                    resources={[...resources]}
                                    onExpandDescription={onExpandDescription}
                                />
                            ))}
                    </div>
                </div>

                {hasRelatedIdeas && !isPreview && (
                    <div id="related-ideas">
                        <div className={sectionLabel}>Related Ideas</div>
                        <ul className={relatedList}>
                            {relatedIdeas!.map((idea) => {
                                if (!idea.slug && !idea.title) return null;
                                return (
                                    <li key={idea.slug}>
                                        <Link to={idea.slug}>{idea.title}</Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

function buildIdeaNavItems(fm: IdeaPostNode): PageNavSiderMenuItem[] {
    const hasResourceType = (type: string) =>
        fm.resources?.some((r) => r.type === type);
    const hasProtocols =
        hasResourceType(RESOURCE_TYPES.PROTOCOL_LINK) ||
        hasResourceType(RESOURCE_TYPES.PROTOCOL_FILE);

    return [
        { key: "title", label: <a href="#title">{fm.title}</a> },
        fm.introduction && {
            key: "introduction",
            label: <a href="#introduction">Introduction</a>,
        },
        fm.nextSteps?.length && {
            key: "proposal",
            label: <a href="#proposal">Proposal</a>,
        },
        fm.preliminaryFindings && {
            key: "preliminary-findings",
            label: <a href="#preliminary-findings">Preliminary Findings</a>,
        },
        {
            key: "relevant-resources",
            label: <a href="#relevant-resources">Relevant Resources</a>,
        },
        fm.publication && {
            key: "publication",
            label: <a href="#publication">Publication</a>,
        },
        hasResourceType(RESOURCE_TYPES.DATASET) && {
            key: "datasets",
            label: <a href="#datasets">Datasets</a>,
        },
        hasResourceType(RESOURCE_TYPES.CELL_LINE) && {
            key: "cell-lines",
            label: <a href="#cell-lines">Cell Lines</a>,
        },
        hasProtocols && {
            key: "protocols",
            label: <a href="#protocols">Protocols</a>,
        },
        hasResourceType(RESOURCE_TYPES.SOFTWARE_TOOL) && {
            key: "software-tools",
            label: <a href="#software-tools">Software Tools</a>,
        },
        fm.relatedIdeas?.length && {
            key: "related-ideas",
            label: <a href="#related-ideas">Related Ideas</a>,
        },
    ].filter(Boolean) as PageNavSiderMenuItem[];
}

const IdeaPost: React.FC<PageProps<IdeaPostQuery>> = ({ data }) => {
    const setLayout = useSetLayoutConfig();
    const ideaPost = data.ideaPost;
    const { expandedContent, handleBack, handleExpand, handleNavItemClick } =
        useExpandedContent();

    const PageNavSiderItems = useMemo(
        () => (ideaPost ? buildIdeaNavItems(ideaPost) : []),
        [ideaPost],
    );

    useEffect(() => {
        if (!ideaPost) return;
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
    }, [ideaPost, PageNavSiderItems, setLayout]);

    // Register nav click handler + active key override when in expanded view
    useEffect(() => {
        setLayout({
            onNavItemClick: expandedContent ? handleNavItemClick : null,
            activeNavKey: expandedContent ? expandedContent.sectionKey : null,
        });
    }, [expandedContent, handleNavItemClick, setLayout]);

    // Runtime guard - markdownRemark can be null if query doesn't find matching ID
    if (!ideaPost) {
        return <p>Post not found.</p>;
    }

    const { description, title } = ideaPost;

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
                    {...ideaPost}
                    onExpandDescription={handleExpand}
                />
            )}
        </>
    );
};

export default IdeaPost;

export const pageQuery = graphql`
    query IdeaPostByID($id: String!) {
        ideaPost(id: { eq: $id }) {
            slug
            authors {
                name
                contactId
            }
            primaryContact {
                name
                contactId
            }
            publication
            date(formatString: "MMMM DD, YYYY")
            introduction
            title
            description
            tags
            program
            type
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
            relatedIdeas {
                title
                slug
            }
        }
    }
`;
