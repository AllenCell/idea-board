import * as React from "react";

import { Script } from "gatsby";

import { Layout as AntLayout } from "antd";

import { LayoutContextProvider, useLayoutContext } from "../LayoutContext";
import "../style/index.css";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./Footer";
import GlobalHead from "./GlobalHead";
import { PageNavSider } from "./PageNavSider";

const { Content } = AntLayout;

const { container, contentWrapper } = require("../style/layout.module.css");

const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data } = useLayoutContext();

    return (
        <>
            <AntLayout className={container}>
                <GlobalHead />
                <AppHeader
                    pageNavItems={data.PageNavSiderItems}
                    pageNavTitle={data.PageNavSiderTitle}
                    showHamburger={data.showHamburger}
                />
                <AntLayout className={contentWrapper}>
                    {data.showPageNavSider &&
                        data.PageNavSiderItems.length > 0 && (
                            <PageNavSider
                                items={data.PageNavSiderItems}
                                title={data.PageNavSiderTitle}
                            />
                        )}
                    <Content>{children}</Content>
                </AntLayout>
                <AppFooter />
            </AntLayout>
            <Script type="text/javascript" src="/iframeResizer.js" />
        </>
    );
};

const TemplateWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <LayoutContextProvider>
        <LayoutShell>{children}</LayoutShell>
    </LayoutContextProvider>
);

export default TemplateWrapper;
