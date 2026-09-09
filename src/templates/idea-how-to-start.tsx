import React, { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { useSetLayoutConfig } from "../LayoutContext";
import { CustomReactMarkdown } from "../components/CustomReactMarkdown";
import ExpandedDescriptionView from "../components/ExpandableDescriptionView";
import { FlagshipResources } from "../components/FlagshipResources";
import { PageNavSiderMenuItem } from "../components/PageNavSider";
import { SectionLabel } from "../components/SectionLabel";
import { HOW_TO_START_TITLE } from "../constants/sectionQuestions";
import { useExpandedContent } from "../hooks/useExpandedContent";
import { IdeaHowToStartNode, IdeaHowToStartQuery } from "../types";

const {
    backBar,
    container,
    eyebrow,
    flagshipSection,
    postHeader,
    postTitle,
    proposal,
    sectionText,
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
    flagshipResources,
    isPreview,
    nextSteps,
    onExpandDescription,
    program,
    slug,
    title,
}) => {
    const hasFlagshipResources =
        flagshipResources && flagshipResources.length > 0;

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

                {nextSteps && (
                    <div id="proposal">
                        <SectionLabel section="proposal" />
                        <div className={proposal}>
                            <CustomReactMarkdown
                                className={sectionText}
                                content={nextSteps}
                            />
                        </div>
                    </div>
                )}

                {hasFlagshipResources && (
                    <div id="flagship-resources" className={flagshipSection}>
                        <SectionLabel section="flagship-resources" />
                        <FlagshipResources
                            resources={flagshipResources}
                            onExpandDescription={onExpandDescription}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

function buildNavItems(fm: IdeaHowToStartNode): PageNavSiderMenuItem[] {
    return [
        { key: "title", label: <a href="#title">{HOW_TO_START_TITLE}</a> },
        fm.nextSteps?.length && {
            key: "proposal",
            label: <a href="#proposal">{HOW_TO_START_TITLE}</a>,
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
            nextSteps
            flagshipResources {
                ...ResourceFields
            }
        }
    }
`;
