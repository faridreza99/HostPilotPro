// scripts/build-server.mjs (strict — only copies real built outputs)
import { build } from 'esbuild';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

const root = process.cwd();
const entry = path.resolve(root, 'server', 'index.ts');
const outFile = path.resolve(root, 'dist', 'index.js');

const externals = [
  'bcrypt',
  'pg',
  'express',
  'express-session',
  'connect-pg-simple',
  'multer',
  'node-cron',
  'nanoid',
  'bufferutil',
  'utf-8-validate'
];

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  if (fsSync.cpSync) {
    fsSync.cpSync(src, dest, { recursive: true });
    return;
  }
  const walk = async (s, d) => {
    await fs.mkdir(d, { recursive: true });
    for (const file of await fs.readdir(s)) {
      const sp = path.join(s, file);
      const dp = path.join(d, file);
      const stat = await fs.lstat(sp);
      if (stat.isDirectory()) await walk(sp, dp);
      else await fs.copyFile(sp, dp);
    }
  };
  await walk(src, dest);
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
      logLevel: 'info'
    });

    const dest = path.resolve(root, 'dist', 'public');
    const candidates = [
      path.resolve(root, 'dist', 'public'),
      path.resolve(root, 'client', 'dist'),
      path.resolve(root, 'client', 'build')
    ];

    let copied = false;

    for (const c of candidates) {
      const idx = path.join(c, 'index.html');
      if (fsSync.existsSync(idx)) {
        console.log(`[build-server] copying built client from ${c}`);
        await copyDir(c, dest);
        copied = true;
        break;
      }
    }

    if (!copied) {
      console.error('[build-server] No built client found. Client build failed.');
      process.exit(1);
    }

    console.log('✅ server build complete');
  } catch (err) {
    console.error('✘ build failed', err);
    process.exit(1);
  }
})();
