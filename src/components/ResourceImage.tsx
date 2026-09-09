import React from "react";

import { GatsbyImage, IGatsbyImageData, getImage } from "gatsby-plugin-image";

interface ResourceImageProps {
    alt?: string;
    className?: string;
    imageFile?: {
        childImageSharp?: { gatsbyImageData: IGatsbyImageData } | null;
    } | null;
    imageUrl?: string | null;
}

// Unlike FigureThumbnail this doesn't crop or zoom — the picture is the content.
const ResourceImage: React.FC<ResourceImageProps> = ({
    alt = "",
    className,
    imageFile,
    imageUrl,
}) => {
    const gatsbyImage = imageFile?.childImageSharp
        ? getImage(imageFile.childImageSharp)
        : null;

    if (gatsbyImage) {
        return (
            <GatsbyImage image={gatsbyImage} alt={alt} className={className} />
        );
    }
    if (imageUrl) {
        return <img src={imageUrl} alt={alt} className={className} />;
    }
    return null;
};

export default ResourceImage;
