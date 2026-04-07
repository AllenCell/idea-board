import React from "react";

import IdeaRoll from "../../components/IdeaRoll";

export const IdeasIndexTemplate: React.FC = () => {
    return <IdeaRoll />;
};

const IdeasIndexPage: React.FC = () => {
    return <IdeasIndexTemplate />;
};

export default IdeasIndexPage;
