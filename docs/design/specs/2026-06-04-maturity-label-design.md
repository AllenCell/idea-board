# Maturity Label Feature Design

**Date:** 2026-06-04
**Branch:** feature/maturity-attribution

## Problem

Scientists are reluctant to share early-stage ideas because they don't want to be held accountable if the idea turns out to be wrong. A maturity label gives authors a way to signal "this is as-is" — framing uncertainty positively rather than as a warning.

## Decision Summary

- 4 fixed levels with evidence-based labels: Speculative, Exploratory, Supported, Validated
- Visual: light-to-dark teal pill badge with tooltip hint text (no emoji on rendered badge)
- Appears in both the idea list (eyebrow row) and the idea detail page (metadata strip)
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

The emoji in the CMS dropdown helps authors scan options visually. The rendered badge on the site uses the teal color scale only (no emoji).

---

## 3. `MaturityBadge` Component

**Files:**
- `src/components/MaturityBadge.tsx`
- `src/components/MaturityBadge.module.css`

### Level config

| Value         | Label       | Tooltip hint                                                                 |
| ------------- | ----------- | ---------------------------------------------------------------------------- |
| `speculative` | Speculative | Untested: shared to invite discussion and future investigation. Not a claim. |
| `exploratory` | Exploratory | Early investigation — findings are preliminary                               |
| `supported`   | Supported   | Backed by data or analysis, but not yet exhaustive. Needs further work.      |
| `validated`   | Validated   | Well-evidenced and reproducible                                              |

### Visual

Four CSS classes (`.speculative`, `.exploratory`, `.supported`, `.validated`) on a shared pill shape. Colors progress from light to dark teal
Tooltip uses Ant Design `<Tooltip>` component. Unknown values fall back to Speculative rendering.

### Props

```ts
interface MaturityBadgeProps {
  maturity: string;
  className?: string;
}
```

---

## 4. Rendering Locations

### List view (`src/components/IdeaRoll.tsx`)

- Add `maturity` to the `IdeaRoll` GraphQL query
- Render `<MaturityBadge maturity={item.maturity} />` in the existing `tagEyebrow` row alongside topic tags

### Detail page (`src/templates/idea-post.tsx`)

- Add `maturity` to the `IdeaPostByID` page query
- Render `<MaturityBadge>` as a new `metaGroup` in the `metaStrip` alongside Authors / Date / Type / Program

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
