#!/usr/bin/env node

/**
 * Build Optimization Script for Large Applications
 * Handles memory management and build timeouts
 */

import { spawn } from 'child_process';
import { performance } from 'perf_hooks';

console.log('🔧 Starting optimized build process...');

const startTime = performance.now();
const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=4096',
    VITE_BUILD_TIMEOUT: '300000'
  }
});

buildProcess.on('close', (code) => {
  const endTime = performance.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  if (code === 0) {
    console.log(`✅ Build completed successfully in ${duration} seconds`);
    process.exit(0);
  } else {
    console.log(`❌ Build failed with code ${code} after ${duration} seconds`);
    console.log('💡 Build may succeed on retry with more memory allocation');
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('Build process error:', error);
  process.exit(1);
});

// Handle timeout
setTimeout(() => {
  console.log('⚠️  Build timeout reached - killing process');
  buildProcess.kill('SIGTERM');
  setTimeout(() => {
    buildProcess.kill('SIGKILL');
  }, 5000);
}, 5 * 60 * 1000); // 5 minute timeout
