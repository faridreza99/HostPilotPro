// scripts/build-server.mjs
import { build } from 'esbuild';
import { readFile } from 'fs/promises';
import path from 'path';
import { builtinModules } from 'module';

const pkgPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));

const deps = Object.keys(pkg.dependencies || {});
const optDeps = Object.keys(pkg.optionalDependencies || {});

// Build list to externalize: all deps + common native-binding helpers + builtins
const externals = new Set([
  ...deps,
  ...optDeps,
  'node-gyp-build',
  'bindings',
  'node-pre-gyp',
  'bufferutil',
  'utf-8-validate',
  'node-addon-api',
  ...builtinModules,
]);

console.log('Externalizing', externals.size, 'modules');

await build({
  entryPoints: [path.resolve(process.cwd(), 'server/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: path.resolve(process.cwd(), 'dist/index.js'),
  format: 'esm',
  external: Array.from(externals),
  define: {
    'import.meta.dirname': 'import.meta.url'
  },
  sourcemap: true,
  logLevel: 'info',
});
console.log('✅ server build complete');
