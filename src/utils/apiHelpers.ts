const API_CONFIG = {
  baseURL: import.meta.env.DEV ? '/api' : '/api',
  apiKey: import.meta.env.VITE_API_KEY || 'prod_geniq_api_key_2024',
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000 // 1 second
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  
  error?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Helper function to create API headers
export const createApiHeaders = (additionalHeaders: Record<string, string> = {}): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': API_CONFIG.apiKey,
    ...additionalHeaders
  };
};

// Helper function to handle API errors
export const handleApiError = (error: any): ApiError => {
  if (error.name === 'AbortError') {
    return {
      message: 'Request timeout - please try again',
      status: 408,
      code: 'TIMEOUT'
    };
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: 'Network error - please check your connection',
      status: 0,
      code: 'NETWORK_ERROR'
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
    status: error.status || 500,
    code: error.code || 'UNKNOWN_ERROR'
  };
};

// Helper function to make API requests with retry logic
export const makeApiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  retries: number = API_CONFIG.retries
): Promise<ApiResponse<T>> => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const controller = new AbortController();
  
  // Set timeout
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  const requestOptions: RequestInit = {
    ...options,
    headers: createApiHeaders(options.headers as Record<string, string>),
    signal: controller.signal
  };

  try {
    console.log(`🔄 API Request: ${options.method || 'GET'} ${endpoint}`);
    
    const response = await fetch(url, requestOptions);
    clearTimeout(timeoutId);

    console.log(`📊 API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw {
        message: errorData.error || errorData.message || `HTTP ${response.status}`,
        status: response.status,
        code: 'HTTP_ERROR'
      };
    }

    const data = await response.json();
    console.log(`✅ API Success: ${endpoint}`);

    return {
      success: true,
      data,
      status: response.status
    };

  } catch (error: any) {
    clearTimeout(timeoutId);
    
    const apiError = handleApiError(error);
    console.error(`❌ API Error: ${endpoint}`, apiError);

    // Retry logic
    if (retries > 0 && apiError.status !== 401 && apiError.status !== 403) {
      console.log(`🔄 Retrying API request: ${endpoint} (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
      return makeApiRequest<T>(endpoint, options, retries - 1);
    }

    return {
      success: false,
      error: apiError.message,
      status: apiError.status
    };
  }
};

// Specific API helper functions
export const apiHelpers = {
  // GET request helper
  get: async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    return makeApiRequest<T>(endpoint, { method: 'GET' });
  },

  // POST request helper
  post: async <T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    return makeApiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // PUT request helper
  put: async <T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    return makeApiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // DELETE request helper
  delete: async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    return makeApiRequest<T>(endpoint, { method: 'DELETE' });
  },

  // Health check helper
  healthCheck: async (): Promise<ApiResponse> => {
    return makeApiRequest('/health', { method: 'GET' });
  },

  // API health check helper
  apiHealthCheck: async (): Promise<ApiResponse> => {
    return makeApiRequest('/api/health', { method: 'GET' });
  }
};

// Environment validation helper
export const validateApiEnvironment = (): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (!API_CONFIG.apiKey || API_CONFIG.apiKey === 'your_api_key_here') {
    issues.push('API key is not properly configured');
  }

  if (!API_CONFIG.baseURL) {
    issues.push('Base URL is not configured');
  }

  if (typeof fetch === 'undefined') {
    issues.push('Fetch API is not available');
  }

  return {
    valid: issues.length === 0,
    issues
  };
};

// API status checker
export const checkApiStatus = async (): Promise<{
  server: boolean;
  api: boolean;
  authentication: boolean;
  issues: string[];
}> => {
  const status = {
    server: false,
    api: false,
    authentication: false,
    issues: [] as string[]
  };

  try {
    // Check server health
    const serverHealth = await apiHelpers.healthCheck();
    status.server = serverHealth.success;
    if (!serverHealth.success) {
      status.issues.push('Server is not responding');
    }

    // Check API health
    const apiHealth = await apiHelpers.apiHealthCheck();
    status.api = apiHealth.success;
    if (!apiHealth.success) {
      status.issues.push('API endpoints are not accessible');
    }

    // Check authentication by trying to access a protected endpoint
    const authTest = await apiHelpers.get('/dashboard/stats');
    status.authentication = authTest.success;
    if (!authTest.success) {
      if (authTest.status === 401) {
        status.issues.push('API key authentication failed');
      } else {
        status.issues.push('Authentication test failed');
      }
    }

  } catch (error) {
    status.issues.push('Failed to check API status');
  }

  return status;
};

// Debug helper for API issues
export const debugApiIssues = async (): Promise<void> => {
  console.log('🔍 Debugging API Issues...\n');

  // Check environment
  const envCheck = validateApiEnvironment();
  console.log('Environment Check:', envCheck);

  // Check API status
  const statusCheck = await checkApiStatus();
  console.log('API Status Check:', statusCheck);

  // Log configuration
  console.log('API Configuration:', {
    baseURL: API_CONFIG.baseURL,
    apiKey: `****${API_CONFIG.apiKey.slice(-4)}`,
    timeout: API_CONFIG.timeout,
    retries: API_CONFIG.retries
  });

  // Recommendations
  console.log('\n💡 Recommendations:');
  if (!envCheck.valid) {
    envCheck.issues.forEach(issue => console.log(`   - ${issue}`));
  }
  if (statusCheck.issues.length > 0) {
    statusCheck.issues.forEach(issue => console.log(`   - ${issue}`));
  }
  if (envCheck.valid && statusCheck.issues.length === 0) {
    console.log('   ✅ All API checks passed!');
  }
};

// Export configuration for external access
export const getApiConfig = () => ({ ...API_CONFIG });

// Update API configuration
export const updateApiConfig = (updates: Partial<typeof API_CONFIG>) => {
  Object.assign(API_CONFIG, updates);
  console.log('API configuration updated:', updates);
};