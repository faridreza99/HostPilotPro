// scripts/build-server.mjs
import { build } from 'esbuild';
import { readFile } from 'fs/promises';
import path from 'path';
import { builtinModules } from 'module';

const root = process.cwd();
const pkgPath = path.resolve(root, 'package.json');
const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));

// Collect packages to externalize (dependencies + dev + optional)
const deps = Object.keys(pkg.dependencies || {});
const devDeps = Object.keys(pkg.devDependencies || {});
const optDeps = Object.keys(pkg.optionalDependencies || {});

// Common native / runtime helpers and optional native modules
const extra = [
  'node-gyp-build',
  'bindings',
  'node-pre-gyp',
  'node-addon-api',
  'bufferutil',
  'utf-8-validate',
  'safe-buffer',
  'node-pre-gyp',
  'nan',
  // also externalize packages that may try to load package.json at build-time
  '@babel/preset-typescript',
  'lightningcss',
  'v8-compile-cache'
];

const externals = new Set([
  ...deps,
  ...devDeps,
  ...optDeps,
  ...extra,
  ...builtinModules,
]);

console.log('Externalizing', externals.size, 'modules (sample):', Array.from(externals).slice(0,8));

await build({
  entryPoints: [path.resolve(root, 'server/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: path.resolve(root, 'dist/index.js'),
  format: 'esm',
  external: Array.from(externals),
  define: {
    'import.meta.dirname': 'import.meta.url'
  },
  sourcemap: true,
  logLevel: 'info',
});
console.log('✅ server build complete');
