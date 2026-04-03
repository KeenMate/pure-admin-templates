#!/usr/bin/env node
/**
 * Compute SHA-256 checksums for template files and update template.json manifests.
 *
 * Usage: node scripts/update-checksums.js [template-name]
 *   No args = update all templates
 *   With arg = update only that template (e.g. "svelte-sveltekit")
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');

function sha256(filePath) {
  const content = fs.readFileSync(filePath);
  return 'sha256:' + crypto.createHash('sha256').update(content).digest('hex');
}

function sha256String(str) {
  return 'sha256:' + crypto.createHash('sha256').update(str, 'utf-8').digest('hex');
}

function walkFiles(dir, base) {
  const results = {};
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const relPath = path.join(base, entry).replace(/\\/g, '/');
    if (fs.statSync(fullPath).isDirectory()) {
      Object.assign(results, walkFiles(fullPath, relPath));
    } else {
      results[relPath] = sha256(fullPath);
    }
  }
  return results;
}

function updateTemplate(templateDir) {
  const manifestPath = path.join(templateDir, 'template.json');
  if (!fs.existsSync(manifestPath)) {
    console.log(`  Skipping ${path.basename(templateDir)} (no template.json)`);
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const name = manifest.name || path.basename(templateDir);
  console.log(`  ${name}`);

  const checksums = {};

  // Hash template/ files
  const templateSubdir = path.join(templateDir, 'template');
  if (fs.existsSync(templateSubdir)) {
    checksums.files = walkFiles(templateSubdir, '');
    console.log(`    template/ files: ${Object.keys(checksums.files).length}`);
  }

  // Hash pages/ files
  const pagesDir = path.join(templateDir, 'pages');
  if (fs.existsSync(pagesDir)) {
    checksums.pages = walkFiles(pagesDir, '');
    console.log(`    pages/ files: ${Object.keys(checksums.pages).length}`);
  }

  // Hash template.helper.js
  const helperPath = path.join(templateDir, 'template.helper.js');
  if (fs.existsSync(helperPath)) {
    checksums.helper = sha256(helperPath);
  }

  // Metadata hash (canonical JSON of descriptive fields)
  const metadataFields = ['name', 'version', 'description', 'content', 'author', 'license', 'tags'];
  const metadata = {};
  for (const key of metadataFields) {
    if (manifest[key] !== undefined) metadata[key] = manifest[key];
  }
  checksums.metadata = sha256String(JSON.stringify(metadata, null, 0));

  manifest.checksums = checksums;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`    checksums updated`);
}

// Main
const target = process.argv[2];
const entries = fs.readdirSync(rootDir).filter(e => {
  if (e === 'schemas' || e === 'scripts' || e.startsWith('.')) return false;
  const full = path.join(rootDir, e);
  return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'template.json'));
});

if (target) {
  const dir = path.join(rootDir, target);
  if (!fs.existsSync(dir)) {
    console.error(`Template not found: ${target}`);
    process.exit(1);
  }
  updateTemplate(dir);
} else {
  console.log('Updating checksums for all templates...');
  for (const entry of entries) {
    updateTemplate(path.join(rootDir, entry));
  }
}

console.log('Done.');
