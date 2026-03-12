import React from "react";
import { Layout as AntLayout } from "antd";

const { footer, footerContent, footerCopyright } = require("../style/footer.module.css");

const AntdFooter = AntLayout.Footer;

export const AppFooter: React.FC = () => {
    return (
        <AntdFooter className={footer}>
            <div className={footerContent}>
                <div className={footerCopyright}>
                    © {new Date().getFullYear()} Allen Institute for Cell Science
                </div>
            </div>
        </AntdFooter>
    );
};

export default AppFooter;
