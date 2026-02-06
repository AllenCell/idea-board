import React from "react";
import { Card } from "antd";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import { Figure } from "../types";

interface FigureProps {
    figure: Figure;
    index?: number
    key?: number;
}

const {
    caption,
    container,
} = require("../style/figure.module.css");

const FigureComponent: React.FC<FigureProps> = ({ figure, key }) => {
    const { figure: image } = figure;

    const imageForGatsby = getImage(image!.childImageSharp);
    if (!imageForGatsby) return null;
    return (
        <Card className={container}>
            <GatsbyImage
                image={imageForGatsby}
                alt={`Preliminary finding figure ${key}`}
                style={{
                    marginBottom: "1rem",
                }}
            />
            <div className={caption}>{figure.caption}</div>
        </Card>
    );
};

export default FigureComponent;
