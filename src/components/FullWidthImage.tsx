import React from "react";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";

interface FullWidthImageProps {
    img: IGatsbyImageData | string | null;
    title?: string;
    height?: number;
    subheading?: string;
    imgPosition?: string;
}

const FullWidthImage: React.FC<FullWidthImageProps> = ({
    img,
    title,
    height = 200,
    subheading,
    imgPosition = "top left",
}) => {
    return (
        <React.Fragment>
            <div
                className="margin-top-0"
                style={{
                    display: "grid",
                    alignItems: "center",
                }}
            >
                {typeof img === "string" ? (
                    <img
                        src={img}
                        style={{
                            gridArea: "1/1",
                            objectFit: "cover",
                            objectPosition: imgPosition,
                            height: height,
                            width: "100%",
                        }}
                        alt=""
                    />
                ) : (
                    <GatsbyImage
                        image={img as IGatsbyImageData}
                        objectFit="cover"
                        objectPosition={imgPosition}
                        style={{
                            gridArea: "1/1",
                            maxHeight: height,
                        }}
                        alt=""
                    />
                )}
                {(title || subheading) && (
                    <div
                        style={{
                            gridArea: "1/1",
                            position: "relative",
                            placeItems: "center",
                            display: "grid",
                        }}
                    >
                        {title && (
                            <h1
                                className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen"
                                style={{
                                    boxShadow:
                                        "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
                                    backgroundColor: "rgb(255, 68, 0)",
                                    color: "white",
                                    lineHeight: "1",
                                    padding: "0.25em",
                                }}
                            >
                                {title}
                            </h1>
                        )}
                        {subheading && (
                            <h3
                                className="has-text-weight-bold is-size-5-mobile is-size-5-tablet is-size-4-widescreen"
                                style={{
                                    boxShadow:
                                        "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
                                    backgroundColor: "rgb(255, 68, 0)",
                                    color: "white",
                                    lineHeight: "1",
                                    padding: "0.25rem",
                                    marginTop: "0.5rem",
                                }}
                            >
                                {subheading}
                            </h3>
                        )}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default FullWidthImage;
