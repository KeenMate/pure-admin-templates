# __APP_NAME__

Built with [Svelte](https://svelte.dev) SPA and [Pure Admin](https://pureadmin.io).

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
| `__PM_EXEC__ pureadmin themes` | Download/update themes |

Or use `make dev`, `make build`, etc.

## Project Structure

```
__APP_ID__/
├── index.html                   # HTML entry (theme CSS, page loader, FOUC prevention)
├── src/
│   ├── main.ts                  # App entry point (mounts Svelte)
│   ├── App.svelte               # Main layout (navbar, sidebar, footer, panels)
│   └── routes/
│       ├── index.ts             # Route definitions (hash-based)
│       ├── Dashboard.svelte     # Dashboard page
│       ├── GettingStarted.svelte
│       ├── Settings.svelte
│       └── Users.svelte
├── public/
│   └── themes/                  # Downloaded theme CSS (corporate, audi, dark, ...)
├── package.json
├── pureadmin.json               # Theme declarations (hand-edited, committed)
├── pureadmin.lock.json          # Resolved theme versions (tool-managed, committed)
├── svelte.config.js             # Svelte preprocessor config
├── vite.config.ts               # Vite config
└── Makefile                     # Build shortcuts
```

## Technology

- **[Svelte 5](https://svelte.dev)** — reactive UI framework with runes
- **[Vite](https://vite.dev)** — fast build tool and dev server
- **[TypeScript](https://www.typescriptlang.org)** — type-safe JavaScript
- **[@keenmate/svelte-spa-router](https://www.npmjs.com/package/@keenmate/svelte-spa-router)** — hash-based SPA router
- **[@keenmate/pure-admin-core](https://www.npmjs.com/package/@keenmate/pure-admin-core)** — CSS framework
- **[@keenmate/svelte-pure-admin](https://www.npmjs.com/package/@keenmate/svelte-pure-admin)** — Svelte component library

No SSR, no server — builds to a static `dist/` folder that can be served from any web server or CDN.

## Routing

Routes are hash-based (`#/users`, `#/settings`). Defined in `src/routes/index.ts`:

```ts
export const routes = {
    '/': Dashboard,
    '/users': Users,
    '/settings': Settings
};
```

Add a new page by creating a component in `src/routes/` and adding it to the route map.

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

Theme CSS is served from `public/themes/` and loaded via `<link>` in `index.html`.
