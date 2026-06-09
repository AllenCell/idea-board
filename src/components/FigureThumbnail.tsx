import React from "react";

import { GatsbyImage, IGatsbyImageData, getImage } from "gatsby-plugin-image";

const { imgFill, scale } = require("../style/figure-thumbnail.module.css");

interface FigureThumbnailProps {
    figure: {
        url?: string | null;
        file?: {
            childImageSharp?: {
                gatsbyImageData: IGatsbyImageData;
            } | null;
        } | null;
    };
    className?: string;
}

const FigureThumbnail: React.FC<FigureThumbnailProps> = ({
    className,
    figure,
}) => {
    const gatsbyImage = figure.file?.childImageSharp
        ? getImage(figure.file.childImageSharp)
        : null;

    if (gatsbyImage) {
        return (
            <GatsbyImage
                image={gatsbyImage}
                alt=""
                className={className}
                imgClassName={scale}
            />
        );
    }

    if (figure.url) {
        return (
            <div className={className}>
                <img src={figure.url} alt="" className={imgFill} />
            </div>
        );
    }

    return null;
};

export default FigureThumbnail;
