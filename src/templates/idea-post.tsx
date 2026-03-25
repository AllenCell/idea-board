import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Layout as AntdLayout, Button, Card, Flex } from "antd";

import { ContactModal } from "../components/ContactModal";
import { CustomReactMarkdown } from "../components/CustomReactMarkdown";
import FigureComponent from "../components/Figure";
import { MaterialsAndMethodsComponent } from "../components/MaterialsAndMethods";
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
    nextSteps,
    preliminaryFindings,
    primaryContact,
    publication,
    resources,
    slug,
    tags,
    title,
}) => {
    const [contactModalOpen, setContactModalOpen] = useState(false);

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
                            <ContactModal
                                open={contactModalOpen}
                                title={title}
                                authors={authors}
                                primaryContact={primaryContact}
                                onClose={() => setContactModalOpen(false)}
                            />
                            <Button onClick={() => setContactModalOpen(true)}>
                                Contact
                            </Button>
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
                <MaterialsAndMethodsComponent resources={[...resources]} />
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
                primaryContact
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
            }
        }
    }
`;
