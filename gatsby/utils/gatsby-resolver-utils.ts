import slugify from "slugify";

import { SOFTWARE_PATH } from "../constants";

interface RawSoftwareItem {
    softwareTool?: string;
    customDescription?: string;
}

interface ResolvedSoftwareTool {
    softwareTool: string | null;
    customDescription: string | null;
}

function stringWithDefault<T>(rawValue: unknown, fallback: T): string | T {
    if (typeof rawValue !== "string") return fallback;
    if (rawValue.trim() === "") return fallback;
    return rawValue;
}

function resolveToArray(value: unknown): unknown[] {
    if (Array.isArray(value)) {
        return value;
    }
    return [];
}

const resolveSoftwareTools = (rawSoftware: unknown): ResolvedSoftwareTool[] => {
    if (!Array.isArray(rawSoftware)) {
        return [];
    }
    return rawSoftware
        .map((item: unknown) => {
            if (
                item &&
                typeof item === "object" &&
                "softwareTool" in item &&
                (item as RawSoftwareItem).softwareTool
            ) {
                const raw = item as RawSoftwareItem;
                return {
                    softwareTool: resolveSlug(raw.softwareTool!, SOFTWARE_PATH),
                    customDescription: stringWithDefault(
                        raw.customDescription,
                        null,
                    ),
                };
            }
            return null;
        })
        .filter((item): item is ResolvedSoftwareTool => item !== null);
};

const resolveSlug = (
    id: string | null | undefined,
    directory: string,
): string | null => {
    if (!id) return null;
    const slugPart = slugify(id, { lower: true, strict: true }).replace(
        /^\/+|\/+$/g,
        "",
    );
    return `/${directory}/${slugPart}/`;
};

export { stringWithDefault, resolveToArray, resolveSlug, resolveSoftwareTools };
