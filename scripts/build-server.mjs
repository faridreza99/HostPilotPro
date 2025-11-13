// scripts/build-server.mjs (strict — only copies real built outputs)
import { build } from 'esbuild';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

const root = process.cwd();
const entry = path.resolve(root, 'server', 'index.ts');
const outFile = path.resolve(root, 'dist', 'index.js');

const externals = [ /* same externals as before */ ];

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  if (typeof fsSync.cpSync === 'function') {
    fsSync.cpSync(src, dest, { recursive: true });
    return true;
  }
  const copyRecursive = async (s, d) => {
    await fs.mkdir(d, { recursive: true });
    for (const name of await fs.readdir(s)) {
      const sPath = path.join(s, name);
      const dPath = path.join(d, name);
      const stat = await fs.lstat(sPath);
      if (stat.isDirectory()) await copyRecursive(sPath, dPath);
      else await fs.copyFile(sPath, dPath);
    }
  };
  await copyRecursive(src, dest);
  return true;
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
      define: { 'import.meta.dirname': 'import.meta.url' },
      logLevel: 'info',
    });

    const dest = path.resolve(root, 'dist', 'public');
    const builtCandidates = [
      path.resolve(root, 'dist', 'public'),
      path.resolve(root, 'client', 'dist'),
      path.resolve(root, 'client', 'build'),
    ];

    // Only copy from *built* locations that actually have index.html
    let copied = false;
    for (const c of builtCandidates) {
      const idx = path.join(c, 'index.html');
      if (fsSync.existsSync(idx)) {
        console.log(`[build-server] copying built client from ${c} -> ${dest}`);
        await copyDir(c, dest);
        copied = true;
        break;
      }
    }

    if (!copied) {
      console.error('[build-server] No built client found in expected locations; dist/public/index.html missing. Ensure client build runs before server build.');
      // fail build - important so production cannot serve raw sources
      process.exit(1);
    }

    console.log('✅ server build complete');
  } catch (err) {
    console.error('✘ build failed', err);
    process.exit(1);
  }
})();
