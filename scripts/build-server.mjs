// build-server.mjs
import { build } from 'esbuild';
import path from 'path';

const root = process.cwd();
const entry = path.resolve(root, 'server', 'index.ts');
const outFile = path.resolve(root, 'dist', 'index.js');

const externals = [
  // Node builtins (safe to keep external)
  'path','fs','os','crypto','stream','http','https','zlib','net','util','buffer',

  // libraries that perform dynamic require / native bindings — keep external so Node loads them at runtime
  'axios',
  'form-data',
  'combined-stream',
  'safe-buffer',
  'bufferutil',
  'utf-8-validate',
  'bcrypt',
  'node-gyp-build',
  'bindings',
  'node-pre-gyp',
  // tooling libs you previously externalized
  'express','body-parser','depd','drizzle-kit','@babel/preset-typescript','lightningcss',
  // Vite and dev-only plugins (if they appear in server bundle)
  '@replit/vite-plugin-cartographer','@replit/vite-plugin-runtime-error-modal','vite'
];

(async () => {
  try {
    await build({
      entryPoints: [entry],
      bundle: true,
      platform: 'neutral',         // use neutral so esbuild won't try to shim Node builtins; we'll externalize explicitly
      target: ['node18'],
      outfile: outFile,
      format: 'esm',
      sourcemap: true,
      minify: false,
      external: externals,
      define: {
        // ensure import.meta.dirname is available in your code (previously you used import.meta.dirname)
        'import.meta.dirname': 'import.meta.url'
      },
      logLevel: 'info',
      // optional: increase memory/timeouts for big projects
      // metafile: true,
    });
    console.log('✅ server build complete');
  } catch (err) {
    console.error('✘ build failed', err);
    process.exit(1);
  }
})();
