import * as React from "react";
import { Helmet } from "react-helmet-async";

import { withPrefix } from "gatsby";

import useSiteMetadata from "../hooks/useSiteMetadata";

const GlobalHead = () => {
    const { description, title } = useSiteMetadata();
    return (
        <Helmet>
            <html lang="en" />
            <title>{title}</title>
            <meta name="description" content={description} />

            <link
                rel="icon"
                type="image/svg+xml"
                href={`${withPrefix("/")}img/AICS-logo.svg`}
            />

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin=""
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Urbanist:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <meta name="theme-color" content="#fff" />
            <meta property="og:type" content="business.business" />
            <meta property="og:title" content={title} />
            <meta property="og:url" content="/" />
            <meta
                property="og:image"
                content={`${withPrefix("/")}img/og-image.jpg`}
            />
        </Helmet>
    );
};

export default GlobalHead;
