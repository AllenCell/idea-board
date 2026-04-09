import { useCallback, useState } from "react";

import { scrollToKeyAfterRender } from "../utils/utils";

interface ExpandedContent {
    content: string;
    label: string;
    sectionKey: string;
}

export interface UseExpandedContentReturn {
    expandedContent: ExpandedContent | null;
    handleBack: () => void;
    handleExpand: (content: string, label: string, sectionKey: string) => void;
    handleNavItemClick: (key: string) => void;
}

export function useExpandedContent(): UseExpandedContentReturn {
    const [expandedContent, setExpandedContent] =
        useState<ExpandedContent | null>(null);

    const handleExpand = useCallback(
        (content: string, label: string, sectionKey: string) => {
            setExpandedContent({ content, label, sectionKey });
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [],
    );

    const handleBack = useCallback(() => {
        const sectionKey = expandedContent?.sectionKey;
        setExpandedContent(null);
        if (sectionKey) scrollToKeyAfterRender(sectionKey);
    }, [expandedContent?.sectionKey]);

    const handleNavItemClick = useCallback((key: string) => {
        setExpandedContent(null);
        scrollToKeyAfterRender(key);
    }, []);

    return { expandedContent, handleBack, handleExpand, handleNavItemClick };
}
