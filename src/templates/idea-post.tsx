import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

import { Link, PageProps, graphql } from "gatsby";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Layout as AntdLayout, Button, Card, Flex } from "antd";

import { ContactModal } from "../components/ContactModal";
import Layout from "../components/Layout";
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
    materialsAndMethods,
    primaryContact,
    slug,
    tags,
    title,
}) => {
    const [contactModalOpen, setContactModalOpen] = useState(false);

    // TODO query the actual data
    const introduction = "PLACEHOLDER INTRODUCTION TEXT";
    const nextSteps = "PLACEHOLDER NEXT STEPS TEXT";

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

                    <p className={proposal}>{introduction}</p>
                </div>
                {nextSteps && (
                    <div className={section}>
                        <h2 className={sectionTitle}>Suggested next steps:</h2>
                        {nextSteps}
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

    const { description, title } = markdownRemark.frontmatter;

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
                date(formatString: "MMMM DD, YYYY")
                title
                description
                authors
                primaryContact
                tags
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
