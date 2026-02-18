import React from "react";
import { Collapse } from "antd";
import type { CollapseProps } from "antd";
import ReactMarkdown from "react-markdown";
import { Dataset } from "../types";

interface DatasetResourceProps {
    dataset: Dataset;
}

const TRUNCATE_LENGTH = 200;

const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
        return text;
    }
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0
        ? truncated.slice(0, lastSpace) + "..."
        : truncated + "...";
};

export const DatasetResource: React.FC<DatasetResourceProps> = ({
    dataset,
}) => {
    const { shortDescription, description, name, link } = dataset;

    const hasShort = Boolean(shortDescription?.trim());
    const hasLong = Boolean(description?.trim());

    let displayShort: string | null = null;
    let displayLong: string | null = null;
    let showCollapse = false;

    if (hasShort && hasLong) {
        displayShort = shortDescription!;
        displayLong = description!;
        showCollapse = true;
    } else if (hasLong && !hasShort) {
        const truncated = truncateText(description!, TRUNCATE_LENGTH);
        displayShort = truncated;
        displayLong = description!;
        showCollapse = truncated !== description;
    } else if (hasShort && !hasLong) {
        displayShort = shortDescription!;
    }

    const collapseItems: CollapseProps["items"] = showCollapse
        ? [
              {
                  key: "full-description",
                  label: "Full Description",
                  children: <ReactMarkdown>{displayLong!}</ReactMarkdown>,
              },
          ]
        : [];

    return (
        <div>
            <p>
                <strong>Name:</strong>{" "}
                {link ? (
                    <a href={link} target="_blank" rel="noreferrer">
                        {name}
                    </a>
                ) : (
                    name
                )}
            </p>
            {displayShort && (
                <p>
                    <strong>Description: </strong>
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <span>{children}</span>,
                        }}
                    >
                        {displayShort}
                    </ReactMarkdown>
                </p>
            )}
            {showCollapse && <Collapse items={collapseItems} />}
        </div>
    );
};
