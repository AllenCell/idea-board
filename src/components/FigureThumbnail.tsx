import React from "react";

import { GatsbyImage, IGatsbyImageData, getImage } from "gatsby-plugin-image";

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

const scaleStyle: React.CSSProperties = {
    transform: "scale(1.2)",
    transformOrigin: "center",
};

const imgFillStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
    ...scaleStyle,
};

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
                imgStyle={scaleStyle}
            />
        );
    }

    if (figure.url) {
        return (
            <div className={className}>
                <img src={figure.url} alt="" style={imgFillStyle} />
            </div>
        );
    }

    return null;
};

export default FigureThumbnail;
