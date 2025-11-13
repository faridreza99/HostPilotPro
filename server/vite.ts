// server/vite.ts
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import { fileURLToPath } from 'url';

export function log(msg: string) {
  console.log(`[vite] ${msg}`);
}

/**
 * Returns the first existing directory that looks like a built client.
 * Checks a list of sensible candidate paths and logs what it checks.
 */
export async function findBuiltClient(): Promise<string> {
  const candidates: string[] = [];

  // 1) repo-root/dist/public (what your vite.config.ts outDir resolves to)
  candidates.push(path.resolve(process.cwd(), 'dist', 'public'));

  // 2) repo-root/client/dist (common default)
  candidates.push(path.resolve(process.cwd(), 'client', 'dist'));

  // 3) repo-root/client/build (some setups use build/)
  candidates.push(path.resolve(process.cwd(), 'client', 'build'));

  // 4) repo-root/dist (if you built into dist directly)
  candidates.push(path.resolve(process.cwd(), 'dist'));

  // 5) paths relative to this compiled file
  const __filename = fileURLToPath(import.meta.url);
  const compiledDir = path.dirname(__filename);
  candidates.push(path.resolve(compiledDir, '..', 'dist', 'public'));
  candidates.push(path.resolve(compiledDir, '..', 'dist'));
  candidates.push(path.resolve(compiledDir, 'client', 'dist'));
  candidates.push(path.resolve(compiledDir, 'dist', 'public'));

  // 6) fallback: relative to compiledDir directly
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

  const tried: string[] = [];
  for (const candidate of uniq) {
    tried.push(candidate);
    try {
      const indexPath = path.join(candidate, 'index.html');
      await fs.access(indexPath);
      console.log(`[vite] serveStatic: found client build at: ${candidate}`);
      return candidate;
    } catch {
      // not found - continue
    }
  }

  const msg = `Could not find built client files. Checked: ${tried.join(', ')}. Make sure your Vite build output exists and contains index.html.`;
  throw new Error(msg);
}

/**
 * serveStatic(app)
 */
export async function serveStatic(app: express.Express) {
  const publicDir = await findBuiltClient();

  app.use(express.static(publicDir));

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

/**
 * setupVite(app, server)
 * lightweight dev setup stub — dynamic import used in server/index.ts so this is only used in dev.
 * If you want full Vite middleware in dev, replace this with actual createServer(...) middleware.
 */
export async function setupVite(app: any, server: any) {
  try {
    // dynamic import so bundlers won't include Vite in production bundles
    const { createServer } = await import('vite');
    const vite = await createServer({
      configFile: false,
      server: { middlewareMode: true },
    } as any);
    app.use((vite as any).middlewares);
    log('[setupVite] Vite dev middleware mounted');
    return vite;
  } catch (err) {
    log(`[setupVite] failed to mount Vite dev middleware: ${(err as Error).message}`);
    throw err;
  }
}
