import React from "react";

import { Link } from "gatsby";

import { MenuOutlined } from "@ant-design/icons";
import { Layout as AntdLayout, Button, Dropdown, Flex } from "antd";

import { useLayoutContext } from "../LayoutContext";
import { useTabletBreakpoint } from "../hooks/useMaxWidthBreakpoint";
import { PageNavSiderMenuItem } from "./PageNavSider";

const {
    header,
    headerContent,
    headerLeft,
    headerRight,
    homeLink,
    navLink,
} = require("../style/header.module.css");

const AntdHeader = AntdLayout.Header;

interface AppHeaderProps {
    title?: string;
    showHamburger?: boolean;
    pageNavItems?: PageNavSiderMenuItem[];
    pageNavTitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    pageNavItems = [],
    pageNavTitle = "On This Page",
    showHamburger,
    title = "Idea Board",
}) => {
    const isBelowTablet = useTabletBreakpoint();
    const { data: layoutData } = useLayoutContext();

    const hasPageNav = pageNavItems.length > 0;
    const showMenu = showHamburger || (isBelowTablet && hasPageNav);

    const menuItems = hasPageNav
        ? [
              {
                  key: "page-nav-title",
                  label: <strong>{pageNavTitle}</strong>,
                  disabled: true,
              },
              ...pageNavItems,
          ]
        : [];

    return (
        <AntdHeader className={header}>
            <Flex
                className={headerContent}
                gap={8}
                align="center"
                justify="space-between"
            >
                <Flex className={headerLeft} gap={8} align="center">
                    {showMenu && (
                        <Dropdown
                            menu={{
                                items: menuItems,
                                onClick: ({ key }) =>
                                    layoutData.onNavItemClick?.(key),
                            }}
                            trigger={["click"]}
                        >
                            <Button
                                style={{ color: "white" }}
                                type="text"
                                icon={<MenuOutlined />}
                            />
                        </Dropdown>
                    )}
                    <Link className={homeLink} to="/">
                        <span>{title}</span>
                    </Link>
                </Flex>
                <div className={headerRight}>
                    <Link className={navLink} to="/about">
                        <span>About</span>
                    </Link>
                </div>
            </Flex>
        </AntdHeader>
    );
};

export default AppHeader;
