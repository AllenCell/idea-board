import React from "react";

import { GatsbyImage, getImage } from "gatsby-plugin-image";

import { Card } from "antd";

import { Figure } from "../types";

interface FigureProps {
    figure: Figure;
}

import * as styles from "../style/figure.module.css";
const { caption, container, image } = styles;

const FigureComponent: React.FC<FigureProps> = ({ figure }) => {
    if (!figure.url && !figure.file) {
        return null;
    }

    if (figure.url) {
        return (
            <Card className={container}>
                <img
                    className={image}
                    src={figure.url}
                    alt={figure.caption || "Figure"}
                    style={{ marginBottom: "1rem" }}
                />
                <div className={caption}>{figure.caption}</div>
            </Card>
        );
    }

    const imageForGatsby = getImage(figure.file!.childImageSharp! ?? null);
    if (!imageForGatsby) return null;
    return (
        <Card className={container}>
            <GatsbyImage
                image={imageForGatsby}
                alt={figure.caption || `Preliminary finding figure`}
                style={{
                    marginBottom: "1rem",
                }}
            />
            <div className={caption}>{figure.caption}</div>
        </Card>
    );
};

export default FigureComponent;
