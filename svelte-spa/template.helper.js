/**
 * Template Helper for Svelte SPA + Pure Admin
 *
 * Defines how to find data-pa points in template files.
 * The CLI loads this module and uses it to remove/inject content
 * based on enabled/disabled features.
 */

module.exports = {
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
};
