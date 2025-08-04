/**
 * Test helper utilities for debugging and testing API communication
 */

import { apiHelpers, checkApiStatus, validateApiEnvironment } from './apiHelpers';
import { toast } from 'sonner';

// Test result interface
export interface TestResult {
  name: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  duration?: number;
}

// Test suite interface
export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  total: number;
  duration: number;
}

// Helper to run a single test with timing
const runTest = async (
  name: string,
  testFunction: () => Promise<any>
): Promise<TestResult> => {
  const startTime = Date.now();
  
  try {
    const result = await testFunction();
    const duration = Date.now() - startTime;
    
    return {
      name,
      success: true,
      message: 'Test passed',
      data: result,
      duration
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    return {
      name,
      success: false,
      message: 'Test failed',
      error: error.message || 'Unknown error',
      duration
    };
  }
};

// API Communication Test Suite
export const runApiTests = async (): Promise<TestSuite> => {
  const startTime = Date.now();
  const tests: TestResult[] = [];

  console.log('🧪 Running API Communication Tests...\n');

  // Test 1: Environment Validation
  tests.push(await runTest('Environment Validation', async () => {
    const validation = validateApiEnvironment();
    if (!validation.valid) {
      throw new Error(`Environment issues: ${validation.issues.join(', ')}`);
    }
    return validation;
  }));

  // Test 2: Server Health Check
  tests.push(await runTest('Server Health Check', async () => {
    const response = await apiHelpers.healthCheck();
    if (!response.success) {
      throw new Error(response.error || 'Health check failed');
    }
    return response.data;
  }));

  // Test 3: API Health Check
  tests.push(await runTest('API Health Check', async () => {
    const response = await apiHelpers.apiHealthCheck();
    if (!response.success) {
      throw new Error(response.error || 'API health check failed');
    }
    return response.data;
  }));

  // Test 4: Dashboard Stats (Authentication Test)
  tests.push(await runTest('Dashboard Stats (Auth Test)', async () => {
    const response = await apiHelpers.get('/dashboard/stats');
    if (!response.success) {
      throw new Error(response.error || 'Dashboard stats failed');
    }
    return response.data;
  }));

  // Test 5: Problems Endpoint
  tests.push(await runTest('Problems Endpoint', async () => {
    const response = await apiHelpers.get('/problems');
    if (!response.success) {
      throw new Error(response.error || 'Problems endpoint failed');
    }
    if (!Array.isArray(response.data)) {
      throw new Error('Problems data is not an array');
    }
    return { count: response.data.length, sample: response.data[0] };
  }));

  // Test 6: MCQs Endpoint
  tests.push(await runTest('MCQs Endpoint', async () => {
    const response = await apiHelpers.get('/mcqs');
    if (!response.success) {
      throw new Error(response.error || 'MCQs endpoint failed');
    }
    if (!Array.isArray(response.data)) {
      throw new Error('MCQs data is not an array');
    }
    return { count: response.data.length, sample: response.data[0] };
  }));

  // Test 7: Reviews Endpoint
  tests.push(await runTest('Reviews Endpoint', async () => {
    const response = await apiHelpers.get('/reviews');
    if (!response.success) {
      throw new Error(response.error || 'Reviews endpoint failed');
    }
    if (!Array.isArray(response.data)) {
      throw new Error('Reviews data is not an array');
    }
    return { count: response.data.length, sample: response.data[0] };
  }));

  // Test 8: Filtered Data Test
  tests.push(await runTest('Filtered Data Test', async () => {
    const response = await apiHelpers.get('/problems?difficulty=Easy');
    if (!response.success) {
      throw new Error(response.error || 'Filtered problems failed');
    }
    return { count: response.data.length };
  }));

  // Calculate results
  const passed = tests.filter(t => t.success).length;
  const failed = tests.filter(t => !t.success).length;
  const duration = Date.now() - startTime;

  const suite: TestSuite = {
    name: 'API Communication Tests',
    tests,
    passed,
    failed,
    total: tests.length,
    duration
  };

  // Log results
  console.log('\n📊 Test Results:');
  console.log(`Total: ${suite.total}, Passed: ${suite.passed}, Failed: ${suite.failed}`);
  console.log(`Duration: ${suite.duration}ms`);
  console.log(`Success Rate: ${Math.round((suite.passed / suite.total) * 100)}%\n`);

  tests.forEach((test, index) => {
    const status = test.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${test.name} (${test.duration}ms)`);
    if (!test.success && test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });

  return suite;
};

// Quick API status check for UI
export const quickApiCheck = async (): Promise<{
  status: 'healthy' | 'degraded' | 'down';
  message: string;
}> => {
  try {
    const status = await checkApiStatus();
    
    if (status.server && status.api && status.authentication) {
      return {
        status: 'healthy',
        message: 'All systems operational'
      };
    } else if (status.server && status.api) {
      return {
        status: 'degraded',
        message: 'API accessible but authentication issues detected'
      };
    } else {
      return {
        status: 'down',
        message: `API issues: ${status.issues.join(', ')}`
      };
    }
  } catch (error) {
    return {
      status: 'down',
      message: 'Unable to check API status'
    };
  }
};

// Test with user feedback
export const testApiWithFeedback = async (): Promise<TestSuite> => {
  toast.info('Running API tests...', { duration: 2000 });
  
  try {
    const results = await runApiTests();
    
    if (results.passed === results.total) {
      toast.success(`All ${results.total} API tests passed! 🎉`);
    } else if (results.passed > 0) {
      toast.warning(`${results.passed}/${results.total} API tests passed`);
    } else {
      toast.error('All API tests failed. Check console for details.');
    }
    
    return results;
  } catch (error) {
    toast.error('Failed to run API tests');
    throw error;
  }
};

// Debug helper for specific endpoints
export const debugEndpoint = async (endpoint: string): Promise<void> => {
  console.log(`🔍 Debugging endpoint: ${endpoint}\n`);
  
  try {
    const response = await apiHelpers.get(endpoint);
    
    console.log('Response:', {
      success: response.success,
      status: response.status,
      data: response.data,
      error: response.error
    });
    
    if (response.success) {
      console.log('✅ Endpoint is working correctly');
      
      if (Array.isArray(response.data)) {
        console.log(`📄 Data: Array with ${response.data.length} items`);
        if (response.data.length > 0) {
          console.log('📋 Sample item:', response.data[0]);
        }
      } else if (response.data && typeof response.data === 'object') {
        console.log('📄 Data keys:', Object.keys(response.data));
      }
    } else {
      console.log('❌ Endpoint has issues');
      console.log('Error:', response.error);
      console.log('Status:', response.status);
    }
  } catch (error) {
    console.log('💥 Failed to debug endpoint:', error);
  }
};

// Performance test helper
export const performanceTest = async (endpoint: string, iterations: number = 5): Promise<{
  endpoint: string;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  successRate: number;
}> => {
  console.log(`⚡ Performance testing: ${endpoint} (${iterations} iterations)\n`);
  
  const times: number[] = [];
  let successes = 0;
  
  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    
    try {
      const response = await apiHelpers.get(endpoint);
      const duration = Date.now() - startTime;
      times.push(duration);
      
      if (response.success) {
        successes++;
      }
      
      console.log(`Iteration ${i + 1}: ${duration}ms ${response.success ? '✅' : '❌'}`);
    } catch (error) {
      const duration = Date.now() - startTime;
      times.push(duration);
      console.log(`Iteration ${i + 1}: ${duration}ms ❌ (${error})`);
    }
  }
  
  const results = {
    endpoint,
    iterations,
    averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    minTime: Math.min(...times),
    maxTime: Math.max(...times),
    successRate: Math.round((successes / iterations) * 100)
  };
  
  console.log('\n📊 Performance Results:', results);
  return results;
};

// Export all test utilities
export const testUtils = {
  runApiTests,
  quickApiCheck,
  testApiWithFeedback,
  debugEndpoint,
  performanceTest
};