# claude-configs

A library of reusable Claude Code skills, patterns, design systems, and configs.

## Purpose

This repo is a reference library, not a runnable project. Use it by:

1. **Copying files** into a target repo's `.claude/`, `docs/design/`, or root
2. **Pointing an agent here** as a guide (e.g. via `--directory` or file reads)

## Layout

| Directory    | Contains                                     | Copy to                            |
|-------------|----------------------------------------------|------------------------------------|
| `base/`     | Universal code style and design principles   | Target repo's `CLAUDE.md` or `docs/` |
| `brands/`   | Composable design system bundles             | `<repo>/docs/design/`              |
| `skills/`   | Skill folders (each with `SKILL.md`)         | `<repo>/.claude/skills/`           |
| `patterns/` | Agent orchestration patterns and templates   | `<repo>/.claude/` or `CLAUDE.md`   |
| `settings/` | `settings.json` examples and templates       | `<repo>/.claude/settings.json`     |
| `hooks/`    | Hook scripts                                 | `<repo>/.claude/hooks/`            |
| `tasks/`    | Research and exploration tasks for this repo  | (internal use)                     |

## Base (universal defaults)

| File | Description |
|------|-------------|
| `code-style.md` | When to extract functions, create utils, modularize (living document) |
| `design-principles.md` | CSS-first philosophy, layout, typography, color, accessibility baseline |

These always apply. Brand and project docs override specific choices.

## Brands (composable design systems)

Layered: `base/` → `brands/<brand>/` → project-specific overrides in target repo.

| Brand | Description |
|-------|-------------|
| `aics-legacy/` | Older AICS brand (Ant Design heavy, being phased out) |
| `aics-current/` | Current AICS brand direction |
| `personal/` | Personal projects default (vanilla CSS, modern features) |
| `clients/wife-site/` | Client: wife's website |
| `clients/the-wheel/` | Client: The Wheel project |

Each brand has `BRAND.md` (identity, philosophy) and `design-tokens.md` (CSS custom properties).
See `brands/README.md` for conventions and setup instructions.

## Skills

| Skill | Description |
|-------|-------------|
| `grill-me` | Stress-test a plan or design through relentless interviewing |
| `write-a-prd` | Create a PRD through interview, codebase exploration, and module design |
| `prd-to-issues` | Break a PRD into GitHub issues using tracer-bullet vertical slices |
| `tdd` | Test-driven development with red-green-refactor loop |
| `improve-codebase-architecture` | Find architectural improvement opportunities, propose deep module refactors |
| `setup-pre-commit` | Set up Lefthook pre-commit hooks with lint-staged and Prettier |
| `write-a-skill` | Create new agent skills with proper structure |
| `git-guardrails` | Block dangerous git commands via Claude Code hooks |
| `design-an-interface` | Generate multiple radically different interface designs using parallel agents |
| `code-review` | Review a PR or changes for quality, correctness, and team standards |
| `pre-commit` | Update docs and run repo checks before committing |

## Patterns

| Pattern | Description |
|---------|-------------|
| `agent-types.md` | Planner / Worker / Reviewer agent role definitions |
| `task-system.md` | File-based task management system for agent orchestration |
| `task-templates/` | Worker, Planner, and Reviewer task file templates |
| `claude-md-template.md` | Starter `CLAUDE.md` template for new repos |
| `local-scheduled-tasks.md` | Guide to `/loop`, headless mode (`claude -p`), and Desktop scheduled tasks |
| `github-actions/` | Workflow templates for Claude in CI/CD (interactive, PR review, scheduled) |

## Settings

| Template | Description |
|----------|-------------|
| `settings-template.json` | Broad permissions whitelist for autonomous exploration |
| `settings-with-hooks-template.json` | Permissions + alert sound on stop + git guardrails hook |

## How to set up a new project

1. Copy `settings/settings-template.json` → `<repo>/.claude/settings.json`
2. Copy `patterns/claude-md-template.md` → `<repo>/CLAUDE.md`, customize
3. Pick a brand, copy its folder → `<repo>/docs/design/`
4. Add project-specific overrides to the copied design docs
5. Copy any skills you need → `<repo>/.claude/skills/`

## Attribution

Skills adapted from [Matt Pocock's skills repo](https://github.com/mattpocock/skills).
Patterns derived from the simularium-2 project's agent orchestration system.
CSS-first philosophy inspired by https://lyra.horse/blog/2025/08/you-dont-need-js/.
