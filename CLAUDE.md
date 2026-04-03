# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Pure Admin Templates — project templates for `pureadmin create`. Each template is a self-contained folder with a manifest, helper script, page generators, and project files.

Published to [pureadmin.io](https://pureadmin.io) and consumed by the [pureadmin CLI](https://github.com/keenmate/pure-admin-cli).

## Repository Structure

```
pure-admin-templates/
├── schemas/
│   └── pure-admin-template.schema.json   # JSON schema for template.json
├── scripts/
│   └── update-checksums.js               # Regenerate SHA-256 checksums
├── svelte-sveltekit/                     # SvelteKit template
│   ├── template.json                     # Manifest
│   ├── template.helper.js                # data-pa point definitions
│   ├── pages/                            # Page generators
│   └── template/                         # Project files (copied to user's app)
├── svelte-spa/                           # Svelte SPA template
│   ├── template.json
│   ├── template.helper.js
│   ├── pages/
│   └── template/
├── README.md
├── CHANGELOG.md
└── CLAUDE.md
```

## Commands

```bash
# Regenerate checksums for all templates
node scripts/update-checksums.js

# Regenerate for one template
node scripts/update-checksums.js svelte-spa

# Test a template locally
pureadmin create test-app --template-path ./svelte-sveltekit
pureadmin create test-app --template-path ./svelte-spa --font-awesome --profile-panel
```

## Template Manifest Convention

Aligned with the theme manifest pattern (`pure-admin-themes`):

- **`id`** — kebab-case unique identifier (matches folder name)
- **`name`** — human-readable display name
- **`$schema`** — references `../schemas/pure-admin-template.schema.json`
- **`checksums`** — SHA-256 per file + summary hash. Always run `node scripts/update-checksums.js` after changing template files.

## Feature System

Features use `data-pa` markers in template files:

```html
<!-- data-pa="feature-id" -->
<div>This block is removed when feature is disabled</div>
<!-- /data-pa="feature-id" -->
```

```js
// data-pa="feature-id"
import { Something } from 'somewhere';
// /data-pa="feature-id"
```

Feature types in `template.json`:
- `isRequired: true` — always included (navbar, sidebar)
- `isDefault: true` — included by default, toggleable (footer, page-loader)
- Neither — opt-in only (profile-panel, settings-panel)
- `cli` as array — exclusive options (icons: Font Awesome / Lucide / Fluent UI)

## Placeholder Syntax

Template files use `__VAR__` syntax (not `{{VAR}}` which conflicts with Svelte):

```
__APP_NAME__, __APP_ID__, __COPYRIGHT__, __DEFAULT_THEME__,
__USER_NAME__, __USER_EMAIL__, __USER_NAME_URL__,
__PM__, __PM_RUN__, __PM_EXEC__
```

## Key Differences: SvelteKit vs SPA

| | SvelteKit | SPA |
|---|-----------|-----|
| Entry point | `src/app.html` | `index.html` |
| Layout | `src/routes/+layout.svelte` | `src/App.svelte` |
| Routing | File-based (`src/routes/`) | Hash-based (`src/routes/index.ts`) |
| Themes dir | `static/themes/` | `public/themes/` |
| SSR | Yes | No |
| Scaffold | `npx sv create` | `npm create vite@latest` |

## Related Repositories

- **pure-admin** — CSS framework (`../pure-admin`)
- **pure-admin-cli** — CLI tool (`../pure-admin-cli`)
- **pure-admin-io** — pureadmin.io website (`../pure-admin-io`)
- **pure-admin-themes** — theme packages (`../pure-admin-themes`)
- **svelte-pure-admin** — Svelte component library (`../svelte-pure-admin`)
