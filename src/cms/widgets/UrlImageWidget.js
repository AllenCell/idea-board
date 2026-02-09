import React from "react";

// Custom widget for URL-only image input with preview
export const UrlImageControl = ({ value, onChange, forID, classNameWrapper }) => {
    return React.createElement(
        "div",
        { className: classNameWrapper },
        React.createElement("input", {
            id: forID,
            type: "text",
            value: value || "",
            onChange: (e) => onChange(e.target.value),
            placeholder: "https://example.com/image.png",
            style: { width: "100%" },
        }),
        value &&
            React.createElement("img", {
                src: value,
                alt: "Preview",
                style: { display: "block", marginTop: "12px", maxWidth: "100%", maxHeight: "200px" },
            })
    );
};

export const UrlImagePreview = ({ value }) =>
    value ? React.createElement("img", { src: value, alt: "Preview" }) : null;
