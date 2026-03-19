import * as React from "react";

import { Layout as AntLayout } from "antd";

import GlobalHead from "./GlobalHead";
import "../style/index.css";

const { Content } = AntLayout;

import * as styles from "../style/layout.module.css";
const { container } = styles;

const Layout = ({ children }: React.PropsWithChildren) => (
    <AntLayout className={container}>
        <GlobalHead />
        <Content>{children}</Content>
    </AntLayout>
);

export default Layout;
