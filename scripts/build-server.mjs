// scripts/build-server.mjs
import { build } from 'esbuild';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

const root = process.cwd();
const entry = path.resolve(root, 'server', 'index.ts');
const outFile = path.resolve(root, 'dist', 'index.js');

const externals = [
  'bcrypt',
  'node-gyp-build',
  'bindings',
  'node-pre-gyp',
  'bufferutil',
  'utf-8-validate',
  'form-data',
  'combined-stream',
  'safe-buffer',
  'axios',
  'pg',
  'connect-pg-simple',
  'express-session',
  'express',
  'multer',
  'node-cron',
  'nanoid',
  'vite',
  '@vitejs/plugin-react',
  '@replit/vite-plugin-cartographer',
  '@replit/vite-plugin-runtime-error-modal',
  '@babel/core',
  '@babel/preset-typescript',
];

async function copyDirIfIndexExists(src, dest) {
  try {
    const index = path.join(src, 'index.html');
    if (!fsSync.existsSync(index)) return false;
    await fs.mkdir(dest, { recursive: true });

    if (typeof fsSync.cp === 'function') {
      // node >=16.7
      fsSync.cp(src, dest, { recursive: true });
    } else {
      // fallback recursive copy
      const copyDir = async (s, d) => {
        await fs.mkdir(d, { recursive: true });
        for (const name of await fs.readdir(s)) {
          const sPath = path.join(s, name);
          const dPath = path.join(d, name);
          const stat = await fs.lstat(sPath);
          if (stat.isDirectory()) await copyDir(sPath, dPath);
          else await fs.copyFile(sPath, dPath);
        }
      };
      await copyDir(src, dest);
    }
    return true;
  } catch (err) {
    console.warn('[build-server] copyDirIfIndexExists failed', err);
    return false;
  }
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

    // Defensive: ensure dist/public contains index.html
    const clientCandidates = [
      path.resolve(root, 'dist', 'public'), // expected outDir
      path.resolve(root, 'client', 'dist'),
      path.resolve(root, 'client', 'build'),
      path.resolve(root, 'client', 'out'),
      path.resolve(root, 'client'),
    ];

    const dest = path.resolve(root, 'dist', 'public');
    const destIndex = path.join(dest, 'index.html');

    if (!fsSync.existsSync(destIndex)) {
      let copiedFrom = null;
      for (const c of clientCandidates) {
        const ok = await copyDirIfIndexExists(c, dest);
        if (ok) {
          copiedFrom = c;
          break;
        }
      }
      if (copiedFrom) {
        console.log(`[build-server] copied client build from ${copiedFrom} -> ${dest}`);
      } else {
        console.warn('[build-server] client index.html not found in any candidate paths; dist/public/index.html missing');
      }
    } else {
      console.log('[build-server] dist/public/index.html already exists, skipping copy');
    }

    console.log('✅ server build complete');
  } catch (err) {
    console.error('✘ build failed', err);
    process.exit(1);
  }
})();
