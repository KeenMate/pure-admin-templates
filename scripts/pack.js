#!/usr/bin/env node
/**
 * Pack a template into a ZIP for upload to pureadmin.io.
 *
 * Usage: node scripts/pack.js <template-name>
 *   e.g. node scripts/pack.js svelte-sveltekit
 *
 * Output: dist/<template-id>-<version>.zip
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const target = process.argv[2];

if (!target) {
  // Pack all templates
  const entries = fs.readdirSync(rootDir).filter(e => {
    if (e === 'schemas' || e === 'scripts' || e === 'dist' || e.startsWith('.')) return false;
    const full = path.join(rootDir, e);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'template.json'));
  });
  for (const entry of entries) packTemplate(entry);
} else {
  packTemplate(target);
}

function packTemplate(name) {
  const templateDir = path.join(rootDir, name);
  const manifestPath = path.join(templateDir, 'template.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`  Error: ${name}/template.json not found`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const id = manifest.id || name;
  const version = manifest.version || '0.0.0';

  console.log(`  Packing ${id} v${version}...`);

  fs.mkdirSync(distDir, { recursive: true });
  const zipName = `${id}-${version}.zip`;
  const zipPath = path.join(distDir, zipName);

  // Remove old zip if exists
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  // Create zip from the template directory
  // Include: template.json, template.helper.js, template/, pages/
  const absZipPath = path.resolve(zipPath);

  try {
    // Use tar on Windows Git Bash or zip on Unix
    const isWin = process.platform === 'win32';
    if (isWin) {
      // PowerShell Compress-Archive
      const items = ['template.json'];
      if (fs.existsSync(path.join(templateDir, 'template.helper.js'))) items.push('template.helper.js');
      if (fs.existsSync(path.join(templateDir, 'template'))) items.push('template');
      if (fs.existsSync(path.join(templateDir, 'pages'))) items.push('pages');

      const itemPaths = items.map(i => `"${path.join(templateDir, i)}"`).join(', ');
      execSync(
        `powershell -Command "Compress-Archive -Path ${itemPaths} -DestinationPath '${absZipPath}' -Force"`,
        { stdio: 'pipe' }
      );
    } else {
      const includes = [
        'template.json',
        fs.existsSync(path.join(templateDir, 'template.helper.js')) ? 'template.helper.js' : null,
        fs.existsSync(path.join(templateDir, 'template')) ? 'template/' : null,
        fs.existsSync(path.join(templateDir, 'pages')) ? 'pages/' : null,
      ].filter(Boolean);

      execSync(`zip -r "${absZipPath}" ${includes.join(' ')}`, { cwd: templateDir, stdio: 'pipe' });
    }

    const size = (fs.statSync(zipPath).size / 1024).toFixed(1);
    console.log(`  -> dist/${zipName} (${size} KB)`);
  } catch (err) {
    console.error(`  Error packing ${id}: ${err.message}`);
    process.exit(1);
  }
}
