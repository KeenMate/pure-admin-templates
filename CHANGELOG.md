# Changelog

## 2026-06-21

### Added
- **Phoenix `--lucide` icon provider.** Third option alongside `--font-awesome` and `--heroicons` (declared in `features.icons.cli`). Pairs with keen_pure_admin 1.3's `<.icon>` dispatcher + `:icon_callback`. When passed, the generated app gets:
  - ~27 Lucide outline SVGs at `priv/static/assets/icons/lucide/*.svg` covering the heroicons-curated canonical set (rocket, gauge, briefcase, users, settings, log-out, etc.)
  - `<App>Web.Icons` module at `lib/<app>_web/icons.ex` — pattern-matches `lucide-X` names into `<img src="/assets/icons/lucide/X.svg">`, falls back to FA-style `<i class>` for everything else
  - `icon_callback: {<App>Web.Icons, :render}` appended to `config :keen_pure_admin` in `config.exs`
  - Inline `__ICON:name__` placeholders and sidebar/profile `icon=` attrs both resolve to `lucide-X` strings that flow through `<.icon>`
  - Empty `ICON_CDN` slot in `root.html.heex` (Lucide ships as bundled SVGs — no external CDN)

  When `--lucide` is not passed, `icons.ex` and the SVG directory are deleted (`unless: "lucide"` steps) so the FA / heroicons / `--no-icons` paths are unchanged.

- **`setPureAdminConfig` operation accepts `{__raw__: "..."}` values.** Lets recipe steps inject raw Elixir literals (tuples, MFAs, atoms) into the `:keen_pure_admin` config block instead of only quoted strings. Used by the new `icon_callback` step to emit `{<App>Web.Icons, :render}` as a real tuple. Backward-compatible — string/number/bool/null values still work as before.

## 2026-04-24

### Added
- **Phoenix `--form-demo` opt-in feature.** New CLI flag scaffolds a fully-wired Phoenix/LiveView form demo with per-session ETS cache (`__APP_MODULE__.FormCache` + `Sweeper`), session-id cookie plug (`__APP_MODULE__Web.SessionPlug`), and `__APP_MODULE__Web.FormDemoLive` at `/form-demo`. Showcases `<.simple_form>` + `field={@form[:x]}` binding, inline edit, toast+undo on delete, popconfirm for bulk clear, force-errors toggle, relative timestamps via `PureAdmin.DateTime`, and per-session sliding-TTL persistence. Files copied 1:1 from `keen_pure_admin/demo` with namespace + ETS-table substitution; recipe steps patch `application.ex` (children) and `router.ex` (browser pipeline plug + route) only when the feature is enabled, and the four demo files are deleted otherwise. Sidebar entry wrapped in `data-pa="form-demo-sidebar"` so it appears only when opted in.

### Changed
- **`keen_pure_admin` dep bumped to `~> 1.1`** in the Phoenix template (was `~> 1.0`). Required for the new `field={@form[:x]}` form binding, `PureAdmin.DateTime`, and `PureFlash.push_flash(replace: true)` APIs that the bundled demo pages now use.
- **Phoenix `settings_live.ex` rewritten on the v1.1 form binding.** Single `<.simple_form for={@form}>` spans the General + Notifications cards in the left column; each input wrapped in `<.form_group field={@form[:x]}>` + `<.form_label>` + bare `<.input>`/`<.textarea>`/`<.select>` (which auto-render inline errors). Saved-banner switched from a `saved` assign + `<.alert :if>` to `PureFlash.push_flash("settings", "success", ..., replace: true)` so repeated saves replace the previous flash instead of stacking.
- **Phoenix `users_live.ex` joined column uses `PureAdmin.DateTime.relative/2`.** Mock data switched from string dates (`"2024-01-15"`) to `Date` sigils (`~D[2024-01-15]`); rendered as `"3 months ago"` with the full date in the cell `title` tooltip via `PureAdmin.DateTime.format(date, :long_date)`. Delete button now wired to `phx-click="delete"` with optimistic remove + `PureToast.push_toast` carrying an Undo action that restores the row.
- **Phoenix `pages/form_live.ex` page generator** rewrapped with `<.form_group>` + `<.form_label>` + bare input components — the previous `<.input label="...">` calls passed an attr the v1.1 components don't accept (silently dropping the label).
- **Phoenix `getting_started_live.ex` gains a "Forms & DateTime helpers (v1.1)" card** between Key Concepts and i18n. Covers the `field={@form[:x]}` binding pattern with a code example, `PureAdmin.DateTime.relative/2` with a code example pointing at `users_live.ex`, and the toast+undo pattern (and a forward reference to the form-demo for the popconfirm bulk-clear story).

### Changed
- **Phoenix demo pages synced to SvelteKit parity.** Three bundled LiveViews under `elixir-phoenix-liveview/template/lib/.../live/` rewritten to mirror their Svelte counterparts using `keen_pure_admin` components:
  - `getting_started_live.ex` — was 4 cards (intro, project structure, quick links). Now 7 cards mirroring `getting-started/+page.svelte`: Project Structure (`<.code_block>`), Routing (with Adding-a-New-Page `<.basic_list>` + Elixir/HEEx code examples), Layout Components (`<.table>` of every layout component + purpose), Theming (CLI command block + theme switching example), Key Concepts (2-column `<.grid>` — LiveView Lifecycle / Component Patterns), Internationalization (Gettext walkthrough), Resources. All strings wrapped in `gettext()`.
  - `users_live.ex` — was 3 mock users (id/name/email/status), now 8 (matching Svelte) with name/email/role/status/joined fields. Adds 3 stat cards above the table (Total / Active / Admins) using `<.grid>` + `<.column md="1-3">`. Table gains `is_compact is_hover is_striped is_responsive` and an `:tools` slot Add-User button. Role badges use primary/info/secondary variants; status uses success/warning. Actions column has view/edit/delete xs icon-only buttons in a `<.button_group>`.
  - `settings_live.ex` — was a single-column "Application" form with App Name + Default Locale. Now mirrors Svelte's 2-column `<.grid>`: General (Input + Textarea + Select for timezone) + Notifications (2 `<.checkbox>`) on the left; Application Info (`<.fields>` of version/framework/UI/CSS) + Danger Zone (`<.alert variant="danger">` + Clear Cache outlined / Reset App `<.button_group>`) on the right. Save feedback shifted from `put_flash` to a `saved`-driven `<.alert variant="success" is_dismissible>` with a `dismiss-saved` event (matches Svelte's local-state pattern).
- **Phoenix sidebar gains a `Management` submenu** wrapping Users + Settings (mirrors the SvelteKit/SPA sidebar — was previously flat). Uses `<.sidebar_submenu>` with `is_open` driven by `current_path`.
- **All Phoenix sidebar items now use icon placeholders** (`__ICON_GETTING_STARTED__`, `__ICON_DASHBOARD__`, `__ICON_BRIEFCASE__`, `__ICON_USERS__`, `__ICON_SETTINGS__`) populated by `template.helper.js` via `helpers.resolveIconAttr()`. Previously only Dashboard was provider-aware; the rest hardcoded `fa-solid fa-X` classes that silently broke under `--heroicons`.

### Changed
- **Project Info card on home page** — rebuilt from raw `<div class="pa-fields">` markup using the proper `<Fields isLinear hasBorder={false}>` + `<Field labelText=…>` components (Svelte) and `<.fields is_linear is_no_border>` + `<.field label=…>` (Phoenix). Pattern is the "Linear Minimal" data-display style: ultra-clean label/value rows, no badge decoration, default theme bolded for weight-only contrast.
- **Project Info card now mirrors the README's App Profile section.** Same field order and naming (App ID, Display name, Template, Preset, Themes, Default mode, Default variant, Icon provider, Package manager, Copyright, Logo, Features enabled, Features disabled, Pages), same `_(source)_` provenance suffixes per row. Fed by an extended `collectCreateSummary()` in pure-admin-cli that exposes all the fields setProfiles uses.
- **All template page generators converted to component-driven markup.** Across `svelte-sveltekit/pages/` and `svelte-spa/pages/` (8 files): `<input class="pa-input">` → `<Input>`, `<select>` → `<Select>`, `<textarea>` → `<Textarea>`, `<button class="pa-btn">` → `<Button>`, `<table class="pa-table">` → `<Table>`, `<span class="pa-badge">` → `<Badge>`, `<div class="pa-fields">` + `<div class="pa-field">` → `<Fields>` + `<Field>`, master-detail's `<div class="pa-detail-view">` + `<div class="pa-detail-panel">` → `<DetailView>` + `<DetailPanel>` with the `main` snippet pattern. Form pages additionally use `<Form>`, `<FormGroup>`, `<FormLabel>`.
- **Phoenix template files converted to components.** `app.html.heex` profile panel sign-out → `<.button variant="danger" is_block>`. `home.html.heex` PureAdmin link → `<.pa_link>`, three external link-buttons (Themes/Icons/Docs) → `<.button href=… target=… is_block>`.
- **Navbar profile button uses `<ProfileButton>` / `<.navbar_profile_btn>`** in both Svelte templates' layout/App.svelte (replaces a raw `<button class="pa-header__profile-btn">` block with manual icon + name spans). Imports added to the existing `data-pa="profile-imports"` marker so it's only pulled in when the profile-panel feature is enabled.

### Result
Zero raw `pa-*` HTML primitives remain in any template-author-facing file across all three templates — every styling hook now flows through the component library. The only lingering `pa-*` class reference is `pa-header__profile-btn` inside `profile_panel.js`'s `document.querySelector(...)` outside-click detector, which is genuinely uncomponentizable (imperative DOM access needs a selector).

### Added
- **`--bare` flag** strips bundled demo routes (Users + Settings) from generated apps, leaving Dashboard + Getting Started. Works across all three templates via the new `demo-pages` feature with `cliDisable: "--bare"` in `template.json`. Markup is wrapped in `data-pa="demo-pages-nav"` / `data-pa="demo-pages-sidebar"` markers; recipe steps delete the corresponding route directories / LiveView files when the flag is set. Phoenix also patches the router to drop the Users/Settings routes.
- **Phoenix demo pages.** New bundled LiveViews under `template/lib/__APP_ID_SNAKE___web/live/`: `users_live.ex` (mock user table), `settings_live.ex` (config form), `getting_started_live.ex` (project tour with quick links). Sidebar entries + router patches added. Brings Phoenix to parity with the Svelte templates' default scaffold.
- **Svelte i18n setup.** New `src/lib/i18n-setup.ts` (commented examples for sync, lazy-fetched, dynamic-import, and API-backed translation loading) + `src/lib/locales/en.json` (~30 `app.*` keys) + `setupI18n()` wired into the layout. All bundled and generated pages route strings through `$_('app.*')`.
- **Phoenix gettext wiring.** New `lib/__APP_ID_SNAKE___web/translations.ex` bridges `keen_pure_admin`'s pureAdmin.* keys to Gettext under the `pure_admin` domain. Wired via a `config/config.exs` patch. App-level strings in `app.html.heex`, `home.html.heex`, and `dashboard_live.ex` wrapped with `gettext(...)`. The dashboard now ships with an "Internationalization (i18n)" guide card explaining the upgrade path.
- **Phoenix `gettext` is now required** (was opt-out via `--no-gettext`). Templates use `gettext()` calls and the lib's translation hook unconditionally; users wanting a no-gettext Phoenix scaffold should use `mix phx.new --no-gettext` directly.

### Changed
- **Recent Activity card uses `<Timeline>` / `<TimelineItem>`** in both Svelte templates' bundled dashboard. Replaces the old `<ActivityFeed>` + `<ActivityFeedItem>` markup that depended on external `ui-avatars.com` `<img>` calls — Timeline uses colored dots (primary/success/danger/warning), no network roundtrip.
- **Quick Actions card uses vertical `<ButtonGroup>`** with full-width primary/secondary buttons (matching pure-admin demo). Drops the colored mixed-icon `<QuickActions>` layout in all three templates. Phoenix uses `<.button_group is_vertical>`.
- **`@keenmate/svelte-pure-admin` bumped to `^1.6.2`** in both Svelte templates' `package.json` (needed for `<ProfileButton>` and `<Timeline>` exports).
- **Project Info card label "Pages" → "Generated pages"** so it honestly describes what the field shows (pages emitted by `--pages`-flag generators, not all routes in the app). Mirrored in the README App Profile section.
- **Project Info card gains a "Demo pages" row** alongside "Generated pages". Shows what's actually scaffolded by default — "Users, Settings (pass --bare to remove)" — and "none (--bare)" when the flag was used. Hidden when the template doesn't declare a `demo-pages` feature.
- **Actions column moved to first position with `class="col-auto"`** in all four list-style files: `pages/list.svelte` (sveltekit + spa generators), `template/src/routes/users/+page.svelte` (sveltekit demo), `template/src/routes/Users.svelte` (spa demo), `pages/list_live.ex` (Phoenix generator), `template/lib/.../live/users_live.ex` (Phoenix demo). Each row now contains a `<ButtonGroup>` / `<.button_group>` with three icon-only `xs` buttons (👁️ View / ✏️ Edit / 🗑️ Delete). Matches pure-admin demo's documented convention.

### Fixed
- **Phoenix LiveView component API mismatches in the demo pages.** `users_live.ex` was using raw `<thead>/<tbody>` markup but the `<.table>` component requires `rows={...}` + `<:col>` slots. `settings_live.ex` was using Phoenix Forms (`field={@form[:foo]}`) but `keen_pure_admin`'s `<.input>` / `<.select>` take plain `name`/`value`/`options` attrs. `getting_started_live.ex`'s `<.code_block>` used `{"multi-line string"}` interpolation that triggered Elixir heredoc-indentation warnings. All three rewritten with the correct APIs.

---

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
