// server/vite.ts (replace or add these functions)

import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

/**
 * Returns the first existing directory that looks like a built client.
 * Checks a list of sensible candidate paths and logs what it checks.
 */
async function findBuiltClient(): Promise<string> {
  const candidates: string[] = [];

  // 1) repo-root/dist/public (what your vite.config.ts outDir resolves to)
  candidates.push(path.resolve(process.cwd(), 'dist', 'public'));

  // 2) repo-root/client/dist (common default)
  candidates.push(path.resolve(process.cwd(), 'client', 'dist'));

  // 3) repo-root/client/build (some setups use build/)
  candidates.push(path.resolve(process.cwd(), 'client', 'build'));

  // 4) repo-root/dist (if you built into dist directly)
  candidates.push(path.resolve(process.cwd(), 'dist'));

  // 5) paths relative to this compiled file (useful when running from dist)
  //    e.g. when node is started from project root and code lives at dist/index.js,
  //    the following resolves to project_root/dist/public etc.
  const __filename = fileURLToPath(import.meta.url);
  const compiledDir = path.dirname(__filename); // e.g. /opt/render/project/src/dist
  candidates.push(path.resolve(compiledDir, '..', 'dist', 'public'));
  candidates.push(path.resolve(compiledDir, '..', 'dist'));
  candidates.push(path.resolve(compiledDir, 'client', 'dist'));
  candidates.push(path.resolve(compiledDir, 'dist', 'public'));

  // 6) fallback: relative to compiledDir directly (some CI layouts)
  candidates.push(path.resolve(compiledDir, 'public'));
  candidates.push(path.resolve(compiledDir, 'build'));

  // De-duplicate while preserving order
  const seen = new Set<string>();
  const uniq = candidates.filter((p) => {
    const np = path.normalize(p);
    if (seen.has(np)) return false;
    seen.add(np);
    return true;
  });

  // Check each candidate for index.html
  const tried: string[] = [];
  for (const candidate of uniq) {
    tried.push(candidate);
    try {
      const indexPath = path.join(candidate, 'index.html');
      await fs.access(indexPath);
      // found index.html -> good client build dir
      console.log(`[vite] serveStatic: found client build at: ${candidate}`);
      return candidate;
    } catch {
      // not found - continue
    }
  }

  // If we reached here, nothing matched
  const msg = `Could not find built client files. Checked: ${tried.join(', ')}. Make sure your Vite build output exists and contains index.html.`;
  throw new Error(msg);
}

/**
 * serveStatic(app)
 * - Finds built client using findBuiltClient()
 * - Serves static assets and falls back to index.html for SPA routes
 */
export async function serveStatic(app: express.Express) {
  const publicDir = await findBuiltClient();

  // Mount static server
  app.use(express.static(publicDir));

  // SPA fallback
  app.get('*', async (req, res, next) => {
    try {
      const indexHtml = await fs.readFile(path.join(publicDir, 'index.html'), 'utf-8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(indexHtml);
    } catch (err) {
      next(err);
    }
  });
}
