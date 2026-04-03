import React from "react";

export const NameWithLink = ({
    link,
    name,
}: {
    name: string | null | undefined;
    link: string | null | undefined;
}) => {
    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer">
                {name}
            </a>
        );
    }
    return <>{name}</>;
};
