import React, { useRef, useState } from "react";

import { GatsbyImage, getImage, getSrc } from "gatsby-plugin-image";

import {
    LeftOutlined,
    RightOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
} from "@ant-design/icons";
import { Button, Carousel, Image, Space } from "antd";
import type { CarouselRef } from "antd/es/carousel";

import { Figure } from "../types";

const {
    galleryCaption,
    galleryContainer,
    gallerySlide,
    galleryTrack,
    navButton,
    navButtonLeft,
    navButtonRight,
    slideCounter,
} = require("../style/figure.module.css");

interface FigureGalleryProps {
    figures: readonly Figure[];
}

const FigureGallery: React.FC<FigureGalleryProps> = ({ figures }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<CarouselRef>(null);

    const showNav = figures.length > 1;

    const getPreviewSrc = (figure: Figure): string | undefined => {
        if (figure.url) return figure.url;
        if (figure.file?.childImageSharp) {
            return getSrc(figure.file.childImageSharp.gatsbyImageData);
        }
        return undefined;
    };

    const handlePrev = () => {
        carouselRef.current?.prev();
    };

    const handleNext = () => {
        carouselRef.current?.next();
    };

    return (
        <div id="gallery" className={galleryContainer}>
            {/* Hidden images for full-screen preview */}
            <Image.PreviewGroup
                preview={{
                    visible: previewVisible,
                    current: currentIndex,
                    onVisibleChange: (visible) => setPreviewVisible(visible),
                    onChange: (index) => {
                        setCurrentIndex(index);
                        carouselRef.current?.goTo(index, true);
                    },
                    toolbarRender: (
                        _,
                        {
                            actions: { onZoomIn, onZoomOut },
                            transform: { scale },
                        },
                    ) => (
                        <Space>
                            <ZoomOutOutlined
                                disabled={scale <= 1}
                                onClick={onZoomOut}
                            />
                            <ZoomInOutlined
                                disabled={scale >= 10}
                                onClick={onZoomIn}
                            />
                        </Space>
                    ),
                }}
            >
                {figures.map((figure, i) => {
                    const src = getPreviewSrc(figure);
                    if (!src) return null;
                    return (
                        <Image
                            key={`preview-${i}`}
                            src={src}
                            style={{ display: "none" }}
                        />
                    );
                })}
            </Image.PreviewGroup>

            {/* Carousel */}
            <div className={galleryTrack}>
                <Carousel
                    ref={carouselRef}
                    dots={false}
                    afterChange={(index) => setCurrentIndex(index)}
                    swipeToSlide
                    infinite={false}
                >
                    {figures.map((figure, index) => {
                        const gatsbyImage = figure.file?.childImageSharp
                            ? getImage(figure.file.childImageSharp)
                            : null;

                        if (!gatsbyImage && !figure.url) return null;

                        return (
                            <div key={index}>
                                <div
                                    className={gallerySlide}
                                    onClick={() => {
                                        setCurrentIndex(index);
                                        setPreviewVisible(true);
                                    }}
                                >
                                    {gatsbyImage ? (
                                        <GatsbyImage
                                            image={gatsbyImage}
                                            alt={
                                                figure.caption ||
                                                `Figure ${index + 1}`
                                            }
                                            imgStyle={{ objectFit: "contain" }}
                                        />
                                    ) : (
                                        <img
                                            src={figure.url!}
                                            alt={
                                                figure.caption ||
                                                `Figure ${index + 1}`
                                            }
                                        />
                                    )}
                                </div>
                                {figure.caption && (
                                    <p className={galleryCaption}>
                                        {figure.caption}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </Carousel>

                {showNav && (
                    <>
                        <Button
                            className={`${navButton} ${navButtonLeft}`}
                            shape="circle"
                            icon={<LeftOutlined />}
                            onClick={handlePrev}
                        />
                        <Button
                            className={`${navButton} ${navButtonRight}`}
                            shape="circle"
                            icon={<RightOutlined />}
                            onClick={handleNext}
                        />
                    </>
                )}
            </div>

            {showNav && (
                <p className={slideCounter}>
                    {currentIndex + 1} / {figures.length}
                </p>
            )}
        </div>
    );
};

export default FigureGallery;
