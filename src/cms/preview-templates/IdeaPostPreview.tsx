import React from "react";

import { IdeaPostTemplate } from "../../templates/idea-post";
import { IdeaPostNode } from "../../types";
import { ImmutableLike, fromImmutable } from "../utils/immutable";

interface PreviewProps {
    entry?: ImmutableLike;
}

const previewBannerStyle: React.CSSProperties = {
    padding: "8px 12px",
    marginBottom: "12px",
    backgroundColor: "#fff8e1",
    border: "1px solid #ffe082",
    borderRadius: "4px",
    fontSize: "16px",
    color: "#6d4c00",
};

const placeholderStyle: React.CSSProperties = {
    border: "1.5px dashed #ffe082",
    borderRadius: "4px",
    padding: "16px 20px",
    backgroundColor: "#fffdf5",
    color: "#6d4c00",
    fontSize: "14px",
    lineHeight: 1.6,
};

const ResourcePlaceholder: React.FC = () => (
    <div className="idea-post-section">
        <h4 className="idea-post-section-title">Datasets</h4>
        <div style={placeholderStyle}>
            <p style={{ fontWeight: 600, marginBottom: "4px" }}>
                Example Resource Name
            </p>
            <p style={{ margin: 0 }}>
                Resource details cannot be previewed — they are loaded from
                related entries at build time. The published page will display
                full resource cards with descriptions and links.
            </p>
        </div>
    </div>
);

const IdeaPostPreview: React.FC<PreviewProps> = ({ entry }) => {
    const raw = entry?.get("data");
    const data = fromImmutable<IdeaPostNode>(raw) ?? ({} as IdeaPostNode);

    return (
        <div>
            <div style={previewBannerStyle}>
                Preview approximation — because of the way this site it built,
                it's hard to preview the entire context of the way the idea will
                sit in the layout, and we can't access relational data (like the
                relevant resources). So this preview is an overal look of the
                initial proposal, title, etc.
            </div>
            <IdeaPostTemplate
                title={data.title}
                authors={data.authors}
                introduction={data.introduction}
                tags={[]}
                nextSteps={data.nextSteps}
                publication={data.publication}
                preliminaryFindings={data.preliminaryFindings}
                slug={data.slug ?? ""}
                date={data.date ?? null}
                description={data.description ?? null}
                resources={[]}
                relatedIdeas={[]}
            />
            <div className="idea-post">
                <ResourcePlaceholder />
            </div>
        </div>
    );
};

export default IdeaPostPreview;
