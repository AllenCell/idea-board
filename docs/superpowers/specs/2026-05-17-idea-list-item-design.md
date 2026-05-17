# IdeaRoll ListItem Redesign — Design Spec

## Goal

Add visual richness to the IdeaRoll list without sacrificing readability. Each list item gets a colored left-border accent and a matching title color. Author avatars get per-author colors. All using the existing Allen Institute 2025 brand palette.

## Context

The IdeaRoll renders a vertical `antd` List of idea posts. Each item has:
- `List.Item.Meta` with avatar group, title link, and dataset description
- An actions bar with placeholder star/message counts and tag popovers

The list stays vertical. No layout restructuring.

## Color System

**Palette** — four primary brand colors, in order:
1. Allen Blue `#6464FF`
2. Allen Violet `#8246E1`
3. Allen Teal `#00A59B`
4. Allen Maroon `#CD0F55`

**Title / border color** — deterministic hash of the idea's `title` string, mod 4. Same idea always gets the same color regardless of sort order.

**Avatar color** — deterministic hash of the `author` name string, mod 4. Same scientist always gets the same color across all ideas they appear on.

**Hash function** — simple djb2-style sum of char codes, mod palette length. No external dependency.

```ts
function hashColor(str: string, palette: string[]): string {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return palette[h % palette.length];
}
```

## Card Anatomy

```
┌─────────────────────────────────────────────┐
│▐ [Avatar] [Avatar]  Title text here         │  ← 3px left border, border color = title color
│            Dataset: Human Cell Atlas         │
│            ★ 2  ✉ 2  [tag] [tag]            │
└─────────────────────────────────────────────┘
```

- **Left border**: 3px solid, accent color, on each `List.Item`
- **Title link**: accent color (replaces current uniform Allen Blue)
- **Title hover**: Allen Violet (unchanged)
- **Avatars**: brand color from author name hash, white initials (same as current, but color varies)
- **Description, actions, tags**: unchanged
- **Outer list border** (`bordered={true}`): retained for structural framing

## Implementation Approach

Pass the computed accent color as a CSS custom property on each `List.Item`:

```tsx
<List.Item style={{ '--item-color': accentColor } as React.CSSProperties}>
```

CSS references it:

```css
:global(.ant-list-item) {
    border-left: 3px solid var(--item-color);
    padding-left: 20px; /* increase to give breathing room after border */
}

:global(.ant-list-item-meta-title a) {
    color: var(--item-color);
}
```

This avoids needing separate CSS classes per color and keeps color logic in one place (the component).

## Files

| File | Change |
|------|--------|
| `src/components/IdeaRoll.tsx` | Add `hashColor` helper, compute accent color per item and avatar color per author, pass as CSS custom property and avatar style |
| `src/style/idea-roll.module.css` | Add left border and padding rules using `var(--item-color)`; update title color rule |

## What Does Not Change

- List layout (`itemLayout="vertical"`, `bordered={true}`)
- Description text (dataset name)
- Actions bar (star count, message count, tag popovers)
- Tag popover behavior
- Mobile behavior
