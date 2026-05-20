# AICS Idea Board

A Gatsby site for sharing proposed research directions using AICS datasets and tools. Content is managed via Decap CMS and deployed on Netlify.

## Tech Stack

- **Framework**: Gatsby 5 (React 18, TypeScript)
- **UI**: Ant Design v5
- **CMS**: Decap CMS (git-based, content in `src/pages/`)
- **Deploy**: Netlify (CI/CD via `.github/` workflows)
- **Testing**: Vitest
- **Linting**: ESLint + Prettier
- **Hooks**: Lefthook (format/lint on commit, typecheck/test on push)

## Directory Structure

```
src/
  cms/          # Decap CMS preview templates
  components/   # Shared React components
  constants/    # App-wide constants
  hooks/        # Custom React hooks
  pages/        # Content (markdown) + page components
  style/        # Global CSS
  templates/    # Gatsby page templates
  types/        # TypeScript types
  utils/        # Utility functions
gatsby/         # Gatsby plugin helpers
netlify/        # Netlify function handlers
scripts/        # Build/utility scripts
docs/
  design/aics-current/  # Brand identity and design tokens
```

## Common Commands

```bash
yarn develop      # Start dev server (cleans first)
yarn dev          # Dev server + Decap CMS proxy (for local CMS editing)
yarn build        # Production build (cleans first)
yarn test         # Run Vitest suite
yarn typeCheck    # TypeScript check (no emit)
yarn lint         # ESLint with auto-fix
yarn format       # Prettier with auto-fix
```

## Design System

Brand tokens and identity guidelines live in `docs/design/aics-current/`:
- `BRAND.md` — visual identity, philosophy, usage rules
- `design-tokens.md` — CSS custom properties (colors, spacing, typography)

Use Ant Design v5 components as the base UI layer. Override with design tokens; avoid inline styles.

## Code Conventions

- TypeScript everywhere — no `any`, no skipping type checks
- Prefer functional components with hooks
- Co-locate component styles with the component when possible
- Content changes go in `src/pages/` markdown files, not in components

## Pre-commit Hooks (Lefthook)

These run automatically — do not skip with `--no-verify`:
- **pre-commit**: Prettier format + ESLint fix on staged `.ts/.tsx` files
- **pre-push**: `tsc --noEmit` typecheck + `vitest run`

## Available Skills

| Skill         | Purpose                                        |
| ------------- | ---------------------------------------------- |
| `pre-commit`  | Update docs and run checks before committing   |
| `tdd`         | Red-green-refactor loop for new features       |
| `code-review` | Review changes for quality and team standards  |
| `grill-me`    | Stress-test a plan before implementation       |
