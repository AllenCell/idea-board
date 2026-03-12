export const truncateAtWord = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "\u2026";
};

export const scrollToKeyAfterRender = (key: string) => {
    setTimeout(() => {
        document.getElementById(key)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
};