import React from "react";

import PropTypes from "prop-types";

import { AboutPageTemplate } from "../../templates/about-page";

const AboutPagePreview = ({ entry, getAsset }) => {
    const data = entry.getIn(["data"]).toJS();
    if (!data) return <div>Loading...</div>;

    return (
        <AboutPageTemplate
            title={data.title || ""}
            bannerImage={
                data.bannerImage ? getAsset(data.bannerImage) : undefined
            }
            intro={data.intro || { title: "", paragraphs: [] }}
            audience={data.audience || { title: "", items: [] }}
            contentTypes={data.contentTypes || { title: "", items: [] }}
            howToUse={data.howToUse || { title: "", steps: [] }}
            cta={data.cta || { title: "", buttonText: "" }}
        />
    );
};

AboutPagePreview.propTypes = {
    entry: PropTypes.shape({ getIn: PropTypes.func }),
    getAsset: PropTypes.func,
};

export default AboutPagePreview;
