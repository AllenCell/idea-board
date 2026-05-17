# Theme Refresh + New Logo — Design Spec

**Date:** 2026-05-16
**Status:** Approved

## Problem

The site design reads as plain — neutral colors, minimal visual hierarchy, no brand energy. The 2025 Allen Institute brand guidelines call for bold use of color and the forward-slash motif, but the implementation uses mostly warm off-whites. The header also uses text-only logotype instead of the official SVG logo.

## Decisions Made

| Question            | Decision                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Design direction    | A — Black header, Allen Blue homepage hero                                                                 |
| Logo                | New SVG (`AI_medium_black.svg`) inverted white in header                                                   |
| Hero location       | Homepage only                                                                                              |
| Hero breadcrumb     | `allen institute / cell science / open ideas/`                                                             |
| Hero title          | `Idea Board`                                                                                               |
| Hero subtitle color | Allen Green `#CDEB05` for contrast on blue background                                                      |
| Hero subtitle copy  | "A living collection of early-stage ideas, proposals, and open questions from Allen Institute scientists." |

---

## Design Specification

### 1. Header (`AppHeader.tsx` + `header.module.css`)

**Logo:** Replace `<span>{title}/</span>` with the new `AI_medium_black.svg` rendered as an `<img>` tag.
- Apply `filter: brightness(0) invert(1)` via CSS to render it white on the black background.
- Height: `28px`, width: `auto` (preserves aspect ratio — logo is ~3.5:1).
- Wrap in the existing `homeLink` anchor so it still navigates to `/`.

**Sub-label:** Add `"idea board/"` as a `<span>` next to the logo inside the link.
- Color: `var(--ALLEN_GREEN)` (`#CDEB05`)
- Font: `var(--font-body)`, 13px, weight 500
- Separated from logo by a `1px solid rgba(255,255,255,0.25)` left border with `padding-left: 8px`
- Hide below tablet breakpoint (≤744px) to avoid overflow.

**Remove:** The `title` prop default `"Idea Board"` is no longer rendered as text in the header.

---

### 2. Homepage Hero (`index-page.tsx` + `index-page.module.css`)

Add a `.hero` section above `.listWrapper` inside the `pageBackground` div.

**Visual:**
- Background: `var(--ALLEN_BLUE)` (`#6464FF`)
- Max-width: `1728px`, centered, matching `.list-wrapper` width
- Padding: `32px 96px` desktop, `24px 24px` mobile

**Content (top to bottom):**

```
breadcrumb   allen institute / cell science / open ideas/
title        Idea Board (working title)
subtitle     A living collection of early-stage ideas, proposals,
             and open questions from Allen Institute scientists.
```

**Typography:**
| Element    | Font                             | Size                       | Weight | Color                            |
| ---------- | -------------------------------- | -------------------------- | ------ | -------------------------------- |
| Breadcrumb | `var(--font-body)`               | 11px                       | 500    | `rgba(255,255,255,0.7)`          |
| Title      | `var(--font-display)` (Urbanist) | 40px desktop / 28px mobile | 800    | `#FFFFFF`                        |
| Subtitle   | `var(--font-body)`               | 16px                       | 400    | `var(--ALLEN_GREEN)` (`#CDEB05`) |

**Forward-slash motif:** The breadcrumb uses ` / ` as literal separators, consistent with brand guidelines.

---

### 3. New Logo Asset

Copy `AI_medium_black.svg` from `~/Downloads/` into `static/img/AI_medium_black.svg`. This makes it available at `/img/AI_medium_black.svg` in the Gatsby build.

---

## Files to Change

| File                              | Change                                                               |
| --------------------------------- | -------------------------------------------------------------------- |
| `static/img/AI_medium_black.svg`  | **New file** — copy from Downloads                                   |
| `src/components/AppHeader.tsx`    | Replace text logotype with SVG `<img>` + green sub-label             |
| `src/style/header.module.css`     | Add `.logoImg` (filter + height) and `.subLabel` styles              |
| `src/templates/index-page.tsx`    | Add `.hero` section above `.listWrapper`                             |
| `src/style/index-page.module.css` | Add `.hero`, `.heroBreadcrumb`, `.heroTitle`, `.heroSubtitle` styles |

## Out of Scope

- Idea post page hero (decided: homepage only for now)
- Custom Allen Institute font (not licensed/available)
- List item card redesign (not discussed — keep existing Ant Design bordered list)

## Verification

1. `npm run develop`
2. Homepage: new logo visible in header (white), blue hero with breadcrumb + green subtitle below
3. Idea post page: no hero section — unchanged
4. Mobile (≤744px): logo fills header cleanly, sub-label hidden, hero text wraps correctly
5. No console errors for missing logo asset
