import * as React from "react";

import { Layout as AntLayout } from "antd";

import GlobalHead from "./GlobalHead";
import "../style/index.css";

const { Content } = AntLayout;

const { container } = require("../style/layout.module.css");

const Layout = ({ children }: React.PropsWithChildren) => (
    <AntLayout className={container}>
        <GlobalHead />
        <Content>{children}</Content>
    </AntLayout>
);

export default Layout;
