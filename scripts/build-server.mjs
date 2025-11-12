// scripts/build-server.mjs
import { build } from 'esbuild';
import path from 'path';

const root = process.cwd();
const entry = path.resolve(root, 'server', 'index.ts');
const outFile = path.resolve(root, 'dist', 'index.js');

const externals = [
  // native / dynamic / runtime modules (keep these external)
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

  // Vite/Babel/dev-tooling — do not bundle these server-side
  'vite',
  '@vitejs/plugin-react',
  '@replit/vite-plugin-cartographer',
  '@replit/vite-plugin-runtime-error-modal',
  '@babel/core',
  '@babel/preset-typescript',

  // optionally keep other large libs external
  // add any package that throws "Could not resolve ..." or "Dynamic require ..." errors
];

(async () => {
  try {
    await build({
      entryPoints: [entry],
      bundle: true,
      platform: 'node',          // treat node builtins as builtins (events, url, fs, etc)
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

    console.log('✅ server build complete');
  } catch (err) {
    console.error('✘ build failed', err);
    process.exit(1);
  }
})();
