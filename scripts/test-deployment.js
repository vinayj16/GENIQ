const API_BASE_URL = 'https://geniq-mtkc.onrender.com';
const API_KEY = 'prod_geniq_api_key_2024'; // This should match your production API key

async function testEndpoint(url, options = {}) {
  try {
    console.log(`🔍 Testing: ${url}`);
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success: ${response.status}`);
      console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ Failed: ${response.status}`);
      console.log(`📄 Error:`, JSON.stringify(data, null, 2));
    }
    console.log('---');
    return { success: response.ok, data };
  } catch (error) {
    console.log(`💥 Error: ${error.message}`);
    console.log('---');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing GENIQ Backend Deployment\n');
  console.log(`🌐 Base URL: ${API_BASE_URL}`);
  console.log(`🔑 API Key: ****${API_KEY.slice(-4)}\n`);

  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  };

  // Test 1: Health check (no auth required)
  await testEndpoint(`${API_BASE_URL}/health`);

  // Test 2: API Health check (no auth required)
  await testEndpoint(`${API_BASE_URL}/api/health`);

  // Test 3: Dashboard stats (requires auth)
  await testEndpoint(`${API_BASE_URL}/api/dashboard/stats`, {
    headers
  });

  // Test 4: Problems endpoint (requires auth)
  await testEndpoint(`${API_BASE_URL}/api/problems`, {
    headers
  });

  // Test 5: MCQs endpoint (requires auth)
  await testEndpoint(`${API_BASE_URL}/api/mcqs`, {
    headers
  });

  // Test 6: Reviews endpoint (requires auth)
  await testEndpoint(`${API_BASE_URL}/api/reviews`, {
    headers
  });

  console.log('🏁 Testing completed!');
  console.log('\n📋 Next steps:');
  console.log('1. If tests fail, check your Render environment variables');
  console.log('2. Ensure VITE_API_KEY is set correctly on Render');
  console.log('3. Deploy your frontend with the correct API URL and key');
  console.log('4. Update CORS_ORIGIN on Render with your frontend URL');
}

// Run the tests
runTests().catch(console.error);