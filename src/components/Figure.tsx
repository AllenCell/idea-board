import React from "react";
import { Card } from "antd";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import { Figure } from "../types";

interface FigureProps {
    figure: Figure;
}

const { caption, container, image } = require("../style/figure.module.css");

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
