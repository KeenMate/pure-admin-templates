# __APP_NAME__

Built with [SvelteKit](https://svelte.dev/docs/kit) and [Pure Admin](https://pureadmin.io).

## Created With

```bash
__CREATE_COMMAND__
```

### Organization Profile

__ORG_PROFILE__

### App Profile

__APP_PROFILE__

## Quick Start

```bash
__PM__ install
__PM_RUN__ dev
```

Open [http://localhost:5173](http://localhost:5173)

## Scripts

| Command | Description |
|---------|-------------|
| `__PM_RUN__ dev` | Start development server |
| `__PM_RUN__ build` | Build for production |
| `__PM_RUN__ preview` | Preview production build |
| `__PM_RUN__ check` | Type-check with svelte-check |
| `__PM_EXEC__ pureadmin themes` | Download/update themes |

Or use `make dev`, `make build`, etc.

## Project Structure

```
__APP_ID__/
├── src/
│   ├── app.html                 # HTML shell (theme CSS, page loader, FOUC prevention)
│   ├── app.css                  # App-level styles
│   └── routes/
│       ├── +layout.svelte       # Main layout (navbar, sidebar, footer, panels)
│       ├── +page.svelte         # Home / dashboard page
│       ├── getting-started/     # Getting started page
│       ├── settings/            # Settings page
│       └── users/               # Users page
├── static/
│   └── themes/                  # Downloaded theme CSS (corporate, audi, dark, ...)
├── package.json
├── pureadmin.json               # Theme declarations (hand-edited, committed)
├── pureadmin.lock.json          # Resolved theme versions (tool-managed, committed)
├── svelte.config.js             # SvelteKit config
├── vite.config.ts               # Vite config
├── tsconfig.json                # TypeScript config
└── Makefile                     # Build shortcuts
```

## Technology

- **[SvelteKit](https://svelte.dev/docs/kit)** — full-stack Svelte framework with file-based routing and SSR
- **[Svelte 5](https://svelte.dev)** — reactive UI framework with runes
- **[Vite](https://vite.dev)** — fast build tool and dev server
- **[TypeScript](https://www.typescriptlang.org)** — type-safe JavaScript
- **[@keenmate/pure-admin-core](https://www.npmjs.com/package/@keenmate/pure-admin-core)** — CSS framework
- **[@keenmate/svelte-pure-admin](https://www.npmjs.com/package/@keenmate/svelte-pure-admin)** — Svelte component library

## Themes

Themes are declared in `pureadmin.json` (committed) and pinned in
`pureadmin.lock.json` (committed, tool-managed). To add a new theme:

```bash
__PM_EXEC__ pureadmin themes add audi
```

To bump every declared theme to the latest compatible version:

```bash
__PM_EXEC__ pureadmin themes update
```

On a fresh clone or in CI, install the locked versions:

```bash
__PM_EXEC__ pureadmin themes ci
```

Theme CSS is served from `static/themes/` and loaded via `<link>` in `app.html`.
