// build-server.mjs
import { build } from 'esbuild';
import path from 'path';

const root = process.cwd();
const entry = path.resolve(root, 'server', 'index.ts');
const outFile = path.resolve(root, 'dist', 'index.js');

// Externalize native or runtime-resolved modules that must remain in node_modules at runtime
// Add any other modules that produce "Dynamic require of ..." or native-binding errors
const externals = [
  // Common native or dynamic modules
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

  // keep express and big server libs external if you prefer (optional)
  // 'express', 'pg', 'connect-pg-simple', 'express-session',

  // keep Vite plugins/external tooling out as well (optional)
  '@replit/vite-plugin-cartographer',
  '@replit/vite-plugin-runtime-error-modal',
  'vite',
];

(async () => {
  try {
    await build({
      entryPoints: [entry],
      bundle: true,
      platform: 'node',        // <--- important: treat Node built-ins as builtins (events, fs, url, etc)
      target: ['node18'],
      outfile: outFile,
      format: 'esm',          // keep ESM if your runtime uses it
      sourcemap: true,
      minify: false,
      external: externals,
      define: {
        // keep any import.meta.* use working — map dirname to import.meta.url
        'import.meta.dirname': 'import.meta.url',
      },
      logLevel: 'info',
      // optional: increase concurrency or memory via esbuild options if you need
    });

    console.log('✅ server build complete');
  } catch (err) {
    console.error('✘ build failed', err);
    process.exit(1);
  }
})();
