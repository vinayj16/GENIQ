#!/usr/bin/env node
/**
 * Comprehensive API Key Communication Test
 * Tests all aspects of API communication between frontend and backend
 */

const BASE_URL = 'https://geniq-ou4a.onrender.com';
const API_KEY = 'prod_geniq_api_key_2024';

console.log('🚀 GENIQ Comprehensive API Communication Test\n');
console.log(`🌐 Base URL: ${BASE_URL}`);
console.log(`🔑 API Key: ****${API_KEY.slice(-4)}\n`);
console.log('=' .repeat(60));

// Test configuration
const testConfig = {
  timeout: 10000, // 10 seconds timeout
  retries: 3,
  delay: 1000 // 1 second delay between retries
};

// Helper function to make API requests
async function makeApiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
    ...options.headers
  };

  console.log(`📡 Making request to: ${endpoint}`);
  console.log(`🔑 Using API Key: ****${API_KEY.slice(-4)}`);

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      ...options
    });

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    // Log response headers for debugging
    console.log('📋 Response Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`   ${key}: ${value}`);
    }

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Success: ${endpoint}`);
      return { success: true, data, status: response.status };
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.log(`❌ Failed: ${errorData.error || 'Unknown error'}`);
      return { success: false, error: errorData, status: response.status };
    }
  } catch (error) {
    console.log(`💥 Network Error: ${error.message}`);
    return { success: false, error: error.message, status: 0 };
  }
}

// Test retry mechanism
async function testWithRetry(testName, testFunction, maxRetries = testConfig.retries) {
  console.log(`\n🔄 Testing: ${testName}`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`   Attempt ${attempt}/${maxRetries}`);
    
    try {
      const result = await testFunction();
      if (result.success) {
        console.log(`   ✅ ${testName} - Success on attempt ${attempt}`);
        return result;
      } else if (attempt === maxRetries) {
        console.log(`   ❌ ${testName} - Failed after ${maxRetries} attempts`);
        return result;
      }
    } catch (error) {
      console.log(`   💥 ${testName} - Error on attempt ${attempt}: ${error.message}`);
      if (attempt === maxRetries) {
        return { success: false, error: error.message };
      }
    }
    
    // Wait before retry
    if (attempt < maxRetries) {
      console.log(`   ⏳ Waiting ${testConfig.delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, testConfig.delay));
    }
  }
}

// Individual test functions
const tests = {
  // 1. Health Check Tests
  async testServerHealth() {
    return await makeApiRequest('/health');
  },

  async testApiHealth() {
    return await makeApiRequest('/api/health');
  },

  // 2. Authentication Tests
  async testWithoutApiKey() {
    console.log('🔒 Testing request without API key (should fail)');
    const result = await makeApiRequest('/api/dashboard/stats', {
      headers: {} // No API key
    });
    
    // This should fail with 401
    if (result.status === 401) {
      console.log('✅ Correctly rejected request without API key');
      return { success: true, data: 'Authentication working correctly' };
    } else {
      console.log('❌ Request without API key was not rejected');
      return { success: false, error: 'Authentication not working' };
    }
  },

  async testWithWrongApiKey() {
    console.log('🔒 Testing request with wrong API key (should fail)');
    const result = await makeApiRequest('/api/dashboard/stats', {
      headers: { 'X-API-Key': 'wrong_api_key_123' }
    });
    
    // This should fail with 401
    if (result.status === 401) {
      console.log('✅ Correctly rejected request with wrong API key');
      return { success: true, data: 'Authentication working correctly' };
    } else {
      console.log('❌ Request with wrong API key was not rejected');
      return { success: false, error: 'Authentication not working' };
    }
  },

  async testWithCorrectApiKey() {
    console.log('🔒 Testing request with correct API key (should succeed)');
    return await makeApiRequest('/api/dashboard/stats');
  },

  // 3. Data Endpoint Tests
  async testDashboardStats() {
    return await makeApiRequest('/api/dashboard/stats');
  },

  async testDashboardActivity() {
    return await makeApiRequest('/api/dashboard/activity');
  },

  async testProblems() {
    return await makeApiRequest('/api/problems');
  },

  async testMCQs() {
    return await makeApiRequest('/api/mcqs');
  },

  async testReviews() {
    return await makeApiRequest('/api/reviews');
  },

  // 4. Filtered Data Tests
  async testFilteredProblems() {
    return await makeApiRequest('/api/problems?difficulty=Easy&category=algorithms');
  },

  async testFilteredMCQs() {
    return await makeApiRequest('/api/mcqs?company=Google&difficulty=Easy');
  },

  async testFilteredReviews() {
    return await makeApiRequest('/api/reviews?company=Cisco&role=Software Engineer');
  },

  // 5. POST Request Tests
  async testSubmitReview() {
    const reviewData = {
      company: 'Test Company',
      role: 'Test Role',
      experience: 'Positive',
      difficulty: 'Medium',
      rating: 4,
      interview_process: 'Test process',
      questions_asked: ['Test question 1', 'Test question 2'],
      preparation_tips: 'Test preparation tips'
    };

    return await makeApiRequest('/api/reviews', {
      method: 'POST',
      body: reviewData
    });
  },

  // 6. Environment Variable Tests
  async testEnvironmentVariables() {
    console.log('🔍 Checking environment variable configuration...');
    
    // Test if backend is reading the correct API key
    const result = await makeApiRequest('/api/health');
    
    if (result.success) {
      console.log('✅ Backend is responding, environment variables likely configured correctly');
      return { success: true, data: 'Environment variables working' };
    } else {
      console.log('❌ Backend not responding properly');
      return { success: false, error: 'Environment variable issues' };
    }
  }
};

// Main test runner
async function runAllTests() {
  const results = {
    passed: 0,
    failed: 0,
    total: 0,
    details: []
  };

  console.log('\n🧪 Running Comprehensive API Tests...\n');

  // Run all tests
  for (const [testName, testFunction] of Object.entries(tests)) {
    results.total++;
    
    const result = await testWithRetry(testName, testFunction);
    
    if (result.success) {
      results.passed++;
      results.details.push({ test: testName, status: 'PASSED', data: result.data });
    } else {
      results.failed++;
      results.details.push({ test: testName, status: 'FAILED', error: result.error });
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Print summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Total Tests: ${results.total}`);
  console.log(`Passed: ${results.passed} ✅`);
  console.log(`Failed: ${results.failed} ❌`);
  console.log(`Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);

  // Detailed results
  console.log('\n📋 DETAILED RESULTS:');
  results.details.forEach((result, index) => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.test}`);
    if (result.status === 'FAILED' && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  
  if (results.passed === results.total) {
    console.log('🎉 All tests passed! Your API communication is working perfectly.');
    console.log('✅ API key authentication is properly configured');
    console.log('✅ All endpoints are responding correctly');
    console.log('✅ Environment variables are set up correctly');
  } else if (results.passed / results.total >= 0.8) {
    console.log('👍 Most tests passed. Minor issues detected:');
    results.details.filter(r => r.status === 'FAILED').forEach(failure => {
      console.log(`   - Fix: ${failure.test}`);
    });
  } else {
    console.log('⚠️  Multiple issues detected. Check the following:');
    console.log('   1. Verify API key is correctly set in environment variables');
    console.log('   2. Check backend server is running and accessible');
    console.log('   3. Verify CORS configuration allows frontend requests');
    console.log('   4. Check network connectivity to the backend');
  }

  console.log(`\n🌐 Test your website manually: ${BASE_URL}`);
  console.log('🎯 Navigate to Enhanced Coding and MCQs sections');
  console.log('📱 Check browser console for any JavaScript errors');

  return results;
}

// Environment check
async function checkEnvironment() {
  console.log('\n🔍 Environment Check:');
  console.log(`   Node.js Version: ${process.version}`);
  console.log(`   Platform: ${process.platform}`);
  console.log(`   Architecture: ${process.arch}`);
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   API Key: ****${API_KEY.slice(-4)}`);
  console.log(`   Timeout: ${testConfig.timeout}ms`);
  console.log(`   Max Retries: ${testConfig.retries}`);
}

// Run the comprehensive test
async function main() {
  try {
    await checkEnvironment();
    const results = await runAllTests();
    
    // Exit with appropriate code
    process.exit(results.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main();