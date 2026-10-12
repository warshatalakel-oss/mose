import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const distPath = path.join(__dirname, 'dist');
const distIndexPath = path.join(distPath, 'index.html');

// Build production bundle if missing
if (!fs.existsSync(distIndexPath)) {
  console.log('Production build not found at dist/index.html. Running npm run build...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  } catch (err) {
    console.error('Failed to run npm run build:', err);
  }
}

// Health check endpoints for Cloud Run and GCP load balancer probes
app.get(['/health', '/_health', '/healthz'], (_req, res) => {
  res.status(200).send('OK');
});

// Serve static assets from dist directory
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: '1h',
    index: false,
  }));
}

// SPA fallback: always serve dist/index.html for any frontend route
app.use((_req, res) => {
  if (fs.existsSync(distIndexPath)) {
    res.sendFile(distIndexPath);
  } else {
    res.status(503).type('text/plain').send('Application is building, please refresh in a few seconds.');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
