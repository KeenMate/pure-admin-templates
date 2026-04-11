/**
 * Template Helper for Svelte SPA + Pure Admin
 *
 * Defines data-pa marker format, point definitions, and template operations.
 * The CLI loads this module for feature stripping and recipe step execution.
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * prepare(ctx, helpers) — populate ctx.placeholders for this template.
   *
   * Svelte SPA + Vite. Same identifiers as sveltekit (kebab-case app name,
   * standard npm package manager).
   */
  prepare(ctx, helpers) {
    helpers.setAppId(ctx);
    helpers.setAppName(ctx);
    helpers.setCopyright(ctx);
    helpers.setLogo(ctx);
    helpers.setUserDefaults(ctx);
    helpers.setDefaultTheme(ctx);
    helpers.setThemeIds(ctx);
    helpers.setPackageManager(ctx);
  },

  prepareLate(ctx, helpers) {
    const sidebarItems = helpers.collectSidebarItems(ctx);
    ctx.placeholders.SIDEBAR_ITEMS = sidebarItems.map(item =>
      `\t\t\t\t<SidebarItem href="${item.href}" labelText="${item.label}">\n\t\t\t\t\t{#snippet icon()}<i class="${item.icon}"></i>{/snippet}\n\t\t\t\t</SidebarItem>`
    ).join('\n');

    const themeOpts = helpers.collectThemeOptions(ctx);
    ctx.placeholders.THEME_OPTIONS = themeOpts.map(t =>
      `\t\t{ id: '${t.id}', name: '${t.name}', cssPath: '${t.cssPath}' }`
    ).join(',\n');

    helpers.setThemesConfig(ctx);

    // Project info summary for home page
    const summary = helpers.collectCreateSummary(ctx);
    const on = summary.featuresOn.map(f => `<Badge variant="success">${f}</Badge>`).join(' ');
    const off = summary.featuresOff.map(f => `<Badge variant="secondary">${f}</Badge>`).join(' ');
    const themes = summary.themes.map(t =>
      t === summary.defaultTheme
        ? `<Badge variant="primary">${t}</Badge>`
        : `<Badge>${t}</Badge>`
    ).join(' ');

    ctx.placeholders.PROJECT_INFO = [
      `<Card titleText="Project Info">`,
      `\t<Heading level={4}>Template</Heading>`,
      `\t<Paragraph><code>${summary.template}</code></Paragraph>`,
      `\t<Heading level={4}>Features</Heading>`,
      `\t<Paragraph>${on || '<em>none</em>'}</Paragraph>`,
      summary.featuresOff.length > 0 ? `\t<Paragraph class="text-muted">Disabled: ${off}</Paragraph>` : '',
      `\t<Heading level={4}>Themes</Heading>`,
      `\t<Paragraph>${themes || '<em>none</em>'}</Paragraph>`,
      `\t<Paragraph class="text-muted">Default: <strong>${summary.defaultTheme}</strong> (${summary.defaultMode})</Paragraph>`,
      `\t<Heading level={4}>Created with</Heading>`,
      `\t<CodeBlock language="bash">${summary.createCommand}</CodeBlock>`,
      `</Card>`,
    ].filter(Boolean).join('\n');
  },

  markerFormat: {
    htmlStart: (id) => `<!-- data-pa="${id}" -->`,
    htmlEnd: (id) => `<!-- /data-pa="${id}" -->`,
    jsStart: (id) => `// data-pa="${id}"`,
    jsEnd: (id) => `// /data-pa="${id}"`,
  },

  points: {
    // ── index.html ──
    'font-awesome-cdn': { file: 'index.html', type: 'block' },
    'floating-ui-cdn': { file: 'index.html', type: 'block' },
    'page-loader-css': { file: 'index.html', type: 'block' },
    'page-loader-html': { file: 'index.html', type: 'block' },
    'page-loader-script': { file: 'index.html', type: 'block' },

    // ── App.svelte — imports ──
    'navbar-imports': { file: 'src/App.svelte', type: 'block' },
    'sidebar-imports': { file: 'src/App.svelte', type: 'block' },
    'profile-imports': { file: 'src/App.svelte', type: 'block' },
    'settings-imports': { file: 'src/App.svelte', type: 'block' },
    'footer-imports': { file: 'src/App.svelte', type: 'block' },
    'popover-imports': { file: 'src/App.svelte', type: 'block' },

    // ── App.svelte — state & functions ──
    'profile-state': { file: 'src/App.svelte', type: 'block' },
    'profile-toggle': { file: 'src/App.svelte', type: 'block' },
    'settings-data': { file: 'src/App.svelte', type: 'block' },
    'page-loader-onmount': { file: 'src/App.svelte', type: 'block' },

    // ── App.svelte — components ──
    'navbar-component': { file: 'src/App.svelte', type: 'block' },
    'navbar-profile-snippet': { file: 'src/App.svelte', type: 'block' },
    'sidebar-component': { file: 'src/App.svelte', type: 'block' },
    'sidebar-items': { file: 'src/App.svelte', type: 'slot' },
    'footer-component': { file: 'src/App.svelte', type: 'block' },
    'profile-panel-component': { file: 'src/App.svelte', type: 'block' },
    'settings-panel-component': { file: 'src/App.svelte', type: 'block' },
    'popover-container': { file: 'src/App.svelte', type: 'block' },
  },

  /**
   * Template operations — technology-specific file manipulation.
   * Called by the CLI pipeline via { action: "call", op: "operationName", args: [...] }
   * All operations receive (appDir, ...args) and mutate files in place.
   */
  operations: {
    /**
     * Add a dependency to package.json
     * @param {string} appDir - project root
     * @param {string} name - package name
     * @param {string} version - version specifier
     * @param {"dependencies"|"devDependencies"} [section="dependencies"]
     */
    addDependency(appDir, name, version, section = 'dependencies') {
      const pkgPath = path.join(appDir, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      pkg[section] = pkg[section] || {};
      pkg[section][name] = version;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    },

    /**
     * Set a value in pureadmin.json
     * @param {string} appDir
     * @param {string} key - dot-notation path (e.g. "themes.audi.version")
     * @param {*} value
     */
    setConfigValue(appDir, key, value) {
      const cfgPath = path.join(appDir, 'pureadmin.json');
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
      const keys = key.split('.');
      let obj = cfg;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = obj[keys[i]] || {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n');
    },

    /**
     * Inject text into a file at a marker position
     * @param {string} appDir
     * @param {string} file - relative path
     * @param {string} marker - text to find
     * @param {string} content - text to inject
     * @param {"before"|"after"|"replace"} [position="after"]
     */
    inject(appDir, file, marker, content, position = 'after') {
      const filePath = path.join(appDir, file);
      if (!fs.existsSync(filePath)) return false;
      let text = fs.readFileSync(filePath, 'utf-8');
      if (!text.includes(marker)) return false;

      if (position === 'replace') {
        text = text.replace(marker, content);
      } else if (position === 'before') {
        text = text.replace(marker, content + marker);
      } else {
        text = text.replace(marker, marker + content);
      }
      fs.writeFileSync(filePath, text);
      return true;
    },

    /**
     * Add a <script> or <link> tag to index.html <head>
     * @param {string} appDir
     * @param {string} tag - full HTML tag
     */
    addHeadTag(appDir, tag) {
      const htmlPath = path.join(appDir, 'index.html');
      let html = fs.readFileSync(htmlPath, 'utf-8');
      html = html.replace('</head>', `\t\t${tag}\n\t</head>`);
      fs.writeFileSync(htmlPath, html);
    },

    /**
     * Add a route entry to src/routes/index.ts
     * @param {string} appDir
     * @param {string} routePath - e.g. "/login"
     * @param {string} componentName - e.g. "Login"
     * @param {string} componentFile - e.g. "./Login.svelte"
     */
    addRoute(appDir, routePath, componentName, componentFile) {
      const routesPath = path.join(appDir, 'src', 'routes', 'index.ts');
      if (!fs.existsSync(routesPath)) return false;
      let content = fs.readFileSync(routesPath, 'utf-8');

      // Add import
      const importLine = `import ${componentName} from '${componentFile}';`;
      const lastImport = content.lastIndexOf('import ');
      const lineEnd = content.indexOf('\n', lastImport);
      content = content.slice(0, lineEnd + 1) + importLine + '\n' + content.slice(lineEnd + 1);

      // Add route entry before closing }
      const routeEntry = `\t'${routePath}': ${componentName},`;
      content = content.replace(/\n};/, `,\n${routeEntry}\n};`);

      fs.writeFileSync(routesPath, content);
      return true;
    },

    /**
     * Add a sidebar item to the layout
     * @param {string} appDir
     * @param {string} href - e.g. "#/login"
     * @param {string} label - display label
     * @param {string} iconMarkup - e.g. '<i class="fas fa-lock"></i>' or '<Lock size={18} />'
     */
    addSidebarItem(appDir, href, label, iconMarkup) {
      // Find the sidebar-items slot marker or end of sidebar
      const layoutFiles = [
        path.join(appDir, 'src', 'App.svelte'),
        path.join(appDir, 'src', 'routes', '+layout.svelte'),
      ];
      for (const filePath of layoutFiles) {
        if (!fs.existsSync(filePath)) continue;
        let content = fs.readFileSync(filePath, 'utf-8');
        const marker = '<!-- /data-pa="sidebar-items" -->';
        if (!content.includes(marker)) continue;

        const item = `\t\t\t\t<SidebarItem href="${href}" labelText="${label}">\n\t\t\t\t\t{#snippet icon()}${iconMarkup}{/snippet}\n\t\t\t\t</SidebarItem>\n\t\t\t\t`;
        content = content.replace(marker, item + marker);
        fs.writeFileSync(filePath, content);
        return true;
      }
      return false;
    },
  },
};
