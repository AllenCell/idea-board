import React from "react";

import { Tooltip } from "antd";

import { getMaturityConfig } from "../constants/maturityLevels";
import * as styles from "../style/maturity-badge.module.css";

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
        <Tooltip title={config.hint}>
            <span
                className={[styles.badge, levelClass, className]
                    .filter(Boolean)
                    .join(" ")}
            >
                {config.label}
            </span>
        </Tooltip>
    );
};
