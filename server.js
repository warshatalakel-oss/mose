import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const distPath = path.join(__dirname, 'dist');

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// Serve static files from dist directory if present
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback compatible with Express 4 and Express 5
  app.use((_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use(express.static(__dirname));

  app.use((_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
