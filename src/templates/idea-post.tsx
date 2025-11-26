import React from "react";
import { Helmet } from "react-helmet-async";
import { graphql, Link } from "gatsby";
import { Layout as AntdLayout, Card, Flex } from "antd";
import {
    ArrowLeftOutlined,
    MessageOutlined,
    StarOutlined,
} from "@ant-design/icons";

import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import IconText from "../components/IconText";
import { IdeaPostNode, MaterialsAndMethods } from "../types";
import { MaterialsAndMethodsComponent } from "../components/MaterialsAndMethods";

const Header = AntdLayout.Header;

const {
    section,
    sectionTitle,
    taglist,
    proposal,
    card,
    actionIcons,
} = require("../style/idea-post.module.css");

interface QueryResult {
    data: {
        markdownRemark: IdeaPostNode;
    };
}

interface IdeaPostTemplateProps {
    content: string;
    contentComponent?: React.FC<{ content: string }> | typeof Content;
    description?: string;
    tags?: string[];
    title: string;
    helmet?: React.ReactNode;
    materialsAndMethods?: MaterialsAndMethods;
}

export const IdeaPostTemplate: React.FC<IdeaPostTemplateProps> = ({
    content,
    contentComponent,
    description,
    tags,
    title,
    helmet,
    materialsAndMethods,
}) => {

    // TODO query the actual data
    const introduction = "PLACEHOLDER INTRODUCTION TEXT";
    const nextSteps = "PLACEHOLDER NEXT STEPS TEXT";

    const getTagList = (tags: string[]) => {
        return (
            <ul className={taglist}>
                {tags.map((tag) => (
                    <li key={tag + `tag`}>
                        <div>{tag} </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            {helmet || ""}
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
                {materialsAndMethods && (
                    <div className={section}>
                        <h2 className={sectionTitle}>
                            Materials and methods available:
                        </h2>
                        <MaterialsAndMethodsComponent
                            materialsAndMethods={materialsAndMethods}
                        />
                    </div>
                )}
                {tags && tags.length ? <div>{getTagList(tags)}</div> : null}
            </Card>
        </div>
    );
};

const IdeaPost = ({ data }: QueryResult) => {
    const { markdownRemark: post } = data;

    return (
        <Layout>
            <IdeaPostTemplate
                content={post.html}
                contentComponent={HTMLContent}
                description={post.frontmatter.description}
                helmet={
                    <Helmet titleTemplate="%s | Ideas">
                        <title>{`${post.frontmatter.title}`}</title>
                        <meta
                            name="description"
                            content={`${post.frontmatter.description}`}
                        />
                    </Helmet>
                }
                tags={post.frontmatter.tags}
                title={post.frontmatter.title}
                materialsAndMethods={post.frontmatter.materialsAndMethods}
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
