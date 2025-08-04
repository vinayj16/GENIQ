#!/usr/bin/env node

/**
 * Test script to verify single-service deployment is working correctly
 */

const BASE_URL = 'https://geniq-mtkc.onrender.com';

async function testEndpoint(url, expectedType = 'json') {
  try {
    console.log(`🔍 Testing: ${url}`);
    const response = await fetch(url);
    
    if (response.ok) {
      if (expectedType === 'html') {
        const text = await response.text();
        const isHtml = text.includes('<!DOCTYPE html>') || text.includes('<html');
        console.log(`✅ Success: ${response.status} - ${isHtml ? 'HTML' : 'Text'} response`);
        if (isHtml) {
          console.log(`📄 Title: ${text.match(/<title>(.*?)<\/title>/)?.[1] || 'No title found'}`);
        }
      } else {
        const data = await response.json();
        console.log(`✅ Success: ${response.status}`);
        console.log(`📄 Response:`, JSON.stringify(data, null, 2));
      }
    } else {
      console.log(`❌ Failed: ${response.status} ${response.statusText}`);
    }
    console.log('---');
    return response.ok;
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
    console.log('---');
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing GENIQ Single-Service Deployment\n');
  console.log(`🌐 Base URL: ${BASE_URL}\n`);

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Frontend (React app)
  totalTests++;
  console.log('1️⃣ Testing Frontend (React App)');
  if (await testEndpoint(`${BASE_URL}`, 'html')) passedTests++;

  // Test 2: Health check (no auth)
  totalTests++;
  console.log('2️⃣ Testing Health Check');
  if (await testEndpoint(`${BASE_URL}/health`)) passedTests++;

  // Test 3: API Health check (no auth)
  totalTests++;
  console.log('3️⃣ Testing API Health Check');
  if (await testEndpoint(`${BASE_URL}/api/health`)) passedTests++;

  // Test 4: API with auth (should fail without API key)
  totalTests++;
  console.log('4️⃣ Testing API Authentication (should fail)');
  const authResponse = await fetch(`${BASE_URL}/api/dashboard/stats`);
  if (authResponse.status === 401) {
    console.log('✅ Success: 401 Unauthorized (as expected)');
    console.log('📄 API authentication is working correctly');
    passedTests++;
  } else {
    console.log(`❌ Unexpected status: ${authResponse.status}`);
  }
  console.log('---');

  // Test 5: Static assets (should be served)
  totalTests++;
  console.log('5️⃣ Testing Static Assets');
  if (await testEndpoint(`${BASE_URL}/assets`, 'html')) passedTests++;

  // Test 6: React Router (SPA routing)
  totalTests++;
  console.log('6️⃣ Testing React Router (SPA routing)');
  if (await testEndpoint(`${BASE_URL}/dashboard`, 'html')) passedTests++;

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your deployment is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the issues above.');
  }

  console.log('\n📋 Next steps:');
  console.log('1. If frontend tests fail, check if the build was successful');
  console.log('2. If API tests fail, verify environment variables on Render');
  console.log('3. Visit the URL in your browser to test the full application');
  console.log('4. Set up your Google AI API key for full functionality');
  
  console.log(`\n🌐 Visit your app: ${BASE_URL}`);
}

// Run the tests
runTests().catch(console.error);