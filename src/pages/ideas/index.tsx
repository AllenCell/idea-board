import React from "react";
import { Layout as AntdLayout, Flex } from "antd";

import Layout from "../../components/Layout";
import IdeaRoll from "../../components/IdeaRoll";

const Header = AntdLayout.Header;

export const IdeasIndexTemplate: React.FC = () => {
    return (
        <div>
            <Header>
                <Flex>
                    <span>Shared ideas</span>
                </Flex>
            </Header>
                <IdeaRoll />
        </div>
    );
};

const IdeasIndexPage: React.FC = () => {
    return (
        <Layout>
            <IdeasIndexTemplate />
        </Layout>
    );
};

export default IdeasIndexPage;
