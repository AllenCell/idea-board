import React from "react";

import { ConfigProvider } from "antd";

import Layout from "./src/components/Layout";
import theme from "./src/style/theme";

export const wrapRootElement = ({ element }) => (
    <ConfigProvider theme={theme}>{element}</ConfigProvider>
);

export const wrapPageElement = ({ element }) => <Layout>{element}</Layout>;
