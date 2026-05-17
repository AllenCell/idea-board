# IdeaRoll ListItem Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a colored left-border accent and matching title color to each IdeaRoll list item, with per-author avatar colors, using the Allen Institute 2025 brand palette.

**Architecture:** Two isolated changes — CSS first (add `var(--item-color)` rules), then component (add `hashColor` helper, compute colors per item, pass as CSS custom property and avatar style). No new files. No external dependencies.

**Tech Stack:** Gatsby, React, TypeScript, Ant Design 5, CSS Modules

---

## File Map

| File | Change |
|------|--------|
| `src/style/idea-roll.module.css` | Add left border + padding rules using `var(--item-color)`; change title color rule from `var(--ALLEN_BLUE)` to `var(--item-color)` |
| `src/components/IdeaRoll.tsx` | Add `ACCENT_COLORS` constant + `hashColor` helper; remove `ALLEN_TEAL` import; compute accent color per item and avatar color per author; pass color as CSS custom property on `List.Item` |

---

## Task 1: CSS — Left Border and Title Color

**Files:**
- Modify: `src/style/idea-roll.module.css`

- [ ] **Step 1: Replace the full file contents**

The file currently has 13 lines. Replace it entirely with:

```css
.container {
    margin: auto;
    background-color: var(--color-bg-base);

    :global(.ant-list-item) {
        border-left: 3px solid var(--item-color);
        padding-left: 20px;
    }

    :global(.ant-list-item-meta-title a) {
        color: var(--item-color);
        font-weight: 600;
    }

    :global(.ant-list-item-meta-title a:hover) {
        color: var(--ALLEN_VIOLET);
    }
}
```

Key changes from the original:
- Added `:global(.ant-list-item)` block with `border-left` and `padding-left`
- Changed `.ant-list-item-meta-title a` color from `var(--ALLEN_BLUE)` to `var(--item-color)`
- Hover color stays `var(--ALLEN_VIOLET)` (unchanged)

- [ ] **Step 2: Commit**

```bash
git add src/style/idea-roll.module.css
git commit -m "feat: add accent color CSS rules to idea-roll list item"
```

---

## Task 2: Component — hashColor Helper and Color Assignment

**Files:**
- Modify: `src/components/IdeaRoll.tsx`

- [ ] **Step 1: Replace the full file contents**

Replace `src/components/IdeaRoll.tsx` with:

```tsx
import React from "react";

import { Link, graphql, useStaticQuery } from "gatsby";

import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";

import { IconText } from "./IconText";
import { TagPopover } from "./TagPopover";

const { container } = require("../style/idea-roll.module.css");

const ACCENT_COLORS = ["#6464FF", "#8246E1", "#00A59B", "#CD0F55"];

function hashColor(str: string): string {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return ACCENT_COLORS[h % ACCENT_COLORS.length];
}

type IdeaNode = Queries.IdeaRollQuery["allIdeaPost"]["nodes"][number];

type IdeaListItem = Omit<IdeaNode, "resources"> & {
    dataset: string | null;
};

interface IdeaRollProps {
    count?: number;
}

const IdeaRoll = ({ count }: IdeaRollProps) => {
    const queryData = useStaticQuery(graphql`
        query IdeaRoll {
            allIdeaPost(sort: { date: DESC }, filter: { draft: { ne: true } }) {
                nodes {
                    id
                    slug
                    title
                    tags
                    authors
                    resources {
                        type
                        name
                    }
                }
            }
        }
    `);

    const filteredNodes = queryData.allIdeaPost.nodes.slice(0, count);
    const ideasForIdeaRoll: IdeaListItem[] = filteredNodes.map(
        (post: IdeaNode) => ({
            ...post,
            dataset:
                post.resources.find((r) => r?.type === "dataset")?.name ?? null,
        }),
    );

    return (
        <List
            className={container}
            itemLayout="vertical"
            bordered={true}
            dataSource={ideasForIdeaRoll}
            footer={
                count ? (
                    <div>
                        <Link className="btn" to="/">
                            See more
                        </Link>
                    </div>
                ) : (
                    ""
                )
            }
            renderItem={(item) => {
                const accentColor = hashColor(item.title);
                return (
                    <List.Item
                        key={item.title}
                        style={
                            { "--item-color": accentColor } as React.CSSProperties
                        }
                        actions={[
                            <IconText
                                icon={StarOutlined}
                                text="2"
                                key="list-vertical-star-o"
                            />,
                            <IconText
                                icon={MessageOutlined}
                                text="2"
                                key="list-vertical-message"
                            />,
                            ...item.tags.map((tag) => (
                                <TagPopover
                                    key={tag}
                                    tag={tag}
                                    currentSlug={item.slug}
                                />
                            )),
                        ]}
                    >
                        <List.Item.Meta
                            title={<a href={item.slug}>{item.title}</a>}
                            avatar={
                                <Avatar.Group>
                                    {item.authors.map((author) => (
                                        <Avatar
                                            key={author}
                                            style={{
                                                backgroundColor:
                                                    hashColor(author),
                                                color: "#fff",
                                            }}
                                        >
                                            {author[0].toUpperCase()}
                                        </Avatar>
                                    ))}
                                </Avatar.Group>
                            }
                            description={
                                <span>
                                    {item.dataset ?? "No public dataset"}
                                </span>
                            }
                        />
                    </List.Item>
                );
            }}
        />
    );
};

export default IdeaRoll;
```

Key changes from the original:
- Removed `import { ALLEN_TEAL } from "../style/theme"` (no longer needed)
- Added `ACCENT_COLORS` array with the four brand colors
- Added `hashColor(str)` function — djb2-style hash, returns one of the four brand colors
- Removed `const avatarColor = ALLEN_TEAL`
- `renderItem` now computes `accentColor = hashColor(item.title)` and passes `{ "--item-color": accentColor }` as inline style on `List.Item`
- Each `Avatar` now uses `hashColor(author)` as `backgroundColor` instead of the uniform teal

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If you see `Property '--item-color' does not exist on type 'CSSProperties'`, the cast `as React.CSSProperties` handles it — that error won't appear because we cast inline.

- [ ] **Step 3: Start dev server and visually verify**

```bash
npm run develop
```

Open `http://localhost:8000`. Check:
- Each list item has a colored left border (blue, violet, teal, or maroon)
- The title link color matches its item's left border color
- Author avatars show different colors (not all uniform teal)
- Hovering a title turns it Allen Violet (`#8246E1`)
- The same idea always gets the same color on page reload
- Actions bar (star, message, tags) unchanged

- [ ] **Step 4: Commit**

```bash
git add src/components/IdeaRoll.tsx
git commit -m "feat: add deterministic accent colors to IdeaRoll list items"
```

---

## Verification Checklist

- [ ] `npx tsc --noEmit` passes with no errors
- [ ] Each list item has a 3px colored left border
- [ ] Title link color matches the left border color
- [ ] Author avatars have per-author colors (not all teal)
- [ ] Title hover color is Allen Violet
- [ ] Reloading the page: same idea = same color
- [ ] Actions bar unchanged (star "2", message "2", tags)
- [ ] Idea post pages unaffected (no hero regression)
