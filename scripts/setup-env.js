#!/usr/bin/env node

/**
 * Setup script to create environment files for development
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const createEnvFile = (filename, content) => {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${filename}`);
  } else {
    console.log(`⚠️  ${filename} already exists, skipping...`);
  }
};

const devEnvContent = `# ===================================================================
# GENIQ - Development Environment Variables
# ===================================================================
# Copy from .env.example and customize for your local development
# ===================================================================

# =======================
# Application Settings
# =======================
NODE_ENV=development

# =======================
# Frontend Configuration (Used by Vite)
# =======================
VITE_API_URL=/api
VITE_API_KEY=dev_test_key_123
VITE_BACKEND_URL=http://localhost:5000

# =======================
# Backend Configuration
# =======================
PORT=5000
HOST=localhost

# =======================
# Security
# =======================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# =======================
# CORS Configuration
# =======================
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# =======================
# AI Configuration
# =======================
# Get your API key from: https://makersuite.google.com/app/apikey
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# =======================
# Logging
# =======================
LOG_LEVEL=debug

# =======================
# Feature Flags
# =======================
ENABLE_ANALYTICS=false
ENABLE_MAINTENANCE_MODE=false
`;

console.log('🚀 Setting up GENIQ environment files...\n');

// Create .env for development
createEnvFile('.env', devEnvContent);

console.log('\n📝 Next steps:');
console.log('1. Edit .env file and add your Google AI API key');
console.log('2. Run "npm install" to install dependencies');
console.log('3. Run "npm run start-full" to start both frontend and backend');
console.log('4. Visit http://localhost:5173 to see your app');
console.log('\n🔑 To get a Google AI API key:');
console.log('   Visit: https://makersuite.google.com/app/apikey');
console.log('\n🚀 For deployment instructions, see DEPLOYMENT.md');