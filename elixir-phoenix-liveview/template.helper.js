/**
 * Template Helper for Phoenix LiveView + Pure Admin
 *
 * Defines data-pa marker format, point definitions, and template operations
 * for Elixir/Phoenix projects.
 *
 * IMPORTANT: This template uses scaffold.runFirst, meaning the CLI runs
 * `mix phx.new` BEFORE copying our template/ files. So template/ contains
 * only the files we want to OVERWRITE on top of the generated Phoenix project.
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * prepare(ctx, helpers) — populate ctx.placeholders for this template.
   *
   * Called by the CLI after buildContext but before the scaffold command
   * runs. `helpers` is the CLI's preparator library — call whichever ones
   * your template needs. Custom derivations can go inline.
   *
   * For Phoenix/Elixir we need:
   *   - APP_ID        (the app name as passed, kebab-case OK for dir name)
   *   - APP_ID_SNAKE  (snake_case for Elixir `otp_app` name + lib/ paths)
   *   - APP_MODULE    (PascalCase for module names)
   *   - APP_NAME      (human display name for navbar/footer)
   *   - COPYRIGHT     (footer copyright text)
   *   - DEFAULT_THEME (theme slug for root.html.heex link)
   *   - DEFAULT_MODE  (dark/light, drives FOUC script)
   *
   * We explicitly SKIP the Node/Svelte-only ones (PM, PM_RUN, USER_*,
   * THEME_OPTIONS, SIDEBAR_ITEMS) — Phoenix templates don't use them.
   */
  prepare(ctx, helpers) {
    helpers.setAppId(ctx);
    helpers.setAppIdSnake(ctx);
    helpers.setAppModule(ctx);
    helpers.setAppName(ctx);
    helpers.setCopyright(ctx);
    helpers.setDefaultTheme(ctx);

    // Icon resolver for this template's provider (font-awesome or heroicons)
    const icon = (name) => helpers.resolveIconAttr(name, ctx.iconProvider);

    // Profile panel items — collect objects, render as Phoenix HEEx
    const profileItems = helpers.collectProfileItems(ctx);
    ctx.placeholders.PROFILE_ITEMS = profileItems.map(item =>
      `        <.profile_nav_item href="${item.href}" icon="${icon(item.icon)}">${item.label}</.profile_nav_item>`
    ).join('\n');

    // Sidebar icon attrs (resolved per provider — string for `icon=` attr,
    // unlike __ICON:name__ which expands to inline markup)
    ctx.placeholders.ICON_GETTING_STARTED = icon('rocket');
    ctx.placeholders.ICON_DASHBOARD = icon('gauge');
    ctx.placeholders.ICON_BRIEFCASE = icon('briefcase');
    ctx.placeholders.ICON_USERS = icon('users');
    ctx.placeholders.ICON_SETTINGS = icon('settings');
    ctx.placeholders.ICON_FORM_DEMO = icon('pen-to-square');

    // Brand — Phoenix uses runtime config (PureAdmin.Config.app_name)
    ctx.brand = helpers.collectBrand(ctx);
    // Footer — handled by PureAdmin.Config at runtime
    ctx.footer = helpers.collectFooter(ctx);
  },

  /**
   * prepareLate — called after features + themes + pages are resolved.
   * Renders the project info summary for the home page.
   */
  prepareLate(ctx, helpers) {
    // Icon CDN — only include the Font Awesome CDN when FA is the provider.
    // Heroicons ship with Phoenix (no CDN needed). When the provider is
    // 'none' (e.g. --no-icons), leave the placeholder empty so the generated
    // root.html.heex has no mention of icons at all.
    if (ctx.iconProvider === 'font-awesome') {
      ctx.placeholders.ICON_CDN = '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />';
    } else if (ctx.iconProvider === 'heroicons') {
      ctx.placeholders.ICON_CDN = '    <%!-- Using Heroicons (built into Phoenix, no CDN needed) --%>';
    } else {
      ctx.placeholders.ICON_CDN = '';
    }

    // README profile blocks (org + app)
    helpers.setProfiles(ctx);

    // Project info summary for home page — rendered with the Pure Admin
    // "Linear Minimal" data-display pattern: ultra-clean label/value rows,
    // no decoration. Mirrors the README's App Profile section exactly:
    // same field order, same naming, same _(source)_ provenance suffixes.
    const summary = helpers.collectCreateSummary(ctx);
    const p = summary.provenance;
    const themes = summary.themes
      .map(t => t === summary.defaultTheme ? `<strong>${t}</strong>` : t)
      .join(', ') || '<em>none</em>';

    const field = (label, value, source) => {
      if (value == null || value === '') return '';
      const src = source ? ` <small class="text-color-2">(${source})</small>` : '';
      return `    <.field label="${label}">${value}${src}</.field>`;
    };

    ctx.placeholders.PROJECT_INFO = [
      `<.card title_text="Project Info">`,
      `  <.fields is_linear is_no_border>`,
      field('App ID', summary.appId, p.appId),
      field('Display name', summary.displayName, p.displayName),
      field('Template', `<code>${summary.template}</code>`, p.template),
      field('Preset', summary.preset || '<em>none</em>', p.preset),
      field('Themes', themes, p.themes),
      field('Default mode', summary.defaultMode, p.defaultMode),
      field('Default variant', summary.defaultVariant, p.defaultVariant),
      field('Icon provider', summary.iconProvider, p.iconProvider),
      field('Package manager', summary.pm, p.pm),
      field('Copyright', summary.copyright, p.copyright),
      field('Logo', summary.logo),
      field('Features enabled', summary.featuresOn.join(', ') || '<em>none</em>'),
      summary.featuresOff.length > 0
        ? field('Features disabled', `<span class="text-color-2">${summary.featuresOff.join(', ')}</span>`)
        : '',
      field('Generated pages', summary.pages.join(', ') || '<em>none</em>'),
      summary.demoPages ? field('Demo pages', summary.demoPages) : '',
      `  </.fields>`,
      `  <div class="mt-3">`,
      `    <span class="text-color-2 text-sm">Created with</span>`,
      `    <.code_block language="bash">${summary.createCommand}</.code_block>`,
      `  </div>`,
      `</.card>`,
    ].filter(Boolean).join('\n');
  },

  /**
   * Marker formats per file type:
   *  - .heex / .html.heex / .html → HTML comments
   *  - .ex / .exs → Elixir line comments
   *  - .js → JS line comments
   */
  markerFormat: {
    htmlStart: (id) => `<!-- data-pa="${id}" -->`,
    htmlEnd: (id) => `<!-- /data-pa="${id}" -->`,
    jsStart: (id) => `// data-pa="${id}"`,
    jsEnd: (id) => `// /data-pa="${id}"`,
    elixirStart: (id) => `# data-pa="${id}"`,
    elixirEnd: (id) => `# /data-pa="${id}"`,
  },

  points: {
    // ── lib/__APP_ID_SNAKE___web/components/layouts/root.html.heex ──
    'font-awesome-cdn': { file: 'lib/__APP_ID_SNAKE___web/components/layouts/root.html.heex', type: 'block' },
    'floating-ui-cdn': { file: 'lib/__APP_ID_SNAKE___web/components/layouts/root.html.heex', type: 'block' },

    // ── lib/__APP_ID_SNAKE___web/components/layouts/app.html.heex ──
    'navbar-component': { file: 'lib/__APP_ID_SNAKE___web/components/layouts/app.html.heex', type: 'block' },
    'sidebar-component': { file: 'lib/__APP_ID_SNAKE___web/components/layouts/app.html.heex', type: 'block' },
    'sidebar-items': { file: 'lib/__APP_ID_SNAKE___web/components/layouts/app.html.heex', type: 'slot' },
    'footer-component': { file: 'lib/__APP_ID_SNAKE___web/components/layouts/app.html.heex', type: 'block' },
    'profile-panel-component': { file: 'lib/__APP_ID_SNAKE___web/components/layouts/app.html.heex', type: 'block' },
    'settings-panel-component': { file: 'lib/__APP_ID_SNAKE___web/components/layouts/app.html.heex', type: 'block' },

    // ── config/config.exs ──
    'ecto-config': { file: 'config/config.exs', type: 'block' },
  },

  /**
   * Template operations — Elixir/Phoenix-specific file manipulation.
   * Called by the CLI pipeline via { action: "call", op: "operationName", args: [...] }
   * All operations receive (appDir, ...args) and mutate files in place.
   */
  operations: {
    /**
     * Add a Hex dependency to mix.exs.
     *
     * Inserts `{:name, "~> version"}` into the deps() list. If the dep already
     * exists, updates the version.
     *
     * Usage: { "action": "call", "op": "addDependency", "args": ["keen_pure_admin", "~> 1.0"] }
     */
    addDependency(appDir, name, version) {
      const mixPath = path.join(appDir, 'mix.exs');
      if (!fs.existsSync(mixPath)) return false;
      let content = fs.readFileSync(mixPath, 'utf-8');

      const newDep = `{:${name}, "${version.startsWith('~>') || version.startsWith('>=') || version.startsWith('==') ? version : '~> ' + version}"}`;

      // Check if dep already exists — match `{:name,` to find it
      const existing = new RegExp(`\\{\\s*:${name}\\s*,[^}]+\\}`, 'g');
      if (existing.test(content)) {
        content = content.replace(existing, newDep);
        fs.writeFileSync(mixPath, content);
        return true;
      }

      // Insert into the deps list. Find `defp deps do` then the opening `[` then insert.
      // We append it as the last element before the closing `]`.
      const depsBlockRe = /(defp\s+deps\s+do\s*\n\s*\[)([\s\S]*?)(\n\s*\]\s*\n\s*end)/;
      const match = content.match(depsBlockRe);
      if (!match) return false;

      const [, opening, body, closing] = match;
      // Detect indent from the body
      const bodyIndent = (body.match(/\n(\s+)\{/) || [, '      '])[1];
      // Trim trailing whitespace from body, then add comma + new dep
      const trimmedBody = body.replace(/\s*$/, '');
      const needsComma = trimmedBody && !trimmedBody.endsWith(',');
      const newBody = trimmedBody + (needsComma ? ',' : '') + '\n' + bodyIndent + newDep;
      content = content.replace(depsBlockRe, opening + newBody + closing);
      fs.writeFileSync(mixPath, content);
      return true;
    },

    /**
     * Add a path to static_paths/0 in lib/<app>_web.ex
     *
     * Usage: { "action": "call", "op": "addStaticPath", "args": ["themes"] }
     */
    addStaticPath(appDir, pathName) {
      // Find the *_web.ex file in lib/
      const libDir = path.join(appDir, 'lib');
      if (!fs.existsSync(libDir)) return false;
      const webFile = fs.readdirSync(libDir).find(f => f.endsWith('_web.ex'));
      if (!webFile) return false;

      const webPath = path.join(libDir, webFile);
      let content = fs.readFileSync(webPath, 'utf-8');

      // Match: def static_paths, do: ~w(assets fonts images favicon.ico robots.txt)
      const re = /(def\s+static_paths,\s+do:\s+~w\()([^)]*)(\))/;
      const match = content.match(re);
      if (!match) return false;

      const [, opening, paths, closing] = match;
      const pathList = paths.trim().split(/\s+/);
      if (pathList.includes(pathName)) return true;
      pathList.push(pathName);
      content = content.replace(re, opening + pathList.join(' ') + closing);
      fs.writeFileSync(webPath, content);
      return true;
    },

    /**
     * Add a LiveView route to lib/<app>_web/router.ex inside the main browser scope.
     *
     * Usage: { "action": "call", "op": "addRoute", "args": ["/dashboard", "DashboardLive"] }
     */
    addRoute(appDir, routePath, liveModule) {
      const webDir = fs.readdirSync(path.join(appDir, 'lib')).find(f => f.endsWith('_web'));
      if (!webDir) return false;
      const routerPath = path.join(appDir, 'lib', webDir, 'router.ex');
      if (!fs.existsSync(routerPath)) return false;

      let content = fs.readFileSync(routerPath, 'utf-8');
      const routeLine = `    live "${routePath}", ${liveModule}`;

      // Insert before the closing of the first scope "/" block
      const scopeRe = /(scope\s+"\/",\s+\w+\s+do[\s\S]*?pipe_through\s+:browser\s*\n)([\s\S]*?)(\n\s*end)/;
      const match = content.match(scopeRe);
      if (!match) return false;

      const [, header, body, closing] = match;
      if (body.includes(routeLine.trim())) return true; // already added
      content = content.replace(scopeRe, header + body + '\n' + routeLine + closing);
      fs.writeFileSync(routerPath, content);
      return true;
    },

    /**
     * Add a sidebar item to lib/<app>_web/components/layouts/app.html.heex
     *
     * Inserts before the `<!-- /data-pa="sidebar-items" -->` marker.
     *
     * Usage: { "action": "call", "op": "addSidebarItem",
     *          "args": ["/dashboard", "Dashboard", "fa-solid fa-gauge"] }
     */
    addSidebarItem(appDir, href, label, iconClass) {
      const webDir = fs.readdirSync(path.join(appDir, 'lib')).find(f => f.endsWith('_web'));
      if (!webDir) return false;
      const layoutPath = path.join(appDir, 'lib', webDir, 'components', 'layouts', 'app.html.heex');
      if (!fs.existsSync(layoutPath)) return false;

      let content = fs.readFileSync(layoutPath, 'utf-8');
      const marker = '<!-- /data-pa="sidebar-items" -->';
      if (!content.includes(marker)) return false;

      const item = `      <.sidebar_item label="${label}" icon="${iconClass}" href="${href}" is_active={@current_path == "${href}"} />\n      `;
      content = content.replace(marker, item + marker);
      fs.writeFileSync(layoutPath, content);
      return true;
    },

    /**
     * Set one or more values in config/config.exs under the :keen_pure_admin app config.
     *
     * Accepts either:
     *   - Two args: (key, value) — set/update a single key
     *   - One arg: object map — set/update multiple keys at once
     *
     * Existing keys are updated; new keys are appended. The block is always
     * rewritten as a clean, comma-correct Elixir keyword list.
     *
     * Usage:
     *   { "action": "call", "op": "setPureAdminConfig", "args": ["app_name", "My App"] }
     *   { "action": "call", "op": "setPureAdminConfig", "args": [{ "app_name": "My App", "app_version": "1.0.0" }] }
     */
    setPureAdminConfig(appDir, keyOrMap, value) {
      const cfgPath = path.join(appDir, 'config', 'config.exs');
      if (!fs.existsSync(cfgPath)) return false;
      let content = fs.readFileSync(cfgPath, 'utf-8');

      // Normalize input to a map
      const updates = typeof keyOrMap === 'object' ? keyOrMap : { [keyOrMap]: value };

      // Render an Elixir literal for a JS value
      function literal(v) {
        if (v === null || v === undefined) return 'nil';
        if (typeof v === 'boolean') return String(v);
        if (typeof v === 'number') return String(v);
        return `"${String(v).replace(/"/g, '\\"')}"`;
      }

      // Parse the existing :keen_pure_admin block (if any) into a key-order list
      // Block format: `config :keen_pure_admin,\n  key1: val1,\n  key2: val2\n`
      const blockRe = /config\s+:keen_pure_admin,\s*\n((?:\s+\w+:\s+[^\n]+,?\s*\n)+)/;
      const existing = {};
      const order = [];
      const match = content.match(blockRe);
      if (match) {
        const body = match[1];
        const keyLineRe = /\s+(\w+):\s+([^,\n]+),?\s*\n/g;
        let m;
        while ((m = keyLineRe.exec(body)) !== null) {
          const k = m[1];
          if (!(k in existing)) order.push(k);
          existing[k] = m[2].trim();
        }
      }

      // Apply updates: existing keys are overwritten, new keys appended
      for (const [k, v] of Object.entries(updates)) {
        if (!(k in existing)) order.push(k);
        existing[k] = literal(v);
      }

      // Render new block
      const lines = order.map(k => `  ${k}: ${existing[k]}`);
      const renderedBlock = `config :keen_pure_admin,\n${lines.join(',\n')}\n`;

      if (match) {
        // Replace existing block in place
        content = content.replace(blockRe, renderedBlock);
      } else {
        // Insert new block before the import_config line (or at the end)
        const newBlock = `\n# PureAdmin configuration\n${renderedBlock}\n`;
        if (content.match(/\n\s*#\s*Import\s+environment[\s\S]*?import_config/)) {
          content = content.replace(/(\n\s*#\s*Import\s+environment[\s\S]*?import_config)/, newBlock + '$1');
        } else {
          content += newBlock;
        }
      }
      fs.writeFileSync(cfgPath, content);
      return true;
    },
  },
};
