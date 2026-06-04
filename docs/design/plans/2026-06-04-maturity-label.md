# Maturity Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `maturity` field to ideas that renders as a light-to-dark teal pill badge (with tooltip) in both the idea list eyebrow row and the idea detail metadata strip.

**Architecture:** New `maturity` frontmatter field on idea `.md` files, exposed in GraphQL via a resolver that defaults to `"speculative"` for existing ideas. A shared `MaturityBadge` component reads from a `maturityLevels` constants file and renders an Ant Design `Tooltip`-wrapped pill. Both `IdeaRoll` and `idea-post` template wire in the badge.

**Tech Stack:** Gatsby 5, React 18, TypeScript, Ant Design v5, Vitest, Decap CMS, CSS Modules

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/constants/maturityLevels.ts` | MATURITY_CONFIG record + getMaturityConfig pure function |
| Create | `src/constants/maturityLevels.test.ts` | Unit tests for MATURITY_CONFIG and getMaturityConfig |
| Create | `src/components/MaturityBadge.tsx` | Pill badge + Ant Design Tooltip wrapper |
| Create | `src/style/maturity-badge.module.css` | Teal light-to-dark color scale |
| Create | `gatsby/resolvers/test/resolvers.test.js` | Resolver default test |
| Modify | `gatsby/resolvers/resolvers.js` | Add maturity field to createIdeaPostResolver |
| Modify | `gatsby/schema/base.gql` | Add `maturity: String` to IdeaPost type |
| Modify | `static/admin/config.yml` | Add maturity select widget after type field |
| Modify | `src/components/IdeaRoll.tsx` | Add maturity to query; render MaturityBadge in tagEyebrow |
| Modify | `src/templates/idea-post.tsx` | Add maturity to query; render MaturityBadge in metaStrip |

---

## Task 1: Add maturity resolver (TDD)

**Files:**
- Create: `gatsby/resolvers/test/resolvers.test.js`
- Modify: `gatsby/resolvers/resolvers.js`

- [ ] **Step 1.1: Write the failing test**

Create `gatsby/resolvers/test/resolvers.test.js`:

```js
import { describe, expect, it } from "vitest";
import { createIdeaPostResolver } from "../resolvers";

const mockReporter = { error: () => {} };

describe("createIdeaPostResolver - maturity", () => {
    const resolver = createIdeaPostResolver(mockReporter);

    it("returns the maturity value when present", () => {
        expect(resolver.maturity.resolve({ maturity: "speculative" })).toBe("speculative");
        expect(resolver.maturity.resolve({ maturity: "exploratory" })).toBe("exploratory");
        expect(resolver.maturity.resolve({ maturity: "supported" })).toBe("supported");
        expect(resolver.maturity.resolve({ maturity: "validated" })).toBe("validated");
    });

    it("returns 'speculative' when maturity is absent", () => {
        expect(resolver.maturity.resolve({})).toBe("speculative");
        expect(resolver.maturity.resolve({ maturity: null })).toBe("speculative");
        expect(resolver.maturity.resolve({ maturity: undefined })).toBe("speculative");
    });
});
```

- [ ] **Step 1.2: Run test to verify it fails**

```bash
yarn test --reporter=verbose
```

Expected: FAIL with `Cannot read properties of undefined (reading 'resolve')` — `resolver.maturity` doesn't exist yet.

- [ ] **Step 1.3: Add maturity resolver**

In `gatsby/resolvers/resolvers.js`, add the `maturity` entry to the object returned by `createIdeaPostResolver`, after `preliminaryFindings`:

```js
maturity: {
    resolve: (source) => source.maturity ?? "speculative",
},
```

The full function should end with:

```js
    preliminaryFindings: {
        resolve: (source) => {
            const raw = source.preliminaryFindings;
            if (!raw || typeof raw !== "object") {
                return { summary: "", figures: [] };
            }
            return {
                summary: stringWithDefault(raw.summary, ""),
                figures: resolveToArray(raw.figures),
            };
        },
    },
    maturity: {
        resolve: (source) => source.maturity ?? "speculative",
    },
});
```

- [ ] **Step 1.4: Run test to verify it passes**

```bash
yarn test --reporter=verbose
```

Expected: PASS — 2 tests pass in `gatsby/resolvers/test/resolvers.test.js`

- [ ] **Step 1.5: Commit**

```bash
git add gatsby/resolvers/resolvers.js gatsby/resolvers/test/resolvers.test.js
git commit -m "feat: add maturity resolver with speculative default"
```

---

## Task 2: Update GraphQL schema

**Files:**
- Modify: `gatsby/schema/base.gql`

- [ ] **Step 2.1: Add maturity field to IdeaPost**

In `gatsby/schema/base.gql`, add `maturity: String` to `IdeaPost`, in alphabetical order between `introduction` and `nextSteps`:

```graphql
type IdeaPost implements Node {
    authors: [Allenite!]!
    date: Date @dateformat
    description: String
    draft: Boolean
    introduction: String
    maturity: String
    nextSteps: String
    preliminaryFindings: PreliminaryFindings
    primaryContact: Allenite
    program: [String!]!
    publication: String
    relatedIdeas: [IdeaPost!]!
    resources: [Resource!]!
    slug: String!
    tags: [String!]!
    title: String!
    type: String
}
```

- [ ] **Step 2.2: Regenerate Gatsby types**

```bash
yarn develop
```

Wait until the terminal shows `You can now view idea-board in the browser`, then stop with `Ctrl+C`. This writes updated generated types to `.cache/` so TypeScript knows about `maturity` in `Queries.IdeaPostByIDQuery` and `Queries.IdeaRollQuery`.

- [ ] **Step 2.3: Commit**

```bash
git add gatsby/schema/base.gql
git commit -m "feat: add maturity field to IdeaPost GraphQL schema"
```

---

## Task 3: Update CMS config

**Files:**
- Modify: `static/admin/config.yml`

- [ ] **Step 3.1: Add maturity widget after the type widget**

In `static/admin/config.yml`, locate the `type` widget block in the `ideas` collection (starts with `label: "Type"`). Insert the `maturity` widget immediately after its closing `},`:

```yaml
          - {
                label: "Maturity",
                name: "maturity",
                widget: "select",
                required: true,
                default: "speculative",
                options:
                    [
                        {
                            label: "🌱 Speculative — Untested, shared to invite discussion",
                            value: "speculative",
                        },
                        {
                            label: "🌿 Exploratory — Early investigation, findings are preliminary",
                            value: "exploratory",
                        },
                        {
                            label: "🌳 Supported — Backed by data or analysis, not yet exhaustive",
                            value: "supported",
                        },
                        {
                            label: "🍎 Validated — Well-evidenced and reproducible",
                            value: "validated",
                        },
                    ],
            }
```

- [ ] **Step 3.2: Commit**

```bash
git add static/admin/config.yml
git commit -m "feat: add maturity select field to CMS config"
```

---

## Task 4: Create maturityLevels constants (TDD)

**Files:**
- Create: `src/constants/maturityLevels.ts`
- Create: `src/constants/maturityLevels.test.ts`

- [ ] **Step 4.1: Write the failing test**

Create `src/constants/maturityLevels.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getMaturityConfig } from "./maturityLevels";

describe("getMaturityConfig", () => {
    it("returns the correct label for each level", () => {
        expect(getMaturityConfig("speculative").label).toBe("Speculative");
        expect(getMaturityConfig("exploratory").label).toBe("Exploratory");
        expect(getMaturityConfig("supported").label).toBe("Supported");
        expect(getMaturityConfig("validated").label).toBe("Validated");
    });

    it("returns the correct hint for each level", () => {
        expect(getMaturityConfig("speculative").hint).toBe(
            "Untested — shared to invite discussion, not as a claim",
        );
        expect(getMaturityConfig("exploratory").hint).toBe(
            "Early investigation — findings are preliminary",
        );
        expect(getMaturityConfig("supported").hint).toBe(
            "Backed by data or analysis, but not yet exhaustive",
        );
        expect(getMaturityConfig("validated").hint).toBe(
            "Well-evidenced and reproducible",
        );
    });

    it("falls back to Speculative for unknown values", () => {
        expect(getMaturityConfig("unknown").label).toBe("Speculative");
        expect(getMaturityConfig("").label).toBe("Speculative");
    });
});
```

- [ ] **Step 4.2: Run test to verify it fails**

```bash
yarn test --reporter=verbose
```

Expected: FAIL — `Failed to resolve import "./maturityLevels"`

- [ ] **Step 4.3: Create maturityLevels.ts**

Create `src/constants/maturityLevels.ts`:

```ts
interface MaturityConfig {
    label: string;
    hint: string;
}

export const MATURITY_CONFIG: Record<string, MaturityConfig> = {
    speculative: {
        label: "Speculative",
        hint: "Untested — shared to invite discussion, not as a claim",
    },
    exploratory: {
        label: "Exploratory",
        hint: "Early investigation — findings are preliminary",
    },
    supported: {
        label: "Supported",
        hint: "Backed by data or analysis, but not yet exhaustive",
    },
    validated: {
        label: "Validated",
        hint: "Well-evidenced and reproducible",
    },
};

export function getMaturityConfig(maturity: string): MaturityConfig {
    return MATURITY_CONFIG[maturity] ?? MATURITY_CONFIG.speculative;
}
```

- [ ] **Step 4.4: Run test to verify it passes**

```bash
yarn test --reporter=verbose
```

Expected: PASS — 3 tests pass in `src/constants/maturityLevels.test.ts`

- [ ] **Step 4.5: Commit**

```bash
git add src/constants/maturityLevels.ts src/constants/maturityLevels.test.ts
git commit -m "feat: add maturity level config and getMaturityConfig utility"
```

---

## Task 5: Create MaturityBadge component

**Files:**
- Create: `src/style/maturity-badge.module.css`
- Create: `src/components/MaturityBadge.tsx`

- [ ] **Step 5.1: Create CSS module**

Create `src/style/maturity-badge.module.css`:

```css
.badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.78em;
    font-weight: 600;
    cursor: default;
    white-space: nowrap;
}

.speculative {
    background: #e6f4f4;
    color: #4a9090;
    border: 1px solid #b8dede;
}

.exploratory {
    background: #b8dede;
    color: #2a7070;
    border: 1px solid #7dbaba;
}

.supported {
    background: #2a7070;
    color: #fff;
}

.validated {
    background: #0d3d3d;
    color: #fff;
}
```

- [ ] **Step 5.2: Create component**

Create `src/components/MaturityBadge.tsx`:

```tsx
import React from "react";

import { Tooltip } from "antd";

import { getMaturityConfig } from "../constants/maturityLevels";

const styles = require("../style/maturity-badge.module.css");

interface MaturityBadgeProps {
    maturity: string;
    className?: string;
}

export const MaturityBadge: React.FC<MaturityBadgeProps> = ({
    maturity,
    className,
}) => {
    const config = getMaturityConfig(maturity);
    const levelClass = styles[maturity] ?? styles.speculative;
    return (
        <Tooltip title={config.hint}>
            <span
                className={[styles.badge, levelClass, className]
                    .filter(Boolean)
                    .join(" ")}
            >
                {config.label}
            </span>
        </Tooltip>
    );
};
```

- [ ] **Step 5.3: Run typecheck**

```bash
yarn typeCheck
```

Expected: no errors

- [ ] **Step 5.4: Commit**

```bash
git add src/components/MaturityBadge.tsx src/style/maturity-badge.module.css
git commit -m "feat: add MaturityBadge component"
```

---

## Task 6: Wire up IdeaRoll

**Files:**
- Modify: `src/components/IdeaRoll.tsx`

- [ ] **Step 6.1: Add MaturityBadge import**

Add to the imports at the top of `src/components/IdeaRoll.tsx`, after the `TagPopover` import:

```tsx
import { MaturityBadge } from "./MaturityBadge";
```

- [ ] **Step 6.2: Add maturity to GraphQL query**

In the `useStaticQuery` call, add `maturity` to the node fields:

```graphql
query IdeaRoll {
    allIdeaPost(sort: { date: DESC }, filter: { draft: { ne: true } }) {
        nodes {
            id
            slug
            title
            tags
            maturity
            authors {
                name
            }
            resources {
                type
                name
            }
        }
    }
}
```

- [ ] **Step 6.3: Update tagEyebrow render**

The current code wraps the eyebrow div in `{item.tags.length > 0 && ...}`, which hides it for tagless ideas. Since maturity always renders, remove that condition so the eyebrow div always shows. Replace the entire tags block:

```tsx
<div className={tagEyebrow}>
    {item.tags.map((tag, i) => (
        <React.Fragment key={tag}>
            {i > 0 && (
                <span
                    className={tagSeparator}
                    aria-hidden="true"
                >
                    ·
                </span>
            )}
            <TagPopover
                tag={tag}
                currentSlug={item.slug}
                className={eyebrowTag}
            />
        </React.Fragment>
    ))}
    <MaturityBadge maturity={item.maturity ?? "speculative"} />
</div>
```

- [ ] **Step 6.4: Run typecheck**

```bash
yarn typeCheck
```

Expected: no errors. If TypeScript complains that `maturity` doesn't exist on the node type, Gatsby types weren't regenerated yet — run `yarn develop` (Task 2, Step 2.2) first.

- [ ] **Step 6.5: Commit**

```bash
git add src/components/IdeaRoll.tsx
git commit -m "feat: show maturity badge in idea list"
```

---

## Task 7: Wire up idea-post template

**Files:**
- Modify: `src/templates/idea-post.tsx`

- [ ] **Step 7.1: Add MaturityBadge import**

Add to the imports in `src/templates/idea-post.tsx`:

```tsx
import { MaturityBadge } from "../components/MaturityBadge";
```

- [ ] **Step 7.2: Add maturity to destructured props**

In the `IdeaPostTemplate` component signature, add `maturity` to the destructured props (alphabetically between `introduction` and `nextSteps`):

```tsx
export const IdeaPostTemplate: React.FC<
    IdeaPostNode & {
        onExpandDescription?: (
            content: string,
            label: string,
            sectionKey: string,
        ) => void;
    }
> = ({
    authors,
    date,
    introduction,
    maturity,
    nextSteps,
    onExpandDescription,
    preliminaryFindings,
    primaryContact,
    program,
    publication,
    relatedIdeas,
    resources,
    slug,
    tags,
    title,
    type,
}) => {
```

- [ ] **Step 7.3: Render MaturityBadge in metaStrip**

In the `metaStrip` div, add a new `metaGroup` after the existing `type` block:

```tsx
{type && (
    <div className={metaGroup}>
        <span className={metaKey}>Type</span>
        <span className={metaVal}>{type}</span>
    </div>
)}
{maturity && (
    <div className={metaGroup}>
        <span className={metaKey}>Maturity</span>
        <MaturityBadge maturity={maturity} />
    </div>
)}
```

- [ ] **Step 7.4: Add maturity to page query**

In the `pageQuery` at the bottom of `src/templates/idea-post.tsx`, add `maturity` to the `ideaPost` fields (alphabetically between `introduction` and `title`):

```graphql
query IdeaPostByID($id: String!) {
    ideaPost(id: { eq: $id }) {
        slug
        authors {
            name
            contactId
        }
        primaryContact {
            name
            contactId
        }
        publication
        date(formatString: "MMMM DD, YYYY")
        introduction
        maturity
        title
        description
        tags
        program
        type
        preliminaryFindings {
            summary
            figures {
                type
                url
                file {
                    childImageSharp {
                        gatsbyImageData(width: 600, quality: 90)
                    }
                }
                caption
            }
        }
        nextSteps
        resources {
            ...ResourceFields
        }
        relatedIdeas {
            title
            slug
        }
    }
}
```

- [ ] **Step 7.5: Run typecheck**

```bash
yarn typeCheck
```

Expected: no errors

- [ ] **Step 7.6: Commit**

```bash
git add src/templates/idea-post.tsx
git commit -m "feat: show maturity badge in idea detail metadata strip"
```

---

## Task 8: End-to-end verification

- [ ] **Step 8.1: Run dev server**

```bash
yarn develop
```

- [ ] **Step 8.2: Check idea list at http://localhost:8000**

Verify:
- Every idea in the list shows a teal maturity badge in the eyebrow row
- Ideas without `maturity` in their frontmatter show a light teal "Speculative" badge
- Ideas with tags still show tags alongside the badge
- Ideas with no tags show only the maturity badge (eyebrow row is no longer hidden)
- Hovering over any badge shows the tooltip hint text

- [ ] **Step 8.3: Check an idea detail page**

Click into any idea and verify:
- The metadata strip shows a "Maturity" row with a teal badge
- The badge color matches the level (light = Speculative, dark = Validated)
- Hovering shows the correct tooltip hint

- [ ] **Step 8.4: Run full test suite**

```bash
yarn test
```

Expected: all tests pass, including the 2 new resolver tests and 3 new maturityLevels tests
