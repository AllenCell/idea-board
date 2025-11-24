import React from "react";
import { Helmet } from "react-helmet-async";
import { graphql, Link } from "gatsby";
import { Layout as AntdLayout, Card, Collapse, Flex, Space } from "antd";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import FullWidthImage from "../components/FullWidthImage";
import { IdeaPostNode, MaterialsAndMethods } from "../types";
import { MaterialsAndMethodsComponent } from "../components/MaterialsAndMethods";
import { TagPopover } from "../components/TagPopover";
import { CommentsPopover } from "../components/CommentsPopover";
import { ArrowLeftOutlined, LeftCircleOutlined, StarOutlined } from "@ant-design/icons";

// const { header } = require("../style/index-page.module.css");
const {
    container,
    backButton,
    section,
    sectionTitle,
    subsectionTitle,
    tagsSection,
    taglist,
    proposal,
    card,
    buttonContainer,
    buttonText,
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
    date?: string;
    description?: string;
    tags?: string[];
    authors?: string[];
    program?: string;
    type?: string;
    concerns?: string;
    introduction?: string;
    materialsAndMethods?: MaterialsAndMethods;
    nextSteps?: string[];
    title: string;
    helmet?: React.ReactNode;
}

export const IdeaPostTemplate: React.FC<IdeaPostTemplateProps> = ({
    content,
    contentComponent,
    date,
    description,
    tags,
    authors,
    program,
    type,
    concerns,
    introduction,
    materialsAndMethods,
    nextSteps,
    title,
    helmet,
}) => {
    // not rendering:
    // author, publish date, program, type, concerns, PostContent (what is that?)
    const PostContent = contentComponent || Content;

    const getTagList = (tags: string[]) => {
        return (
            <>
            {/* <div> Explore related proposals: </div> */}
            <ul className={taglist}>
                {tags.map((tag) => (
                    <li key={tag + `tag`}>
                        <TagPopover tag={tag} />
                    </li>
                ))}
            </ul>
            
            </>
        );
    };

    const getNextStepsContent = (nextSteps: string[]) => {
        if (nextSteps.length === 1) {
            return <p>{nextSteps[0]}</p>;
        } else {
            return (
                <ul>
                    {nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ul>
            );
        }
    };

    //TODO dry this out, its duplciated from IdeaRoll
    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    return (
        <AntdLayout className={container}>
            {helmet || ""}
            <AntdLayout.Header>
                <Flex className={buttonContainer}>
                    <Link className={backButton} to="/">
                        <ArrowLeftOutlined />
                        <span className={buttonText}> All proposals </span>
                    </Link>
                </Flex>
            </AntdLayout.Header>
            <AntdLayout.Content>
                <Card className={card}>
                    {introduction && (
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
                                        key="list-vertical-star-o"
                                    />
                                    <CommentsPopover
                                        postTitle={title}
                                        commentCount={2}
                                    />
                                </Flex>
                            </Flex>

                            <p className={proposal}>{introduction}</p>
                        </div>
                    )}
                    {nextSteps && (
                        <div className={section}>
                            <h2 className={sectionTitle}>
                                Suggested next steps:
                            </h2>
                            {getNextStepsContent(nextSteps)}
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
                    {tags && tags.length ? (
                        <div>
                            {getTagList(tags)}
                        </div>
                    ) : null}

                    {/* Body content */}
                    {/* <div className={section}>
                            <h2 className={sectionTitle}>Details</h2>
                            <PostContent content={content} />
                        </div> */}
                </Card>
            </AntdLayout.Content>
        </AntdLayout>
    );
};

const IdeaPost: React.FC<QueryResult> = ({ data }) => {
    const { markdownRemark: post } = data;
    const fm = post.frontmatter;

    return (
        <Layout>
        <IdeaPostTemplate
            content={post.html}
            contentComponent={HTMLContent}
            date={fm.date}
            description={fm.description}
            tags={fm.tags}
            authors={fm.authors}
            program={fm.program}
            type={fm.type}
            concerns={fm.concerns}
            introduction={fm.introduction}
            materialsAndMethods={fm.materialsAndMethods}
            nextSteps={fm.nextSteps}
            title={fm.title}
            helmet={
                <Helmet titleTemplate="%s | Ideas">
                    <title>{fm.title}</title>
                    <meta name="description" content={fm.description || ""} />
                </Helmet>
            }
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
                authors
                program
                type
                concerns
                introduction
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
                            name
                            instructions
                            link
                        }
                    }
                }
                nextSteps
            }
        }
    }
`;
