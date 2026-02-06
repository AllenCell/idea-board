import React from "react";
import { Helmet } from "react-helmet-async";
import { graphql, Link, PageProps } from "gatsby";
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
    slug,
    tags,
    title,
    materialsAndMethods,
}) => {

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

    const { title, description } = markdownRemark.frontmatter;

    return (
        <Layout>
            <Helmet titleTemplate="%s | Ideas">
                <title>{title}</title>
                <meta name="description" content={description ?? ""} />
            </Helmet>

            <IdeaPostTemplate {...markdownRemark.frontmatter} {...markdownRemark.fields} />
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
                        type
                        name
                        url
                        file {
                            publicURL
                        }
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
