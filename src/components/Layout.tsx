import * as React from "react";

import { Layout as AntLayout } from "antd";

import "../style/index.css";
import GlobalHead from "./GlobalHead";

const { Content } = AntLayout;

const { container } = require("../style/layout.module.css");

const Layout = ({ children }: React.PropsWithChildren) => (
    <AntLayout className={container}>
        <GlobalHead />
        <Content>{children}</Content>
    </AntLayout>
);

export default Layout;
