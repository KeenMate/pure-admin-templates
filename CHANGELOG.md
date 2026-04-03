# Changelog

## 1.0.0 — 2026-04-03

### Added
- **`svelte-sveltekit` template** — SvelteKit + Pure Admin with file-based routing, SSR, and optional panels
- **`svelte-spa` template** — Svelte SPA + Pure Admin with hash-based routing via svelte-spa-router, no server
- **`template/` subfolder structure** — separates CLI tooling (manifest, helper, pages) from project files
- **`template.json` manifest** — self-describing with `id`, `name`, `version`, `technology`, `variant`, features, placeholders, pageTypes, scaffold commands, instructions
- **JSON schema** (`schemas/pure-admin-template.schema.json`) — full validation, aligned with theme manifest pattern
- **Feature system** — `isRequired`, `isDefault`, `cli` (single flag or array of exclusive options like icon providers)
- **`data-pa` marker system** — feature stripping via `template.helper.js` point definitions
- **Page generators** — dashboard, list, detail, form, master-detail in `pages/`
- **SHA-256 checksums** — per-file, per-page, helper, metadata, and summary hash for change detection on upload
- **`scripts/update-checksums.js`** — regenerate all checksums
- **README.md and CHANGELOG.md** in each template — placeholder-substituted app docs with project structure, scripts, and technology stack
- **`content` field** — markdown for pureadmin.io template detail page
- **`tags` field** — searchable labels (svelte, sveltekit, spa, ssr, typescript, etc.)
