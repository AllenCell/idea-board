# Proposal Callout Box — Color Update Design

**Date:** 2026-05-29
**Status:** Approved

## Problem

The proposal callout box (`.proposal` in `idea-post.module.css`) uses `--accent-color` (→ `--ALLEN_GREEN` `#CDEB05`) as its background. The lime green is too bright and reduces readability. It also depletes the accent color's visual impact by using it as a large filled background rather than a sparse highlight.

## Decision

Replace the lime green background with a muted warm-gray fill and an orange left border, using tokens already defined in the design system.

### Color choices explored

- `--ALLEN_ORANGE` (`#FF6E00`) and `--ALLEN_ROSE` (`#FF00FF`) were evaluated as alternatives to `--ALLEN_GREEN`
- Orange was preferred: warmer, readable, distinctive without competing with the blue primary
- Orange is kept **exclusively on the proposal callout** — not extended to tags, links, or hero text — so it functions as a semantic signal for actionable/proposal content rather than a general accent

### Callout style chosen

- **Background:** `--PAGE_2` (`#DED9D1`) — warm gray, slightly darker than the page background, clearly delineated without a filled accent color
- **Border:** 4px solid `--ALLEN_ORANGE` (`#FF6E00`) left border only — provides the color energy at the edge without flooding the reading area

A variant with fading gradient lines on the top and bottom was also considered but rejected in favor of the simpler solid-left-border approach.

## Changes

### `src/style/colors.css`

Update `--callout-box-border-color` (currently pointing to `--GRAY_1`) to point to `--ALLEN_ORANGE`:

```css
--callout-box-border-color: var(--ALLEN_ORANGE);
```

### `src/style/idea-post.module.css`

Wire `.proposal` to the callout tokens instead of hardcoding accent and dark colors:

```css
.proposal {
    background: var(--callout-box-bg-color);              /* was: var(--accent-color) */
    border-left: 4px solid var(--callout-box-border-color); /* was: 4px solid var(--bg-dark-color) */
    padding: 14px 18px;
    margin: 6px 0;
}
```

## What does not change

- `--accent-color` remains `--ALLEN_GREEN` and continues to be used in the hero subtitle and nav hover states
- `--primary-color` (`--ALLEN_BLUE`) is unchanged on all tags, links, author names, and the post header background
- No new tokens are added — only `--callout-box-border-color` is redirected

## Token inventory after change

| Token | Value | Used by |
|---|---|---|
| `--callout-box-bg-color` | `var(--PAGE_2)` → `#DED9D1` | `.proposal` background |
| `--callout-box-border-color` | `var(--ALLEN_ORANGE)` → `#FF6E00` | `.proposal` left border |
| `--accent-color` | `var(--ALLEN_GREEN)` → `#CDEB05` | Hero subtitle, nav hover, header sublabel |
| `--primary-color` | `var(--ALLEN_BLUE)` → `#6464FF` | Tags, links, post header, idea titles |
