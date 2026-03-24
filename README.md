# AICS Idea Board

A board of proposed research topics using AICS data and tools, built with [Gatsby](https://www.gatsbyjs.org/) and [Decap CMS](https://www.decapcms.org).

Content is authored in markdown, edited through a Decap CMS admin interface, and rendered as static pages by Gatsby. The site follows the [JAMstack architecture](https://jamstack.org), using Git as a single source of truth and [Netlify](https://www.netlify.com) for continuous deployment and CDN distribution.

## For Content Editors (Admin Users)

Content on this site — ideas, resources, programs, etc. — is managed through the Decap CMS admin interface. You do not need to install anything or write code.

### Accessing the CMS

1. Navigate to the site URL and append `/admin/` (e.g. `https://<site-domain>/admin/`)
2. Log in with your Netlify Identity credentials
3. You'll see the CMS dashboard with collections (Ideas, Resources, etc.)

### Editing Content

- Select a collection from the sidebar, then click an existing entry to edit it, or click **New** to create one
- The editor provides form fields for structured data (title, tags, status, etc.) and a rich text editor for body content
- Click **Publish** to save — this creates a Git commit behind the scenes and triggers a site rebuild
- Changes typically appear on the live site within a few minutes

### Content Types

| Collection | Where it lives | Description |
|---|---|---|
| Ideas | `src/pages/ideas/` | Research topic proposals |
| Resources | `src/pages/resource/` | Datasets, tools, cell lines, protocols |
| Programs | `src/pages/programs/` | Research program pages |

## For Developers

### Prerequisites

- Node.js >= 18.15.0 (see `engines` in `package.json`)
- npm (comes with Node.js)

### Getting Started

```bash
# Install dependencies
npm install

# Start the development server with the local CMS proxy
npm run dev
```

This runs two things concurrently:
- **Gatsby dev server** at `http://localhost:8000` — the site with hot reloading
- **Decap CMS proxy server** — allows local CMS editing at `http://localhost:8000/admin/`

### Other Commands

| Command | Description |
|---|---|
| `npm run develop` | Gatsby dev server only (no local CMS) |
| `npm run build` | Production build to `public/` |
| `npm run serve` | Serve the production build locally |
| `npm run format` | Format code with Prettier |
| `npm run formatCheck` | Check formatting without writing |
| `npm run lint` | Lint TypeScript files with ESLint |
| `npm test` | Run tests with Vitest |

### Project Structure

```
src/
  pages/          # Markdown content files and page components
  templates/      # Page templates (idea-post, resource, etc.)
  components/     # Shared React components
  graphql/        # GraphQL fragments
  types/          # Derived TypeScript types
gatsby/
  schema/         # GraphQL schema definitions (base.gql)
  utils/          # Resolver utilities
static/
  admin/          # Decap CMS configuration (config.yml)
gatsby-node.js    # Node creation, schema customization, resolvers
gatsby-config.js  # Gatsby plugin configuration
netlify.toml      # Netlify build settings
```

### Key Technologies

Gatsby 5, React 18, TypeScript (strict mode), GraphQL, Decap CMS, Ant Design, Netlify

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and architecture details.

## For LLMs

See [CLAUDE.md](CLAUDE.md) for detailed information about the data pipeline, typing strategy, component patterns, and conventions used in this project.
