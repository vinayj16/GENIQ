# Scripts Directory

This directory contains essential scripts for the GENIQ project development and deployment.

## 📁 Available Scripts

### 🏗️ **build-for-render.js**
**Purpose:** Production build script specifically designed for Render deployment
**Usage:** `node scripts/build-for-render.js`
**Description:** 
- Handles the complete build process for production
- Ensures reliable deployment to Render
- Includes error handling and build verification
- Creates optimized production assets

### 🧪 **comprehensive-api-test.js**
**Purpose:** Complete API communication testing suite
**Usage:** `node scripts/comprehensive-api-test.js`
**Description:**
- Tests all API endpoints with proper authentication
- Verifies API key communication between frontend and backend
- Validates data structure and response formats
- Includes retry mechanisms and detailed reporting
- Tests both GET and POST requests
- Validates environment variable configuration

### ⚙️ **setup-env.js**
**Purpose:** Environment setup for development
**Usage:** `node scripts/setup-env.js`
**Description:**
- Creates necessary environment files for development
- Sets up proper environment variable configuration
- Ensures consistent development environment setup
- Configures API keys and other sensitive data

### ✅ **verify-build.js**
**Purpose:** Build verification before deployment
**Usage:** `node scripts/verify-build.js`
**Description:**
- Verifies that the build process completed successfully
- Checks for required files and assets
- Validates build integrity before deployment
- Ensures all necessary files are present in the dist directory

## 🚀 Usage Examples

### Development Setup
```bash
# Set up environment for development
node scripts/setup-env.js

# Verify your API is working
node scripts/comprehensive-api-test.js
```

### Production Deployment
```bash
# Build for production deployment
node scripts/build-for-render.js

# Verify build before deployment
node scripts/verify-build.js

# Test deployed API (after deployment)
node scripts/comprehensive-api-test.js
```

## 📋 Script Dependencies

All scripts are designed to work with:
- Node.js 18+
- ES Modules (import/export)
- Environment variables from `.env` files
- The GENIQ project structure

## 🔧 Maintenance

These scripts are essential for:
- ✅ Development workflow
- ✅ Production deployment
- ✅ API testing and validation
- ✅ Environment configuration

**Do not delete these scripts** - they are required for proper project operation.

## 🆘 Troubleshooting

If any script fails:
1. Check Node.js version (should be 18+)
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed (`npm install`)
4. Check network connectivity for API tests
5. Verify file permissions for build scripts

## 📊 Test Results

The comprehensive API test provides detailed results including:
- API endpoint availability
- Authentication verification
- Data structure validation
- Performance metrics
- Error handling verification

Success rate should be 90%+ for a healthy deployment.