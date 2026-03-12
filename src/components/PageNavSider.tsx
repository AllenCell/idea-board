import React, { useEffect, useState } from "react";
import { Layout as AntdLayout, Menu } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";

import { useLayoutContext } from "../LayoutContext";
import { useTabletBreakpoint } from "../hooks/useMaxWidthBreakpoint";

const { sider, siderMenu } = require("../style/sider.module.css");

const AntdSider = AntdLayout.Sider;

export interface PageNavSiderMenuItem {
    key: string;
    label: React.ReactNode;
}

interface PageNavSiderProps {
    items: PageNavSiderMenuItem[];
    title?: string;
}

export const PageNavSider: React.FC<PageNavSiderProps> = ({
    items,
    title = "On This Page",
}) => {
    const isBelowTablet = useTabletBreakpoint();
    const { data: layoutData } = useLayoutContext();
    const [activeKey, setActiveKey] = useState<string>("");

    // Scroll spy: find the last section whose top edge is above the fold
    useEffect(() => {
        if (items.length === 0) return;

        const keys = items.map((item) => item.key);

        const handleScroll = () => {
            for (let i = keys.length - 1; i >= 0; i--) {
                const el = document.getElementById(keys[i]);
                if (el && el.getBoundingClientRect().top <= 90) {
                    setActiveKey(keys[i]);
                    return;
                }
            }
            setActiveKey(keys[0]);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [items]);

    const selectedKey = layoutData.activeNavKey ?? activeKey;

    const handleMenuClick = ({ key }: MenuInfo) => {
        layoutData.onNavItemClick?.(key);
    };

    if (isBelowTablet) {
        return null;
    }

    return (
        <AntdSider className={sider} theme="light">
            <strong style={{ display: "block", padding: "0 16px 8px" }}>
                {title}
            </strong>
            <Menu
                className={siderMenu}
                mode="inline"
                items={items}
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
                style={{ height: "100%", borderRight: 0 }}
            />
        </AntdSider>
    );
};

export default PageNavSider;
