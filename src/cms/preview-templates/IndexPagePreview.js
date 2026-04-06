import React from "react";

import PropTypes from "prop-types";

const IndexPagePreview = ({ entry, getAsset }) => {
    const data = entry.getIn(["data"]).toJS();
    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <header>
                <span>{data.title || "Browse Ideas"}</span>
            </header>
            {data.image && (
                <img
                    src={getAsset(data.image)}
                    alt=""
                    style={{ maxWidth: "100%" }}
                />
            )}
            <p style={{ padding: "1rem", color: "#888" }}>
                (Idea list is populated from content at build time)
            </p>
        </div>
    );
};

IndexPagePreview.propTypes = {
    entry: PropTypes.shape({ getIn: PropTypes.func }),
    getAsset: PropTypes.func,
};

export default IndexPagePreview;
