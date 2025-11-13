// scripts/build-server.mjs
import { build } from 'esbuild';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

const root = process.cwd();
const entry = path.resolve(root, 'server', 'index.ts');
const outFile = path.resolve(root, 'dist', 'index.js');

const externals = [
  'bcrypt','node-gyp-build','bindings','node-pre-gyp','bufferutil','utf-8-validate',
  'form-data','combined-stream','safe-buffer','axios','pg','connect-pg-simple',
  'express-session','express','multer','node-cron','nanoid',
  'vite','@vitejs/plugin-react','@replit/vite-plugin-cartographer',
  '@replit/vite-plugin-runtime-error-modal','@babel/core','@babel/preset-typescript',
];

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    if (typeof fsSync.cpSync === 'function') {
      // fast, reliable sync copy if available
      fsSync.cpSync(src, dest, { recursive: true });
      return true;
    }
    // fallback: manual copy
    const copyDirRecursive = async (s, d) => {
      await fs.mkdir(d, { recursive: true });
      for (const name of await fs.readdir(s)) {
        const sPath = path.join(s, name);
        const dPath = path.join(d, name);
        const stat = await fs.lstat(sPath);
        if (stat.isDirectory()) await copyDirRecursive(sPath, dPath);
        else await fs.copyFile(sPath, dPath);
      }
    };
    await copyDirRecursive(src, dest);
    return true;
  } catch (err) {
    console.warn('[build-server] copyDir failed', { src, dest, err: String(err) });
    return false;
  }
}

async function copyIfBuiltClientFound(dest) {
  const candidates = [
    path.resolve(root, 'dist', 'public'),
    path.resolve(root, 'client', 'dist'),
    path.resolve(root, 'client', 'build'),
    path.resolve(root, 'client', 'out'),
  ];

  for (const c of candidates) {
    try {
      const idx = path.join(c, 'index.html');
      if (fsSync.existsSync(idx)) {
        console.log(`[build-server] found client index at ${idx} — copying ${c} -> ${dest}`);
        const ok = await copyDir(c, dest);
        if (ok) return { ok: true, from: c };
      }
    } catch (e) {
      // continue
    }
  }
  return { ok: false };
}

(async () => {
  try {
    await build({
      entryPoints: [entry],
      bundle: true,
      platform: 'node',
      target: ['node18'],
      outfile: outFile,
      format: 'esm',
      sourcemap: true,
      minify: false,
      external: externals,
      define: {
        'import.meta.dirname': 'import.meta.url',
      },
      logLevel: 'info',
    });

    console.log('✅ esbuild server bundle complete');

    const dest = path.resolve(root, 'dist', 'public');
    const destIndex = path.join(dest, 'index.html');

    // If dist/public/index.html already exists, skip copy
    if (fsSync.existsSync(destIndex)) {
      console.log('[build-server] dist/public/index.html already exists — skipping copy');
    } else {
      // Try known built-client locations
      const result = await copyIfBuiltClientFound(dest);
      if (result.ok) {
        console.log(`[build-server] copied built client from ${result.from} -> ${dest}`);
      } else {
        // Last-resort fallback: if client folder exists and contains index.html (or any index), copy client -> dist/public
        const clientRoot = path.resolve(root, 'client');
        const clientIndex = path.join(clientRoot, 'index.html');
        if (fsSync.existsSync(clientIndex)) {
          console.warn('[build-server] No built client found; falling back to copying client/ -> dist/public (client root index.html found). This is a fallback; you should build the client for production.');
          const ok2 = await copyDir(clientRoot, dest);
          if (ok2) {
            console.log('[build-server] fallback copy client/ -> dist/public complete');
          } else {
            console.warn('[build-server] fallback copy client/ -> dist/public failed');
          }
        } else {
          console.warn('[build-server] client index.html not found in any candidate locations; dist/public/index.html missing');
        }
      }
    }

    console.log('✅ server build script finished');
  } catch (err) {
    console.error('✘ build failed', err);
    process.exit(1);
  }
})();
