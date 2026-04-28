# __APP_NAME__

Phoenix LiveView application built with [Pure Admin](https://pureadmin.io) — a lightweight, data-focused CSS/SCSS admin framework wrapped into LiveView components via [`keen_pure_admin`](https://hex.pm/packages/keen_pure_admin).

This project was scaffolded with the [PureAdmin CLI](https://www.npmjs.com/package/@keenmate/pureadmin):

```bash
__CREATE_COMMAND__
```

### Organization Profile

__ORG_PROFILE__

### App Profile

__APP_PROFILE__

## Prerequisites

- Elixir `~> 1.15`
- Erlang/OTP 26+
- PostgreSQL (if Ecto is enabled)
- Node.js (only to run the PureAdmin CLI for theme management)

## Quick start

```bash
make setup     # fetch deps, download themes, create DB, build assets
make dev       # start Phoenix server at http://localhost:4000
```

Or step by step:

```bash
mix deps.get
mix ecto.create
mix phx.server
```

## Make commands

| Command | What it does |
|---|---|
| `make help` | Show all available targets |
| `make setup` | Full setup: deps + themes + DB + assets |
| `make deps` | Fetch Elixir dependencies |
| `make server` / `make dev` | Start Phoenix server |
| `make build` | Compile the project |
| `make assets` | Build JS/CSS assets via esbuild |
| `make themes` | Download configured Pure Admin themes |
| `make themes-update` | Re-download themes that have changed |
| `make ecto-create` | Create the database |
| `make ecto-reset` | Drop and recreate the database |
| `make format` | Format Elixir code |
| `make test` | Run the test suite |
| `make clean` | Clean build artifacts |

## Configuration

The project follows the standard Phoenix config layout, with one addition for local overrides.

### `config/` layout

| File | Env | Committed | Purpose |
|---|---|---|---|
| `config.exs` | all | ✓ | Shared configuration loaded first |
| `dev.exs` | `:dev` | ✓ | Development defaults (safe to commit) |
| `test.exs` | `:test` | ✓ | Test configuration |
| `prod.exs` | `:prod` | ✓ | Production compile-time settings |
| `runtime.exs` | all | ✓ | Runtime config (reads env vars in prod) |
| `.local.exs` | all | ✗ | **Personal dev overrides (gitignored)** |

### Local development overrides — `config/.local.exs`

This file is gitignored and loaded by `config.exs` at the very end. Use it for personal dev-only overrides (database credentials, custom port, disabling features locally) without touching committed files.

**Example `config/.local.exs`:**

```elixir
import Config

# Custom database credentials
config :__APP_ID_SNAKE__, __APP_MODULE__.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "__APP_ID_SNAKE___dev"

# Custom port (default is 4000)
config :__APP_ID_SNAKE__, __APP_MODULE__Web.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4030]

# Disable the FOUC (flash of unstyled content) prevention while debugging themes
# config :keen_pure_admin, fouc_prevention: false
```

The `.local.exs` file is only created when you need it. It's automatically loaded when present — no additional setup required.

### Production — `config/runtime.exs`

Production uses environment variables read at runtime (not at compile time). Set these in your deployment environment:

| Variable | Purpose |
|---|---|
| `SECRET_KEY_BASE` | Phoenix session secret (generate with `mix phx.gen.secret`) |
| `PHX_HOST` | Your public hostname (e.g. `app.example.com`) |
| `PORT` | HTTP port (default `4000`) |
| `DATABASE_URL` | Full Postgres URL (e.g. `ecto://user:pass@host/db`) |
| `POOL_SIZE` | DB connection pool size (default `10`) |
| `PHX_SERVER` | Set to `true` to start the HTTP endpoint |

See `config/runtime.exs` for the full list and required/optional semantics.

## Themes

Themes are managed by the PureAdmin CLI. Each theme is a self-contained CSS package that includes the core framework + typography + color variants.

### Installed themes

Configured themes are declared in `pureadmin.json` and pinned in
`pureadmin.lock.json` (both committed). To add more:

```bash
# Add one or more themes to this project (writes both pureadmin.json + lock)
npx @keenmate/pureadmin themes add corporate express dark

# Bump every declared theme to the latest compatible version
npx @keenmate/pureadmin themes update

# On a fresh clone or in CI, install the locked versions exactly
npx @keenmate/pureadmin themes ci
```

Browse all available themes at **[pureadmin.io](https://pureadmin.io)**.

### Switching the default theme

Edit `lib/__APP_ID_SNAKE___web/components/layouts/root.html.heex` and change the theme CSS link:

```heex
<link rel="stylesheet" href="/themes/<theme-slug>/css/<theme-slug>.css" />
```

Or enable runtime switching via the `SettingsPanel` component (see [keen_pure_admin docs](https://hexdocs.pm/keen_pure_admin)).

## Icons

Icons are provided by [Font Awesome 6](https://fontawesome.com) via CDN (configured in `root.html.heex`). Usage:

```heex
<i class="fa-solid fa-gauge"></i>
<.sidebar_item label="Dashboard" icon="fa-solid fa-gauge" href="/" />
```

Browse and search icons at **[icons.pureadmin.io](https://icons.pureadmin.io)** — a curated catalog with copy-to-clipboard class names across multiple icon libraries.

## Internationalization (i18n)

Two distinct categories of strings flow through two parallel pipes. They only look like one mechanism in this template because both ends happen to land in Gettext.

```
Your code:        gettext("Hello")
                      │
                      ▼
                  Phoenix Gettext (unmodified)
                      │
                      ▼
                  priv/gettext/<locale>/LC_MESSAGES/default.po


Library code:     PureAdmin.Translations.t("pureAdmin.buttons.cancel")
                      │
                      ▼
                  callback registered via   config :keen_pure_admin, translate: ...
                      │
                      ▼
                  __APP_MODULE__Web.Translations.translate/2   ← lib/.../translations.ex
                      │
                      ▼  (this template's CHOICE — swap for DB / ETS / anything)
                  Gettext.dgettext(__APP_MODULE__Web.Gettext, "pure_admin", key)
                      │
                      ▼
                  priv/gettext/<locale>/LC_MESSAGES/pure_admin.po
```

### Pipe 1 — your app's strings

Standard Phoenix Gettext. Wrap text in `gettext("...")`, run the usual `mix gettext.*` tasks. Nothing PureAdmin-specific — `translations.ex` doesn't touch this pipe at all.

```heex
<h1>{gettext("Welcome to __APP_NAME__")}</h1>
<p>{gettext("Hello %{name}", name: @user.name)}</p>
```

### Pipe 2 — library strings (you can call them too)

`keen_pure_admin` ships English defaults for `pureAdmin.*` keys — button labels, dialog text, settings panel, command palette, a11y. Reuse them from your own LiveViews so your custom UI stays consistent with the library when locales change:

```elixir
defmodule __APP_MODULE__Web.MyLive do
  use __APP_MODULE__Web, :live_view
  import PureAdmin.Translations, only: [t: 1, t: 2]

  def render(assigns) do
    ~H"""
    <%!-- Same "Cancel" the library uses for its dialogs --%>
    <.button>{t("pureAdmin.buttons.cancel")}</.button>

    <%!-- With %{param} interpolation --%>
    <p>{t("pureAdmin.pagination.pages", %{total: @count})}</p>
    """
  end
end
```

If you only need a key once or twice and don't want the import, the fully-qualified call works the same: `PureAdmin.Translations.t("pureAdmin.buttons.save")`.

### Swapping the backend

`PureAdmin.Translations.t/2` calls a callback registered via `config :keen_pure_admin, translate: &...`. The library is agnostic — the callback can fetch from anywhere. This template's callback in `lib/__APP_ID_SNAKE___web/translations.ex` forwards to Gettext under the `pure_admin` domain so library strings live in the same `.po` structure as your app strings. Edit that file to swap the backend:

```elixir
# Sketch — replace the Gettext call with anything else.
defmodule __APP_MODULE__Web.Translations do
  def translate(key, params) do
    case __APP_MODULE__.Translations.fetch(key, current_locale()) do
      nil  -> nil   # falls back to library's English default
      text -> PureAdmin.Translations.interpolate(text, params)
    end
  end
end
```

### Adding a language

```bash
# 1. Wrap any new user-facing strings with gettext()
mix gettext.extract                                # extract to .pot files
mix gettext.merge priv/gettext --locale cs         # create cs/ translations

# 2. Translate priv/gettext/cs/LC_MESSAGES/default.po (your app strings)
#    and priv/gettext/cs/LC_MESSAGES/pure_admin.po (library overrides)

# 3. Set the active locale at runtime (in a plug or LiveView mount/3):
Gettext.put_locale(__APP_MODULE__Web.Gettext, "cs")
```

## Project structure

```
__APP_ID__/
├── assets/js/app.js              # LiveSocket + PureAdminHooks wiring
├── config/
│   ├── config.exs                # Shared config + PureAdmin block + .local.exs import
│   ├── dev.exs                   # Dev defaults
│   ├── prod.exs                  # Prod compile-time config
│   └── runtime.exs               # Runtime env vars (prod)
├── lib/__APP_ID_SNAKE__/         # Business logic, schemas, contexts
├── lib/__APP_ID_SNAKE___web/
│   ├── components/layouts/       # root.html.heex + app.html.heex (PureAdmin layout)
│   ├── controllers/              # PageController, etc.
│   ├── live/                     # LiveView modules (incl. getting_started_live.ex)
│   ├── nav.ex                    # Plug that puts current_path into assigns (for sidebar active state)
│   ├── translations.ex           # keen_pure_admin → Gettext bridge (see i18n section)
│   └── router.ex                 # Routes + browser pipeline
├── priv/static/themes/           # Downloaded Pure Admin themes (via CLI)
└── Makefile                      # Standard dev targets
```

## Learn more

- **Pure Admin:** [pureadmin.io](https://pureadmin.io) — themes, docs, component showcase
- **keen_pure_admin:** [hexdocs.pm/keen_pure_admin](https://hexdocs.pm/keen_pure_admin) — Elixir component library docs
- **Live demo:** [elixir.demo.pureadmin.io](https://elixir.demo.pureadmin.io)
- **Icon catalog:** [icons.pureadmin.io](https://icons.pureadmin.io)
- **Phoenix LiveView:** [hexdocs.pm/phoenix_live_view](https://hexdocs.pm/phoenix_live_view)
