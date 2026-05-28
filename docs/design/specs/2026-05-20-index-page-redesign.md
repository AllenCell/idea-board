# Index Page Redesign

**Date:** 2026-05-20
**Status:** Approved

## Goals

1. Make the index page hero background truly full-viewport-width.
2. Align hero text and list content to the same horizontal position.
3. Match the list content max-width to idea-post pages (1200px via `contentWrapper`).
4. Replace the deprecated `antd/List` component with native HTML.
5. Redesign list items in an editorial style — bold typographic, no avatars, no placeholder counts.
6. Introduce a shared CSS token so hero text and list content are guaranteed to stay aligned.

## Layout Structure

The index page will set `fullWidthPage: true` via `useSetLayoutConfig()`. This removes the `max-width: 1200px` cap and side borders from `contentWrapper`, allowing the hero background to bleed edge-to-edge.

Within the now-unconstrained page, both the hero text and the IdeaRoll use the same inner wrapper:

```
max-width: 1200px
margin: 0 auto
padding: 32px var(--content-padding-x)
```

This guarantees horizontal alignment regardless of viewport width.

### Shared token

Add to `src/style/colors.css`:

```css
/* Layout */
--content-padding-x: 48px;
--content-padding-x-sm: 24px;
```

Used in `index-page.module.css` for both `.heroInner` and `.listWrapper`. `--content-padding-x-sm` replaces `--content-padding-x` at `@media (max-width: 768px)`.

### Hero restructure

The `<section className={hero}>` gets a full-width background only. Text moves into a new `<div className={heroInner}>` that provides the constrained, centered inner wrapper.

Before:
```
<section className={hero}>          ← background + max-width + padding
  <p>breadcrumb</p>
  <h1>Idea Board</h1>
  <p>subtitle</p>
</section>
```

After:
```
<section className={hero}>          ← background only, full-width
  <div className={heroInner}>       ← max-width: 1200px, centered, padded
    <p>breadcrumb</p>
    <h1>Idea Board</h1>
    <p>subtitle</p>
  </div>
</section>
```

## IdeaRoll: Editorial Item Design

Replace `antd/List` + `List.Item` + `List.Item.Meta` with a native `<ul>/<li>`.

Each item contains three rows:

1. **Tag eyebrow** — `TagPopover` components inline, restyled as small-caps blue text. Dot separators (`·`) rendered in JSX between tags (never interactive).
2. **Title** — `<a href={slug}>`, large bold dark text, no underline by default.
3. **Byline** — `by [Author · Author] — [Dataset name]` (or `— No public dataset`). Small muted text.

Items separated by a bottom border. No avatars. No star/message counts (removed entirely).

### Tag rendering pattern

```tsx
{item.tags.map((tag, i) => (
  <React.Fragment key={tag}>
    {i > 0 && <span className={tagSeparator}> · </span>}
    <TagPopover tag={tag} currentSlug={item.slug} className={eyebrowTag} />
  </React.Fragment>
))}
```

`TagPopover` receives an `eyebrowTag` className that overrides antd `Tag` default styles. The separator `·` is a plain `<span>` between tags.

### Typography spec

| Element     | Size  | Weight | Color                         | Other                               |
|-------------|-------|--------|-------------------------------|-------------------------------------|
| Tag eyebrow | 10px  | 700    | `var(--primary-color)`        | uppercase, `letter-spacing: 0.15em` |
| Separator · | 10px  | 400    | `var(--border-color)`         | `margin: 0 5px`                     |
| Title       | 19px  | 800    | `var(--text-primary-color)`   | `letter-spacing: -0.02em`, `line-height: 1.25` |
| Byline      | 11px  | 400    | `var(--text-secondary-color)` | —                                   |
| Item border | —     | —      | `var(--border-color)`         | bottom only, `1px solid`            |
| Item padding | —    | —      | —                             | `22px 0` top/bottom                 |

## Files Changed

| File | Change |
|------|--------|
| `src/style/colors.css` | `--content-padding-x` and `--content-padding-x-sm` tokens already exist (no code changes required in this PR) |
| `src/templates/index-page.tsx` | Add `useSetLayoutConfig` + `fullWidthPage: true`; restructure hero with `heroInner` wrapper |
| `src/style/index-page.module.css` | Rewrite `.hero` (bg only), add `.heroInner` (constrained wrapper), update `.listWrapper` to use token |
| `src/components/IdeaRoll.tsx` | Replace `antd/List` with native `<ul>/<li>`; editorial item layout; remove `Avatar`, `StarOutlined`, `MessageOutlined` imports |
| `src/style/idea-roll.module.css` | Replace `.container` antd overrides with editorial styles; add `.listItem`, `.tagEyebrow`, `.eyebrowTag`, `.tagSeparator`, `.title`, `.byline` |

## Out of Scope

- `TagPopover.tsx` — no changes to component logic or popover behavior
- `idea-post.tsx` / `idea-post.module.css` — untouched
- Adding new data fields (date, type, program) to the IdeaRoll query
- Any other pages
