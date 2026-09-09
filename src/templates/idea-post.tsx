import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import { Button } from "antd";

import { useSetLayoutConfig } from "../LayoutContext";
import { ContactModal } from "../components/ContactModal";
import { CustomReactMarkdown } from "../components/CustomReactMarkdown";
import ExpandedDescriptionView from "../components/ExpandableDescriptionView";
import FigureGallery from "../components/FigureGallery";
import { IdeaHeroImage } from "../components/IdeaHeroImage";
import { MaterialsAndMethodsComponent } from "../components/MaterialsAndMethods";
import { MaturityBadge } from "../components/MaturityBadge";
import { PageNavSiderMenuItem } from "../components/PageNavSider";
import { SectionLabel } from "../components/SectionLabel";
import { TagPopover } from "../components/TagPopover";
import {
    HOW_TO_START_PATH,
    HOW_TO_START_TITLE,
} from "../constants/sectionQuestions";
import { useExpandedContent } from "../hooks/useExpandedContent";
import { IdeaPostNode, IdeaPostQuery } from "../types";

const {
    container,
    eyebrow,
    howToStart,
    howToStartBlurb,
    metaContact,
    metaGroup,
    metaGroups,
    metaKey,
    metaStrip,
    metaVal,
    postByline,
    postHeader,
    postTitle,
    relatedCard,
    relatedGrid,
    resourcesIndent,
    sectionIntro,
    sectionText,
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
    accelerator,
    authors,
    date,
    flagshipResources,
    introduction,
    isPreview,
    layout,
    maturity,
    nextSteps,
    onExpandDescription,
    preliminaryFindings,
    primaryContact,
    program,
    publication,
    relatedIdeas,
    researcherLevel,
    resources,
    resourcesIntro,
    scope,
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
    const hasFlagshipResources =
        flagshipResources && flagshipResources.length > 0;

    // Flagship resources are featured on the how-to-start page, not listed twice
    const flagshipSlugs = new Set(
        (flagshipResources ?? []).map((r) => r?.slug).filter(Boolean),
    );
    const groupedResources = (resources ?? []).filter(
        (r) => !flagshipSlugs.has(r?.slug),
    );

    // An image-led idea shows its picture here rather than only on how-to-start
    const showHero = layout === "image" && hasFlagshipResources;

    const hasHowToStart = Boolean(nextSteps) || hasFlagshipResources;
    const howToStartPath = `${slug}${HOW_TO_START_PATH}/`;

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
                <div className={postByline}>
                    {authors && authors.length > 0 && (
                        <span>{authors.map((a) => a.name).join(" · ")}</span>
                    )}
                    {date && <span>{date}</span>}
                </div>
            </div>

            {/* Metadata strip */}
            <div className={metaStrip}>
                <div className={metaGroups}>
                    {type && (
                        <div className={metaGroup}>
                            <span className={metaKey}>Type</span>
                            <span className={metaVal}>{type}</span>
                        </div>
                    )}
                    {maturity && (
                        <div className={metaGroup}>
                            <span className={metaKey}>Maturity</span>
                            <MaturityBadge
                                maturity={maturity}
                                variant="inline"
                            />
                        </div>
                    )}
                    {program && program.length > 0 && (
                        <div className={metaGroup}>
                            <span className={metaKey}>Program</span>
                            <span className={metaVal}>
                                {program.join(", ")}
                            </span>
                        </div>
                    )}
                    {accelerator && accelerator.length > 0 && (
                        <div className={metaGroup}>
                            <span className={metaKey}>Accelerator</span>
                            <span className={metaVal}>
                                {accelerator.join(", ")}
                            </span>
                        </div>
                    )}
                    {scope && (
                        <div className={metaGroup}>
                            <span className={metaKey}>Scope</span>
                            <span className={metaVal}>{scope}</span>
                        </div>
                    )}
                    {researcherLevel && researcherLevel.length > 0 && (
                        <div className={metaGroup}>
                            <span className={metaKey}>Level</span>
                            <span className={metaVal}>
                                {researcherLevel.join(", ")}
                            </span>
                        </div>
                    )}
                </div>
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
                {showHero && <IdeaHeroImage resources={flagshipResources} />}

                {introduction && (
                    <div id="introduction">
                        <SectionLabel section="introduction" />
                        <CustomReactMarkdown
                            className={sectionText}
                            content={introduction}
                        />
                    </div>
                )}

                {hasHowToStart && (
                    <div className={howToStart}>
                        <p className={howToStartBlurb}>
                            Next steps, and the resources to start with.
                        </p>
                        {isPreview ? (
                            <Button type="primary" disabled>
                                {HOW_TO_START_TITLE}
                            </Button>
                        ) : (
                            <Link to={howToStartPath}>
                                <Button type="primary">
                                    {HOW_TO_START_TITLE}
                                </Button>
                            </Link>
                        )}
                    </div>
                )}

                {hasPreliminaryFindings && (
                    <div id="preliminary-findings">
                        <SectionLabel section="preliminary-findings" />
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
                    <SectionLabel section="relevant-resources" />
                    {resourcesIntro ? (
                        <CustomReactMarkdown
                            className={sectionIntro}
                            content={resourcesIntro}
                        />
                    ) : (
                        <p className={sectionIntro}>
                            {hasFlagshipResources
                                ? "Other resources from the Allen Institute that may be useful in pursuing this idea."
                                : "Resources from the Allen Institute that may be useful in pursuing this idea."}
                        </p>
                    )}
                    <div className={resourcesIndent}>
                        <MaterialsAndMethodsComponent
                            resources={[...groupedResources]}
                            publication={publication}
                            onExpandDescription={onExpandDescription}
                        />
                    </div>
                </div>

                {hasRelatedIdeas && (
                    <div id="related-ideas">
                        <SectionLabel section="related-ideas" />
                        <ul className={relatedGrid}>
                            {relatedIdeas!.map((idea) => {
                                if (!idea.slug && !idea.title) return null;
                                return (
                                    <li
                                        className={relatedCard}
                                        key={idea.slug || idea.title}
                                    >
                                        {/* Gatsby's Link needs the app runtime
                                            the Decap preview iframe lacks */}
                                        {isPreview ? (
                                            <a href={idea.slug}>{idea.title}</a>
                                        ) : (
                                            <Link to={idea.slug}>
                                                {idea.title}
                                            </Link>
                                        )}
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
    return [
        { key: "title", label: <a href="#title">{fm.title}</a> },
        fm.introduction && {
            key: "introduction",
            label: <a href="#introduction">Introduction</a>,
        },
        // Next steps and flagship resources live on the nested page now
        (fm.nextSteps?.length || fm.flagshipResources?.length) && {
            key: "how-to-start",
            label: (
                <Link to={`${fm.slug}${HOW_TO_START_PATH}/`}>
                    {HOW_TO_START_TITLE}
                </Link>
            ),
        },
        fm.preliminaryFindings && {
            key: "preliminary-findings",
            label: <a href="#preliminary-findings">Preliminary Findings</a>,
        },
        {
            key: "relevant-resources",
            label: <a href="#relevant-resources">Relevant Resources</a>,
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
            maturity
            title
            description
            tags
            program
            accelerator
            scope
            researcherLevel
            type
            layout
            resourcesIntro
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
            flagshipResources {
                ...ResourceFields
            }
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
