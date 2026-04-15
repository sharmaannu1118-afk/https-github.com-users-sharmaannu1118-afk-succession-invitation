#!/usr/bin/env node
// Builds a fully self-contained single HTML file from the Vite output.
const fs = require('fs');
const path = require('path');

const distDir    = path.join(__dirname, 'dist');
const assetsDir  = path.join(distDir, 'assets');
const publicDir  = path.join(__dirname, 'public');

// Find the built CSS and JS files
const files  = fs.readdirSync(assetsDir);
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

// Standalone HTML — references sw.js and manifest.json as sibling files
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#2563eb" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Annu HR" />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  <link rel="apple-touch-icon" href="icon.svg" />
  <link rel="manifest" href="manifest.json" />
  <title>Annu HR \u2013 CRM</title>
  <style>${css}</style>
</head>
<body>
  <div id="root"></div>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
          .then(r => console.log('SW registered, scope:', r.scope))
          .catch(e => console.log('SW registration failed:', e));
      });
    }
  </script>
  <script type="module">${js}</script>
</body>
</html>`;

// Write standalone file
const outFile = path.join(__dirname, 'AnuHR-CRM.html');
fs.writeFileSync(outFile, html, 'utf8');
console.log(`\nWrote: AnuHR-CRM.html  (${(html.length/1024).toFixed(1)} KB)`);

// Copy PWA assets to dist/
for (const file of ['manifest.json', 'sw.js', 'icon.svg', 'favicon.svg']) {
  const src = path.join(publicDir, file);
  const dst = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`Copied ${file} → dist/`);
  }
}

console.log('\nDone!');
