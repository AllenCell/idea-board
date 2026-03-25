/**
 * Decap CMS uses Immutable.js internally. Values arrive as Immutable Maps on
 * initial load (parsed from frontmatter) and as plain JS objects after edits
 * (emitted by widget onChange). These utilities normalise both shapes so
 * widgets and preview components don't need to handle the distinction themselves.
 */

/** Minimal structural interface matching an Immutable.js Map as used by Decap CMS. */
export interface ImmutableLike<T = Record<string, unknown>> {
    get: (key: string) => unknown;
    toJS: () => T;
}

/**
 * Converts an Immutable.js Map to a plain JS object, or passes through a
 * value that's already a plain object. Returns `null` when given
 * nothing usable (null / undefined / non-object primitives).
 */
export function fromImmutable<T extends object>(raw: unknown): T | null {
    if (!raw || typeof raw !== "object") return null;
    if (typeof (raw as ImmutableLike).toJS === "function") {
        return (raw as ImmutableLike<T>).toJS();
    }
    return raw as T;
}
