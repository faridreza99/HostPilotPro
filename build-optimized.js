#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('🔄 Starting optimized build...');

const buildProcess = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=8192'
  }
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Build completed successfully');
  } else {
    console.log('⚠️ Build failed, but deployment may retry automatically');
  }
  process.exit(code);
});
