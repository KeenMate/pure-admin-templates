# Pure Admin Templates

Project templates for [Pure Admin](https://pureadmin.io) — used by `pureadmin create` to scaffold new applications.

## Available Templates

| Folder | Technology | Variant | Description |
|--------|-----------|---------|-------------|
| `svelte-sveltekit/` | Svelte | SvelteKit | Full SvelteKit app with file-based routing, SSR, and optional panels |
| `svelte-spa/` | Svelte | SPA | Single-page app with hash-based routing (no SSR, no server) |

## Structure

Each template is self-contained in its own folder:

```
<technology>-<variant>/
├── template.json          # Manifest: id, name, features, CLI flags, checksums
├── template.helper.js     # data-pa marker definitions for feature stripping
├── pages/                 # Page generators (dashboard, list, detail, form, etc.)
└── template/              # The actual project files (copied to user's app)
    ├── package.json
    ├── README.md
    ├── CHANGELOG.md
    ├── Makefile
    ├── src/
    └── ...
```

### template.json

The manifest defines everything the CLI and pureadmin.io need. Aligned with the [theme manifest](https://github.com/keenmate/pure-admin-themes) convention (`id` + `name`):

- **`id`** — kebab-case unique identifier (matches folder name)
- **`name`** — human-readable display name
- **`technology` / `variant`** — for template selection wizard
- **`content`** — markdown description for pureadmin.io detail page
- **`tags`** — searchable labels
- **`features`** — toggleable blocks with `isRequired`, `isDefault`, `cli` flags
- **`placeholders`** — variables substituted at create time (`__APP_NAME__`, `__PM__`, etc.)
- **`pageTypes`** — page generators (dashboard, list, detail, form, master-detail)
- **`scaffold`** — command to bootstrap the project (e.g. `sv create`)
- **`checksums`** — SHA-256 per file, pages, helper, metadata, and summary hash

### Feature Model

Features define optional blocks in the template that can be toggled:

| Type | Behavior | Example |
|------|----------|---------|
| `isRequired` | Always included, cannot toggle | navbar, sidebar |
| `isDefault` | Included by default, user can disable | floating-ui, page-loader, footer |
| opt-in | Excluded by default, user enables | profile-panel, settings-panel |
| multi-option | Pick one from exclusive choices | icons: Font Awesome / Lucide / Fluent UI |

Each feature has a `cli` field mapping to CLI flags, used by the pureadmin.io command builder to generate the `pureadmin create` command interactively.

### template/ subfolder

Contains the actual project files with `data-pa` markers for feature stripping. When a feature is disabled, the CLI removes all marked blocks for that feature.

### pages/

Page generator templates. Used by `--preset` profiles to generate route files (e.g. dashboard, user list, settings form).

## Usage

### Via pureadmin.io (default)

```bash
pureadmin create my-app
```

Templates are published to pureadmin.io and fetched automatically.

### Local development

```bash
pureadmin create my-app --template-path ../pure-admin-templates/svelte-sveltekit
pureadmin create my-app --template-path ../pure-admin-templates/svelte-spa
```

## Scripts

```bash
# Regenerate checksums for all templates
node scripts/update-checksums.js

# Regenerate for a single template
node scripts/update-checksums.js svelte-spa
```

## Adding a New Template

1. Create a folder: `<technology>-<variant>/`
2. Add `template.json` with `$schema`, `id`, `name`, `technology`, `variant`, and feature definitions
3. Add `template.helper.js` with marker format and point mappings
4. Add project files in `template/` with `data-pa` markers for optional features
5. Add page generators in `pages/`
6. Run `node scripts/update-checksums.js <your-template>` to generate checksums
7. Test with `pureadmin create test-app --template-path ./<your-template>`
