#!/usr/bin/env node

/**
 * Verification script to check if the build is ready for deployment
 */

import fs from 'fs';
import path from 'path';

const log = (message) => console.log(`🔍 ${message}`);
const success = (message) => console.log(`✅ ${message}`);
const error = (message) => console.error(`❌ ${message}`);
const warn = (message) => console.warn(`⚠️  ${message}`);

function verifyBuild() {
  log('Verifying GENIQ build for deployment...\n');

  let issues = 0;

  // Check 1: Frontend build exists
  log('1. Checking frontend build...');
  if (!fs.existsSync('dist')) {
    error('dist/ folder not found');
    issues++;
  } else if (!fs.existsSync('dist/index.html')) {
    error('dist/index.html not found');
    issues++;
  } else {
    success('Frontend build exists');
    
    // Check index.html content
    const indexContent = fs.readFileSync('dist/index.html', 'utf8');
    if (indexContent.includes('<div id="root">')) {
      success('React root element found');
    } else {
      warn('React root element not found in index.html');
    }
  }

  // Check 2: Backend files exist
  log('\n2. Checking backend files...');
  if (!fs.existsSync('backend/server.js')) {
    error('backend/server.js not found');
    issues++;
  } else {
    success('Backend server.js exists');
  }

  if (!fs.existsSync('backend/start-prod.js')) {
    error('backend/start-prod.js not found');
    issues++;
  } else {
    success('Backend start-prod.js exists');
  }

  if (!fs.existsSync('backend/package.json')) {
    error('backend/package.json not found');
    issues++;
  } else {
    success('Backend package.json exists');
  }

  // Check 3: Package.json files
  log('\n3. Checking package.json configurations...');
  try {
    const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (rootPkg.scripts && rootPkg.scripts.build) {
      success('Root package.json has build script');
    } else {
      warn('Root package.json missing build script');
    }

    const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    if (backendPkg.scripts && backendPkg.scripts.start) {
      success('Backend package.json has start script');
    } else {
      error('Backend package.json missing start script');
      issues++;
    }
  } catch (err) {
    error(`Error reading package.json files: ${err.message}`);
    issues++;
  }

  // Check 4: Environment configuration
  log('\n4. Checking environment configuration...');
  if (fs.existsSync('.env.production')) {
    success('.env.production exists');
  } else {
    warn('.env.production not found (optional)');
  }

  // Check 5: Build size and structure
  log('\n5. Analyzing build structure...');
  try {
    const distFiles = fs.readdirSync('dist');
    log(`Build contains: ${distFiles.join(', ')}`);
    
    const hasAssets = distFiles.some(file => file === 'assets' || file.includes('.js') || file.includes('.css'));
    if (hasAssets) {
      success('Build contains assets');
    } else {
      warn('No assets found in build');
    }
  } catch (err) {
    error(`Error analyzing build: ${err.message}`);
  }

  // Summary
  log('\n📊 Verification Summary:');
  if (issues === 0) {
    success('🎉 Build verification passed! Ready for deployment.');
    log('\n📋 Render Configuration:');
    log('Build Command: npm install && cd backend && npm run build');
    log('Start Command: cd backend && npm start');
    log('Environment Variables: NODE_ENV=production, VITE_API_KEY=prod_geniq_api_key_2024');
  } else {
    error(`❌ Found ${issues} issue(s). Please fix before deploying.`);
    process.exit(1);
  }
}

verifyBuild();