#!/usr/bin/env node

/**
 * Deployment Preparation Script
 * 1. Bundles the server code using esbuild (CRITICAL FIX for "Dynamic require" error).
 * 2. Copies client assets for final deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// --- SERVER BUNDLING FIX (CRITICAL) ---

// 1. List of all Node.js built-in modules that must not be bundled (externalized)
const nodeBuiltins = [
    'assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'console',
    'constants', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http',
    'http2', 'https', 'inspector', 'module', 'net', 'os', 'path', 'perf_hooks',
    'process', 'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder',
    'sys', 'timers', 'tls', 'trace_events', 'tty', 'url', 'util', 'v8', 'vm',
    'worker_threads', 'zlib'
];

// 2. Read package.json to externalize all production dependencies
// NOTE: Make sure 'package.json' is in the project root.
const packageJsonPath = path.resolve(projectRoot, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const allDependencies = Object.keys(pkg.dependencies || {});

const externalDependencies = nodeBuiltins.concat(allDependencies);

async function buildServer() {
    console.log('📦 Bundling server code (server/index.ts) to dist/index.js...');
    try {
        await esbuild.build({
            entryPoints: ['server/index.ts'], // Your server entry point
            bundle: true,
            platform: 'node',
            target: 'node20',
            outfile: 'dist/index.js',
            
            // THE FIX: Telling the bundler to skip bundling these modules/dependencies
            external: externalDependencies, 
            
            sourcemap: false,
            minify: false,
            // Output server bundle in CommonJS format for stability with Express dependencies
            format: 'cjs', 
        });
        
        console.log('✅ Server bundle created successfully!');
        return true;
    } catch (error) {
        console.error('❌ Server bundling failed:', error.message);
        return false;
    }
}
// --- END SERVER BUNDLING FIX ---

async function runDeploymentPrep() {
    console.log('🚀 Preparing deployment...');

    // 1. Run Server Bundling (New Step to fix runtime error)
    if (!(await buildServer())) {
        process.exit(1); // Exit if server build fails
    }

    // 2. Client Asset Copying (Original logic)
    
    // Define paths
    const serverPublicPath = path.join(projectRoot, 'server', 'public');
    const distPublicPath = path.join(projectRoot, 'dist', 'public');

    // Ensure server/public directory exists
    if (!fs.existsSync(serverPublicPath)) {
        fs.mkdirSync(serverPublicPath, { recursive: true });
        console.log('✅ Created server/public directory');
    }

    // Check if dist/public exists (from client build)
    if (fs.existsSync(distPublicPath)) {
        console.log('✅ Found dist/public from client build');
        
        // Copy files from dist/public to server/public
        try {
            copyDir(distPublicPath, serverPublicPath);
            console.log('✅ Copied client build files to server/public');
        } catch (error) {
            console.error('❌ Error copying files:', error.message);
            process.exit(1);
        }
    } else {
        console.log('⚠️ dist/public not found. Assuming client build was not part of this script.');
    }

    // Create basic HTML fallback if needed
    const indexHtmlPath = path.join(serverPublicPath, 'index.html');
    if (!fs.existsSync(indexHtmlPath)) {
        const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HostPilotPro</title>
</head>
<body>
    <div id="root">
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
            <div style="text-align: center;">
                <h1>HostPilotPro</h1>
                <p>Application is starting...</p>
            </div>
        </div>
    </div>
</body>
</html>`;
        
        fs.writeFileSync(indexHtmlPath, fallbackHtml.trim());
        console.log('✅ Created fallback index.html');
    }

    console.log('🎉 Deployment preparation complete!');
}

/**
 * Recursively copy directory contents
 */
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

runDeploymentPrep();
