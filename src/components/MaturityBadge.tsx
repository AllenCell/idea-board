import React from "react";

import { Popover } from "antd";

import { getMaturityConfig } from "../constants/maturityLevels";
import * as styles from "../style/maturity-badge.module.css";
import * as popoverStyles from "../style/tag-popover.module.css";

interface MaturityBadgeProps {
    maturity: string;
    className?: string;
}

export const MaturityBadge: React.FC<MaturityBadgeProps> = ({
    className,
    maturity,
}) => {
    const config = getMaturityConfig(maturity);
    const levelClass = styles[maturity] ?? styles.speculative;
    return (
        <Popover title={config.hint} className={popoverStyles.popoverContent}>
            <span
                className={[styles.badge, levelClass, className]
                    .filter(Boolean)
                    .join(" ")}
            >
                {config.label}
            </span>
        </Popover>
    );
};
