# Theme Refresh + New Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the text logotype in the header with the new Allen Institute SVG logo and add a bold Allen Blue hero section to the homepage.

**Architecture:** Three independent areas of change — asset copy, header component, homepage template. No shared state or cross-task dependencies beyond the asset being present before the header references it.

**Tech Stack:** Gatsby (static site), React, TypeScript, Ant Design 5, CSS Modules

---

## File Map

| File                              | Role                                                            |
| --------------------------------- | --------------------------------------------------------------- |
| `static/img/AI_medium_black.svg`  | New logo asset — served at `/img/AI_medium_black.svg` by Gatsby |
| `src/components/AppHeader.tsx`    | Header component — swap text logotype for `<img>` + sub-label   |
| `src/style/header.module.css`     | Header styles — add `.logoImg` and `.subLabel`                  |
| `src/templates/index-page.tsx`    | Homepage template — add hero section above list                 |
| `src/style/index-page.module.css` | Homepage styles — add hero CSS classes                          |

---

## Task 1: Copy Logo Asset

**Files:**
- Create: `static/img/AI_medium_black.svg`

- [ ] **Step 1: Copy the file**

```bash
cp ~/Downloads/AI_medium_black.svg /Users/meganr/dev/allen-org/idea-board/static/img/AI_medium_black.svg
```

- [ ] **Step 2: Verify it's there**

```bash
ls -lh /Users/meganr/dev/allen-org/idea-board/static/img/AI_medium_black.svg
```

Expected: file listed, size ~5–15KB.

- [ ] **Step 3: Commit**

```bash
git add static/img/AI_medium_black.svg
git commit -m "feat: add new Allen Institute logo asset"
```

---

## Task 2: Header Styles

**Files:**
- Modify: `src/style/header.module.css`

- [ ] **Step 1: Add `.logoImg` and `.subLabel` to header.module.css**

Open `src/style/header.module.css` and append after the last rule:

```css
.logoImg {
    height: 28px;
    width: auto;
    display: block;
    filter: brightness(0) invert(1);
}

.subLabel {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    color: var(--ALLEN_GREEN);
    padding-left: 8px;
    white-space: nowrap;
}

@media screen and (max-width: 744px) {
    .subLabel {
        display: none;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/style/header.module.css
git commit -m "feat: add logo and sub-label styles to header"
```

---

## Task 3: Header Component

**Files:**
- Modify: `src/components/AppHeader.tsx`

Current state of the relevant section (lines 18–21 and 78–80):

```tsx
const {
    header,
    headerContent,
    headerLeft,
    headerRight,
    homeLink,
    navLink,
} = require("../style/header.module.css");
```

```tsx
<Link className={homeLink} to="/">
    <span>{title}/</span>
</Link>
```

- [ ] **Step 1: Import the new CSS classes and update the destructure**

Replace the CSS module destructure at the top of `AppHeader.tsx`:

```tsx
const {
    header,
    headerContent,
    headerLeft,
    headerRight,
    homeLink,
    navLink,
    logoImg,
    subLabel,
} = require("../style/header.module.css");
```

- [ ] **Step 2: Replace the text logotype with the SVG img + sub-label**

Replace the `<Link className={homeLink} to="/">` block (currently lines 78–80):

```tsx
<Link className={homeLink} to="/">
    <img
        src="/img/AI_medium_black.svg"
        alt="Allen Institute"
        className={logoImg}
    />
    <span className={subLabel}>idea board/</span>
</Link>
```

- [ ] **Step 3: Remove the unused `title` prop default** (it's no longer rendered)

The `title` prop is still declared in the interface and passed by callers — leave it in place (removing it would be a breaking API change), but it is no longer rendered in the JSX. No other change needed.

- [ ] **Step 4: Start dev server and visually verify the header**

```bash
npm run develop
```

Open `http://localhost:8000`. Check:
- White Allen Institute wordmark visible in black header
- "idea board/" appears to the right of the logo in lime green
- Clicking the logo navigates to `/`
- On mobile width (≤744px): sub-label hidden, logo visible

- [ ] **Step 5: Commit**

```bash
git add src/components/AppHeader.tsx
git commit -m "feat: replace text logotype with new Allen Institute SVG logo"
```

---

## Task 4: Homepage Hero Styles

**Files:**
- Modify: `src/style/index-page.module.css`

Current file contents for reference — it has `.container`, `.header`, `.info`, `.list-wrapper` classes. The CSS module uses camelCase in JSX (`listWrapper` → `.list-wrapper` in CSS via CSS Modules kebab-case convention — note: the existing class is `.list-wrapper` in the CSS file but referenced as `listWrapper` in TSX).

- [ ] **Step 1: Add hero classes to index-page.module.css**

Append to `src/style/index-page.module.css`:

```css
.hero {
    background-color: var(--ALLEN_BLUE);
    max-width: 1728px;
    margin: 0 auto;
    padding: 32px 96px;
    @media (max-width: 768px) {
        padding: 24px 24px;
    }
}

.heroBreadcrumb {
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0.04em;
    margin: 0 0 8px;
}

.heroTitle {
    font-family: var(--font-display);
    font-size: 40px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin: 0 0 10px;
    @media (max-width: 768px) {
        font-size: 28px;
    }
}

.heroSubtitle {
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 400;
    color: var(--ALLEN_GREEN);
    line-height: 1.55;
    margin: 0;
    max-width: 640px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/style/index-page.module.css
git commit -m "feat: add hero section styles to index page"
```

---

## Task 5: Homepage Hero Markup

**Files:**
- Modify: `src/templates/index-page.tsx`

Current `IndexPageTemplate` (lines 22–30):

```tsx
export const IndexPageTemplate: React.FC = () => {
    return (
        <div className={pageBackground}>
            <div className={listWrapper}>
                <IdeaRoll />
            </div>
        </div>
    );
};
```

Current CSS destructure (lines 10–13):

```tsx
const {
    listWrapper,
    pageBackground,
} = require("../style/index-page.module.css");
```

- [ ] **Step 1: Add new CSS class imports**

Replace the destructure:

```tsx
const {
    listWrapper,
    pageBackground,
    hero,
    heroBreadcrumb,
    heroTitle,
    heroSubtitle,
} = require("../style/index-page.module.css");
```

- [ ] **Step 2: Add the hero section above the list**

Replace `IndexPageTemplate`:

```tsx
export const IndexPageTemplate: React.FC = () => {
    return (
        <div className={pageBackground}>
            <div className={hero}>
                <p className={heroBreadcrumb}>
                    allen institute / cell science / open ideas/
                </p>
                <h1 className={heroTitle}>Idea Board</h1>
                <p className={heroSubtitle}>
                    A living collection of early-stage ideas, proposals, and
                    open questions from Allen Institute scientists.
                </p>
            </div>
            <div className={listWrapper}>
                <IdeaRoll />
            </div>
        </div>
    );
};
```

- [ ] **Step 3: Visually verify the full homepage**

Dev server should still be running at `http://localhost:8000`. Check:
- Blue hero band appears below the black header
- Breadcrumb text in white (faded)
- "Idea Board" title in large white Urbanist bold
- Subtitle in Allen Green (`#CDEB05`), readable
- Idea list appears below the hero on the warm off-white background
- On an idea post page: no hero — page unchanged

- [ ] **Step 4: Check mobile layout**

Resize browser to ≤768px. Check:
- Hero padding reduces to 24px
- Title scales down to 28px
- Text wraps without overflow

- [ ] **Step 5: Commit**

```bash
git add src/templates/index-page.tsx
git commit -m "feat: add Allen Blue hero section to homepage"
```

---

## Verification Checklist

Run through these after all tasks complete:

- [ ] `npm run build` completes with no errors
- [ ] Homepage: logo white in header, "idea board/" sub-label in lime green
- [ ] Homepage: blue hero with breadcrumb, white title, green subtitle
- [ ] Idea post page: no hero — header and content unchanged
- [ ] Mobile (≤744px): header sub-label hidden, logo still visible
- [ ] Mobile (≤768px): hero padding and title size reduce correctly
- [ ] No 404 in browser console for `/img/AI_medium_black.svg`
