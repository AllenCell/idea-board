# Maturity Label Feature Design

**Date:** 2026-06-04 (updated 2026-06-11)
**Branch:** feature/maturity-attribution

## Problem

Scientists are reluctant to share early-stage ideas because they don't want to be held accountable if the idea turns out to be wrong. A maturity label gives authors a way to signal "this is as-is" — framing uncertainty positively rather than as a warning.

## Decision Summary

- 4 fixed levels with evidence-based labels: Speculative, Exploratory, Supported, Validated
- Visual: ALLEN_BLUE opacity ramp pill badge with tooltip hint text (no emoji on rendered badge)
- Two rendering contexts: pill badge in the idea list (after title), plain text with dotted underline in the idea detail metadata strip
- Appears in both the idea list and the idea detail page (metadata strip)
- Required in the CMS for new ideas; existing ideas default to Speculative via a schema resolver

---

## 1. Data Model

### Frontmatter

New optional string field on idea `.md` files. Existing files omit it; the resolver supplies the default.

```yaml
maturity: speculative  # speculative | exploratory | supported | validated
```

### GraphQL Schema (`gatsby/schema/base.gql`)

Added to `IdeaPost` as a nullable `String`:

```graphql
type IdeaPost implements Node {
  ...
  maturity: String
}
```

### Gatsby Resolver (`gatsby/resolvers/resolvers.js`)

Returns `"speculative"` when the frontmatter field is absent:

```js
IdeaPost: {
  maturity: {
    resolve: (source) => source.maturity ?? "speculative"
  }
}
```

This ensures every idea always has a maturity value at query time without touching existing files.

---

## 2. CMS Configuration (`static/admin/config.yml`)

New `select` widget in the `ideas` collection, placed after the `type` field:

```yaml
- label: "Maturity"
  name: "maturity"
  widget: "select"
  required: true
  default: "speculative"
  options:
    - { label: "🌱 Speculative — Untested, shared to invite discussion", value: "speculative" }
    - { label: "🌿 Exploratory — Early investigation, findings are preliminary", value: "exploratory" }
    - { label: "🌳 Supported — Backed by data or analysis, not yet exhaustive", value: "supported" }
    - { label: "🍎 Validated — Well-evidenced and reproducible", value: "validated" }
```

The emoji in the CMS dropdown helps authors scan options visually. The rendered badge on the site uses the ALLEN_BLUE color scale only (no emoji).

---

## 3. `MaturityBadge` Component

**Files:**
- `src/components/MaturityBadge.tsx`
- `src/style/maturity-badge.module.css`

### Level config

| Value         | Label       | Tooltip hint                                                                 |
| ------------- | ----------- | ---------------------------------------------------------------------------- |
| `speculative` | Speculative | Untested: shared to invite discussion and future investigation. Not a claim. |
| `exploratory` | Exploratory | Early investigation — findings are preliminary                               |
| `supported`   | Supported   | Backed by data or analysis, but not yet exhaustive. Needs further work.      |
| `validated`   | Validated   | Well-evidenced and reproducible                                              |

### Visual

Four CSS classes (`.speculative`, `.exploratory`, `.supported`, `.validated`) on a shared pill shape. Colors use `--ALLEN_BLUE` with a `color-mix` opacity ramp — faint at Speculative, full blue at Validated:

| Level       | Text opacity | Border opacity | Background opacity |
|-------------|-------------|----------------|-------------------|
| speculative | 45%         | 25%            | 8%                |
| exploratory | 65%         | 40%            | 12%               |
| supported   | 85%         | 60%            | 16%               |
| validated   | 100%        | 80%            | 20%               |

Tooltip uses Ant Design `<Popover>` component. Unknown values fall back to Speculative rendering.

A `.inlineDotted` class provides the non-pill rendering: `text-decoration: underline dotted`, `cursor: help`, no border or background. Used with the `"inline"` variant (see Props).

### Props

```ts
interface MaturityBadgeProps {
  maturity: string;
  className?: string;
  variant?: "badge" | "inline";  // default: "badge"
}
```

- **`"badge"`** (default): pill rendering using `.badge` + level class. Used in the idea list.
- **`"inline"`**: plain text rendering using `.inlineDotted` + level class (color only, no pill). Used in the post detail metadata strip. The `Popover` wraps both variants.

---

## 4. Rendering Locations

### List view (`src/components/IdeaRoll.tsx`)

- `maturity` is already in the GraphQL query
- Render `<MaturityBadge maturity={item.maturity} />` (default `"badge"` variant) inline after the title `<Link>`, as a sibling element
- `FigureThumbnail` appears on the right side of each list row (88×56px pill shape). Rows without a figure have no reserved gap.
- **Note:** `IdeaRoll.tsx` and `idea-roll.module.css` have unresolved merge conflicts (`UU` git status) from integrating the thumbnail branch. Resolution keeps both the thumbnail and the badge rendering.

### Detail page (`src/templates/idea-post.tsx`)

- `maturity` is already in the `IdeaPostByID` page query
- `<MaturityBadge maturity={maturity} variant="inline" />` renders as colored text with a dotted underline in the `metaGroup` — no pill. The `Popover` hint remains active on hover.

### Type update

`IdeaPostNode` in `src/types/index.ts` is auto-derived from the GraphQL query via `Queries.IdeaPostByIDQuery`. No manual edit is needed — running `gatsby develop` after updating the query regenerates the Gatsby type and `maturity` flows through automatically. The inline `IdeaListItem` type in `IdeaRoll.tsx` similarly picks up the field once the query is updated.

---

## 5. Testing

### `MaturityBadge` unit test

- Each of the four level values renders the correct label and tooltip hint text
- An unknown value falls back gracefully to Speculative rendering

### Resolver unit test

- Returns the field value when `maturity` is present in frontmatter
- Returns `"speculative"` when `maturity` is absent

No changes to existing tests are required — the new field is additive.

---

## Out of Scope

- Allowing authors to update the maturity level of existing ideas in bulk (authors update individually via CMS)
- Filtering or sorting ideas by maturity level on the index page
- Any automated progression of maturity level
- Thumbnail design changes (size, shape, shadow — kept as-is)
