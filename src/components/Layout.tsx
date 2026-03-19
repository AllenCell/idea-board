import * as React from "react";

import { Layout as AntLayout } from "antd";

import "../style/index.css";
import * as styles from "../style/layout.module.css";
import GlobalHead from "./GlobalHead";

const { Content } = AntLayout;

const { container } = styles;

const Layout = ({ children }: React.PropsWithChildren) => (
    <AntLayout className={container}>
        <GlobalHead />
        <Content>{children}</Content>
    </AntLayout>
);

export default Layout;
