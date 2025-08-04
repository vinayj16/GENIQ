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

  // Step 1: Clean any previous builds
  log('Cleaning previous builds...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Step 2: Install frontend dependencies (including dev dependencies for build)
  log('Installing frontend dependencies...');
  process.env.NODE_ENV = 'development'; // Ensure dev dependencies are installed
  execSync('npm install', { stdio: 'inherit', env: process.env });
  success('Frontend dependencies installed');

  // Step 3: Set environment variables for production build
  process.env.NODE_ENV = 'production';
  process.env.VITE_API_URL = '/api';
  process.env.VITE_API_KEY = process.env.VITE_API_KEY || 'prod_geniq_api_key_2024';

  // Step 4: Build the frontend
  log('Building React frontend...');
  execSync('npm run build', { stdio: 'inherit', env: process.env });

  // Verify dist folder was created
  if (!fs.existsSync('dist')) {
    error('Frontend build failed - dist folder not created');
  }

  // Verify index.html exists
  if (!fs.existsSync('dist/index.html')) {
    error('Frontend build failed - index.html not found');
  }

  success('Frontend built successfully');

  // Step 5: Install backend dependencies
  log('Installing backend dependencies...');
  process.chdir('backend');
  execSync('npm install', { stdio: 'inherit' });
  success('Backend dependencies installed');

  // Step 6: Verify backend files
  if (!fs.existsSync('server.js')) {
    error('Backend server.js not found');
  }

  if (!fs.existsSync('start-prod.js')) {
    error('Backend start-prod.js not found');
  }

  success('Backend verified');
  success('🎉 Build completed successfully!');

  // Log some stats
  try {
    const distPath = path.join('..', 'dist');
    const files = fs.readdirSync(distPath);
    log(`Frontend build contains ${files.length} files/folders`);

    const indexPath = path.join(distPath, 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const hasReact = indexContent.includes('react') || indexContent.includes('React') || indexContent.includes('root');
    log(`React app structure detected: ${hasReact ? 'Yes' : 'No'}`);
  } catch (statError) {
    log('Could not read build stats, but build completed');
  }

} catch (err) {
  error(`Build failed: ${err.message}`);
}