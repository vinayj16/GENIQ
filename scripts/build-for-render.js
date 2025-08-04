#!/usr/bin/env node

/**
 * Build script specifically for Render deployment
 * This ensures the build process is reliable and handles errors gracefully
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const log = (message) => {
  console.log(`🔧 ${message}`);
};

const error = (message) => {
  console.error(`❌ ${message}`);
  process.exit(1);
};

const success = (message) => {
  console.log(`✅ ${message}`);
};

try {
  log('Starting GENIQ build process...');

  // Step 1: Install frontend dependencies
  log('Installing frontend dependencies...');
  execSync('npm ci --only=production', { stdio: 'inherit' });
  success('Frontend dependencies installed');

  // Step 2: Build the frontend
  log('Building React frontend...');
  execSync('npm run build:prod', { stdio: 'inherit' });
  
  // Verify dist folder was created
  if (!fs.existsSync('dist')) {
    error('Frontend build failed - dist folder not created');
  }
  
  // Verify index.html exists
  if (!fs.existsSync('dist/index.html')) {
    error('Frontend build failed - index.html not found');
  }
  
  success('Frontend built successfully');

  // Step 3: Install backend dependencies
  log('Installing backend dependencies...');
  process.chdir('backend');
  execSync('npm ci --only=production', { stdio: 'inherit' });
  success('Backend dependencies installed');

  // Step 4: Verify backend files
  if (!fs.existsSync('server.js')) {
    error('Backend server.js not found');
  }
  
  if (!fs.existsSync('start-prod.js')) {
    error('Backend start-prod.js not found');
  }

  success('Backend verified');
  success('🎉 Build completed successfully!');

  // Log some stats
  const distStats = fs.statSync('../dist');
  log(`Frontend build size: ${(distStats.size / 1024 / 1024).toFixed(2)} MB`);
  
  const indexContent = fs.readFileSync('../dist/index.html', 'utf8');
  const hasReact = indexContent.includes('react') || indexContent.includes('React');
  log(`React app detected: ${hasReact ? 'Yes' : 'No'}`);

} catch (err) {
  error(`Build failed: ${err.message}`);
}