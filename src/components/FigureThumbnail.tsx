import React from "react";

import { GatsbyImage, IGatsbyImageData, getImage } from "gatsby-plugin-image";

const { imgFill, scale } = require("../style/figure-thumbnail.module.css");

interface FigureThumbnailProps {
    /** Defaults to "" so decorative thumbnails stay out of the a11y tree. */
    alt?: string;
    figure: {
        url?: string | null;
        file?: {
            childImageSharp?: {
                gatsbyImageData: IGatsbyImageData;
            } | null;
        } | null;
    };
    className?: string;
    style?: React.CSSProperties;
}

const FigureThumbnail: React.FC<FigureThumbnailProps> = ({
    alt = "",
    className,
    figure,
    style,
}) => {
    const gatsbyImage = figure.file?.childImageSharp
        ? getImage(figure.file.childImageSharp)
        : null;

    if (gatsbyImage) {
        return (
            <GatsbyImage
                image={gatsbyImage}
                alt={alt}
                className={className}
                imgClassName={scale}
                style={style}
            />
        );
    }

    if (figure.url) {
        return (
            <div className={className} style={style}>
                <img src={figure.url} alt={alt} className={imgFill} />
            </div>
        );
    }

    return null;
};

export default FigureThumbnail;
