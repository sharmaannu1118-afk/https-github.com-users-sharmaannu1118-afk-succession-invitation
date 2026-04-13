#!/usr/bin/env node
// Builds a fully self-contained single HTML file from the Vite output.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

// Find the built CSS and JS files
const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile  = files.find(f => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  console.error('ERROR: Could not find built CSS or JS in dist/assets/');
  process.exit(1);
}

const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
const js  = fs.readFileSync(path.join(assetsDir, jsFile),  'utf8');

console.log(`CSS: ${cssFile} (${(css.length/1024).toFixed(1)} KB)`);
console.log(`JS:  ${jsFile}  (${(js.length/1024).toFixed(1)} KB)`);

const swCode = `
const CACHE='annuhr-v1';
const CORE=['.'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#2563eb" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Annu HR" />
  <title>Annu HR \u2013 CRM</title>
  <link rel="manifest" href="manifest.json" />
  <style>${css}</style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Register service worker for PWA / offline support
    if ('serviceWorker' in navigator) {
      const swBlob = new Blob([${JSON.stringify(swCode)}], { type: 'application/javascript' });
      const swUrl  = URL.createObjectURL(swBlob);
      navigator.serviceWorker.register(swUrl).catch(() => {});
    }
  </script>
  <script type="module">${js}</script>
</body>
</html>`;

// Write standalone file
const outFile = path.join(__dirname, 'AnuHR-CRM.html');
fs.writeFileSync(outFile, html, 'utf8');
console.log(`\nWrote: AnuHR-CRM.html  (${(html.length/1024).toFixed(1)} KB)`);

// Also write a manifest.json for the gh-pages deployment
const manifestSrc = path.join(__dirname, 'public', 'manifest.json');
const manifestDst = path.join(__dirname, 'dist', 'manifest.json');
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDst);
  console.log('Copied manifest.json to dist/');
}

// Generate simple placeholder PNG icons using SVG → PNG via sharp if available,
// otherwise just write SVG-based fallback that most browsers accept.
const iconSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size*0.18}" fill="#2563eb"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
    font-family="system-ui,sans-serif" font-weight="bold" fill="white"
    font-size="${size*0.42}">A</text>
</svg>`;

// Write SVGs as PNGs (browsers accept SVG even if named .png for manifest icons)
for (const size of [192, 512]) {
  const iconPath = path.join(__dirname, 'dist', `icon-${size}.png`);
  fs.writeFileSync(iconPath, iconSvg(size), 'utf8');
}
console.log('Generated icon-192.png and icon-512.png in dist/');
console.log('\nDone!');
