import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { useSetLayoutConfig } from "../LayoutContext";
import { ContactModal } from "../components/ContactModal";
import ExpandedDescriptionView from "../components/ExpandableDescriptionView";
import { FlagshipResources } from "../components/FlagshipResources";
import { NextSteps } from "../components/NextSteps";
import { PageNavSiderMenuItem } from "../components/PageNavSider";
import { SectionLabel } from "../components/SectionLabel";
import { HOW_TO_START_TITLE } from "../constants/sectionQuestions";
import { useExpandedContent } from "../hooks/useExpandedContent";
import { IdeaHowToStartNode, IdeaHowToStartQuery } from "../types";

const {
    backBar,
    contactCta,
    contactCtaBlurb,
    container,
    eyebrow,
    flagshipSection,
    postHeader,
    postTitle,
    proposal,
} = require("../style/idea-post.module.css");

export type IdeaHowToStartTemplateProps = IdeaHowToStartNode & {
    isPreview?: boolean;
    onExpandDescription?: (
        content: string,
        label: string,
        sectionKey: string,
    ) => void;
};

export const IdeaHowToStartTemplate: React.FC<IdeaHowToStartTemplateProps> = ({
    authors,
    flagshipResources,
    isPreview,
    nextSteps,
    onExpandDescription,
    primaryContact,
    program,
    resourceNotes,
    slug,
    title,
}) => {
    const hasFlagshipResources =
        flagshipResources && flagshipResources.length > 0;
    const hasNextSteps = nextSteps && nextSteps.length > 0;
    const [contactModalOpen, setContactModalOpen] = useState(false);

    const relevanceBySlug = new Map<string, string>();
    (resourceNotes ?? []).forEach((note) => {
        if (note?.resource?.slug && note.relevance) {
            relevanceBySlug.set(note.resource.slug, note.relevance);
        }
    });

    return (
        <>
            <div className={postHeader}>
                <div className={eyebrow}>
                    allen institute / ideas
                    {program && program.length > 0
                        ? ` / ${program.join(" / ")} /`
                        : " /"}
                </div>
                <h1 id="title" className={postTitle}>
                    {HOW_TO_START_TITLE}
                </h1>
            </div>

            <div className={container}>
                {/* Gatsby's Link needs the app runtime the preview iframe lacks */}
                {!isPreview && (
                    <div className={backBar}>
                        <Link to={slug}>
                            <Button icon={<ArrowLeftOutlined />}>
                                Back to {title}
                            </Button>
                        </Link>
                    </div>
                )}

                <div className={contactCta}>
                    <p className={contactCtaBlurb}>
                        Interested, or not sure where this fits? The authors are
                        happy to hear from you.
                    </p>
                    <Button
                        type="primary"
                        size="large"
                        disabled={isPreview}
                        onClick={() => setContactModalOpen(true)}
                    >
                        Contact the authors of this idea
                    </Button>
                </div>

                {hasNextSteps && (
                    <div id="next-steps">
                        <SectionLabel section="next-steps" />
                        <div className={proposal}>
                            <NextSteps steps={nextSteps} />
                        </div>
                    </div>
                )}

                {hasFlagshipResources && (
                    <div id="flagship-resources" className={flagshipSection}>
                        <SectionLabel section="flagship-resources" />
                        <FlagshipResources
                            resources={flagshipResources}
                            relevanceBySlug={relevanceBySlug}
                            onExpandDescription={onExpandDescription}
                        />
                    </div>
                )}
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
        </>
    );
};

function buildNavItems(fm: IdeaHowToStartNode): PageNavSiderMenuItem[] {
    return [
        { key: "title", label: <a href="#title">{HOW_TO_START_TITLE}</a> },
        fm.nextSteps?.length && {
            key: "next-steps",
            label: <a href="#next-steps">{HOW_TO_START_TITLE}</a>,
        },
        fm.flagshipResources?.length && {
            key: "flagship-resources",
            label: <a href="#flagship-resources">Flagship Resources</a>,
        },
    ].filter(Boolean) as PageNavSiderMenuItem[];
}

const IdeaHowToStart: React.FC<PageProps<IdeaHowToStartQuery>> = ({ data }) => {
    const setLayout = useSetLayoutConfig();
    const ideaPost = data.ideaPost;
    const { expandedContent, handleBack, handleExpand, handleNavItemClick } =
        useExpandedContent();

    const PageNavSiderItems = useMemo(
        () => (ideaPost ? buildNavItems(ideaPost) : []),
        [ideaPost],
    );

    useEffect(() => {
        if (!ideaPost) return;
        setLayout({ showPageNavSider: true, PageNavSiderItems });
        return () => {
            setLayout({ showPageNavSider: false, PageNavSiderItems: [] });
        };
    }, [ideaPost, PageNavSiderItems, setLayout]);

    useEffect(() => {
        setLayout({
            onNavItemClick: expandedContent ? handleNavItemClick : null,
            activeNavKey: expandedContent ? expandedContent.sectionKey : null,
        });
    }, [expandedContent, handleNavItemClick, setLayout]);

    if (!ideaPost) {
        return <p>Post not found.</p>;
    }

    return (
        <>
            <Helmet titleTemplate="%s | Ideas">
                <title>{`${HOW_TO_START_TITLE} — ${ideaPost.title}`}</title>
            </Helmet>
            {expandedContent ? (
                <ExpandedDescriptionView
                    content={expandedContent.content}
                    label={expandedContent.label}
                    onBack={handleBack}
                />
            ) : (
                <IdeaHowToStartTemplate
                    {...ideaPost}
                    onExpandDescription={handleExpand}
                />
            )}
        </>
    );
};

export default IdeaHowToStart;

export const pageQuery = graphql`
    query IdeaHowToStart($id: String!) {
        ideaPost(id: { eq: $id }) {
            slug
            title
            program
            authors {
                name
                contactId
            }
            primaryContact {
                name
                contactId
            }
            nextSteps {
                text
                note
                resource {
                    ...ResourceFields
                }
            }
            flagshipResources {
                ...ResourceFields
            }
            resourceNotes {
                relevance
                resource {
                    slug
                }
            }
        }
    }
`;
