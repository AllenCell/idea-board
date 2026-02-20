import * as React from "react";

import { GatsbyImage } from "gatsby-plugin-image";

import { ChildImageSharp } from "../types";

interface PreviewCompatibleImageProps {
    imageInfo: {
        alt?: string;
        childImageSharp?: ChildImageSharp;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image: any; // TODO: Replace `any` with a more specific type if possible
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
    } else if (childImageSharp) {
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
