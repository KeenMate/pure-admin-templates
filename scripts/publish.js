#!/usr/bin/env node
/**
 * Pack and upload templates to pureadmin.io.
 *
 * Usage: node scripts/publish.js [template-name] [--server URL]
 *   No args = publish all templates
 *   e.g. node scripts/publish.js svelte-sveltekit
 *   e.g. node scripts/publish.js --server http://localhost:8888
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// Parse args
let target = null;
let serverUrl = 'https://pureadmin.io';
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--server' && args[i + 1]) {
    serverUrl = args[++i];
  } else if (!args[i].startsWith('--')) {
    target = args[i];
  }
}

// Resolve API key: .pureadmin.json > pureadmin.json > ~/.pureadmin.json > env
function resolveApiKey() {
  const sources = [
    path.join(rootDir, '.pureadmin.json'),
    path.join(rootDir, 'pureadmin.json'),
  ];
  const home = process.env.HOME || process.env.USERPROFILE;
  if (home) sources.push(path.join(home, '.pureadmin.json'));

  for (const src of sources) {
    try {
      const cfg = JSON.parse(fs.readFileSync(src, 'utf-8'));
      if (cfg.apiKey) return cfg.apiKey;
    } catch {}
  }
  return process.env.PUREADMIN_API_KEY || '';
}
const apiKey = resolveApiKey();

if (!apiKey) {
  console.error('Error: No API key. Set apiKey in .pureadmin.json, pureadmin.json, ~/.pureadmin.json, or PUREADMIN_API_KEY env.');
  process.exit(1);
}

// First pack
console.log('Packing...');
const packArgs = target ? [target] : [];
require('child_process').execSync(
  `node "${path.join(__dirname, 'pack.js')}" ${packArgs.join(' ')}`,
  { stdio: 'inherit' }
);

// Find ZIPs to upload
const zips = fs.readdirSync(distDir)
  .filter(f => f.endsWith('.zip'))
  .filter(f => !target || f.startsWith(target));

if (zips.length === 0) {
  console.error('No ZIPs found to publish.');
  process.exit(1);
}

console.log(`\nPublishing to ${serverUrl}...`);

async function uploadZip(zipName) {
  const zipPath = path.join(distDir, zipName);
  const fileData = fs.readFileSync(zipPath);
  const boundary = '----PureAdminTemplateBoundary' + Date.now();

  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="template"; filename="${zipName}"\r\nContent-Type: application/zip\r\n\r\n`),
    fileData,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const url = new URL('/api/templates/upload', serverUrl);
  const isHttps = url.protocol === 'https:';
  const mod = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const req = mod.request({
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
        'Authorization': `Bearer ${apiKey}`,
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, ...json });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  for (const zip of zips) {
    process.stdout.write(`  ${zip}... `);
    try {
      const result = await uploadZip(zip);
      if (result.ok) {
        console.log(`${result.status === 'unchanged' ? 'unchanged' : 'uploaded'} (${result.id} v${result.version})`);
      } else {
        console.log(`FAILED: ${result.error || result.raw || 'unknown error'}`);
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }
  }
  console.log('\nDone.');
  process.exit(0);
})();
