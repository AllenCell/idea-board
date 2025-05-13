import React from "react";
import PropTypes from "prop-types";
import { IdeaPostTemplate } from "../../templates/idea-post";

const IdeaPostPreview = ({ entry, widgetFor }) => {
    const tags = entry.getIn(["data", "tags"]);
    return (
        <IdeaPostTemplate
            content={widgetFor("body")}
            description={entry.getIn(["data", "description"])}
            tags={tags && tags.toJS()}
            title={entry.getIn(["data", "title"])}
        />
    );
};

IdeaPostPreview.propTypes = {
    entry: PropTypes.shape({
        getIn: PropTypes.func,
    }),
    widgetFor: PropTypes.func,
};

export default IdeaPostPreview;
