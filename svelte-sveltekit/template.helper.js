/**
 * Template Helper for SvelteKit + Pure Admin
 *
 * Defines how to find data-pa points in template files.
 * The CLI loads this module and uses it to remove/inject content
 * based on enabled/disabled features.
 *
 * Point types:
 *   - block: content between start/end markers (removable)
 *   - slot:  insertion point for generated content (injectable)
 */

module.exports = {
  // Marker format used in template files
  markerFormat: {
    // In Svelte/HTML files
    htmlStart: (id) => `<!-- data-pa="${id}" -->`,
    htmlEnd: (id) => `<!-- /data-pa="${id}" -->`,
    // In JS/TS sections of .svelte files
    jsStart: (id) => `// data-pa="${id}"`,
    jsEnd: (id) => `// /data-pa="${id}"`,
  },

  points: {
    // ── app.html ──
    'font-awesome-cdn': {
      file: 'src/app.html',
      type: 'block',
    },
    'floating-ui-cdn': {
      file: 'src/app.html',
      type: 'block',
    },
    'page-loader-css': {
      file: 'src/app.html',
      type: 'block',
    },
    'page-loader-html': {
      file: 'src/app.html',
      type: 'block',
    },
    'page-loader-script': {
      file: 'src/app.html',
      type: 'block',
    },

    // ── +layout.svelte — imports ──
    'navbar-imports': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'sidebar-imports': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'profile-imports': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'settings-imports': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'footer-imports': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'popover-imports': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },

    // ── +layout.svelte — state & functions ──
    'profile-state': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'profile-toggle': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'settings-data': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'page-loader-onmount': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },

    // ── +layout.svelte — components ──
    'navbar-component': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'navbar-profile-snippet': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'sidebar-component': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'sidebar-items': {
      file: 'src/routes/+layout.svelte',
      type: 'slot',
    },
    'footer-component': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'profile-panel-component': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'settings-panel-component': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
    'popover-container': {
      file: 'src/routes/+layout.svelte',
      type: 'block',
    },
  },
};
