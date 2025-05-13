import * as React from "react";
import { GatsbyImage } from "gatsby-plugin-image";

interface PreviewCompatibleImageProps {
    imageInfo: {
        alt?: string;
        childImageSharp?: any;
        image: any;
        width?: number;
        height?: number;
    };
    imageStyle?: React.CSSProperties;
}

const PreviewCompatibleImage = ({
    imageInfo,
    imageStyle,
}: PreviewCompatibleImageProps) => {
    const { alt = "", childImageSharp, image } = imageInfo;
    if (!!image && !!image.childImageSharp) {
        return (
            <GatsbyImage
                image={image.childImageSharp.gatsbyImageData}
                style={imageStyle}
                alt={alt}
            />
        );
    } else if (!!childImageSharp) {
        return (
            <GatsbyImage
                image={childImageSharp.gatsbyImageData}
                style={imageStyle}
                alt={alt}
            />
        );
        // for Netlify CMS
    } else if (image) {
        return <img style={imageStyle} src={image} alt={alt} />;
    } else {
        return null;
    }
};

export default PreviewCompatibleImage;
