# Pure Admin Templates

Project templates for [Pure Admin](https://pureadmin.io) — used by `pureadmin create` to scaffold new applications.

## Available Templates

| Folder | Technology | Variant | Description |
|--------|-----------|---------|-------------|
| `svelte-sveltekit/` | Svelte | SvelteKit | Full SvelteKit app with layout, sidebar, navbar, theme switching, and optional panels |

## Structure

Each template is self-contained in its own folder:

```
<technology>-<variant>/
├── template.json          # Manifest: metadata, scaffold, features, placeholders, pages
├── template.helper.js     # Marker definitions for feature stripping (data-pa points)
├── pages/                 # Page generators (dashboard, list, detail, form, etc.)
└── template/              # The actual project files (copied to user's app)
    ├── package.json
    ├── Makefile
    ├── src/
    └── ...
```

### template.json

The manifest defines everything the CLI needs:

- **technology / variant** — for template selection wizard
- **scaffold** — command to bootstrap the project (e.g. `sv create`)
- **placeholders** — variables substituted at create time (`__APP_NAME__`, `__PM__`, etc.)
- **features** — optional blocks that can be enabled/disabled (profile panel, settings panel, font-awesome, etc.)
- **pageTypes** — available page generators (dashboard, list, detail, form, master-detail)
- **dependencies** — npm packages added after scaffold
- **instructions** — post-create next steps shown to the user

### template/ subfolder

Contains the actual project files with `data-pa` markers for feature stripping. When a feature is disabled, the CLI removes all marked blocks for that feature.

### pages/

Page generator templates. Used by `--preset` profiles or `--pages` to generate route files (e.g. dashboard, user list, settings form).

## Usage

### Via pureadmin.io (default)

```bash
pureadmin create my-app
```

Templates are published to pureadmin.io and fetched automatically.

### Local development

```bash
pureadmin create my-app --template-path ../pure-admin-templates/svelte-sveltekit
```

## Adding a New Template

1. Create a folder: `<technology>-<variant>/`
2. Add `template.json` with `technology`, `variant`, and feature definitions
3. Add `template.helper.js` with marker format and point mappings
4. Add project files in `template/` with `data-pa` markers for optional features
5. Add page generators in `pages/`
6. Test with `pureadmin create test-app --template-path ./<your-template>`
