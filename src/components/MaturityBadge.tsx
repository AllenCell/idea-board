import React from "react";

import { Popover } from "antd";

import { getMaturityConfig } from "../constants/maturityLevels";
import * as styles from "../style/maturity-badge.module.css";
import * as popoverStyles from "../style/tag-popover.module.css";

interface MaturityBadgeProps {
    maturity: string;
    className?: string;
    variant?: "badge" | "inline";
}

export const MaturityBadge: React.FC<MaturityBadgeProps> = ({
    className,
    maturity,
    variant = "badge",
}) => {
    const config = getMaturityConfig(maturity);
    const levelClass = styles[maturity] ?? styles.speculative;
    const baseClass = variant === "inline" ? styles.inlineDotted : styles.badge;
    return (
        <Popover title={config.hint} className={popoverStyles.popoverContent}>
            <span
                className={[baseClass, levelClass, className]
                    .filter(Boolean)
                    .join(" ")}
            >
                {config.label}
            </span>
        </Popover>
    );
};
