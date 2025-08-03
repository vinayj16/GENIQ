const API_BASE_URL = 'http://localhost:5000/api';

// Get API key from environment variables or local storage
const getApiKey = (): string | null => {
  return import.meta.env.VITE_API_KEY || localStorage.getItem('apiKey') || null;
};

// Common headers for API requests
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  return headers;
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If we can't parse the error response, use the default message
      console.warn('Could not parse error response:', e);
    }
    
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      message: errorMessage
    });
    
    throw new Error(errorMessage);
  }
  return response.json();
};

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  company: string;
  // Add other problem properties as needed
}

interface DashboardStats {
  problemsSolved: number;
  dayStreak: number;
  successRate: number;
  companiesCount: number;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  status: string;
  time: string;
}

export const api = {
  // Set API key
  setApiKey: (key: string) => {
    localStorage.setItem('apiKey', key);
  },

  // Clear API key
  clearApiKey: () => {
    localStorage.removeItem('apiKey');
  },

  // Dashboard endpoints
  getDashboardStats: async (): Promise<DashboardStats> => {
    const apiKey = getApiKey();
    console.log('Fetching dashboard stats with API key:', apiKey ? `****${apiKey.slice(-4)}` : 'None');
    
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getHeaders(),
    });
    return handleResponse<DashboardStats>(response);
  },

  getActivities: async (): Promise<Activity[]> => {
    const apiKey = getApiKey();
    console.log('Fetching activities with API key:', apiKey ? `****${apiKey.slice(-4)}` : 'None');
    
    const response = await fetch(`${API_BASE_URL}/dashboard/activity`, {
      headers: getHeaders(),
    });
    return handleResponse<Activity[]>(response);
  },

  // Problems endpoints
  getProblems: async (): Promise<Problem[]> => {
    const response = await fetch(`${API_BASE_URL}/problems`, {
      headers: getHeaders(),
    });
    return handleResponse<Problem[]>(response);
  },

  // MCQs endpoint - returns mock data
  getMCQs: async (filters: {
    company?: string;
    category?: string;
    difficulty?: string;
    limit?: number;
  } = {}) => {
    console.log('Getting MCQs with filters:', filters);
    
    // Generate mock questions
    const generateMockQuestions = (count: number = filters.limit || 10) => {
      const difficulties = ['Easy', 'Medium', 'Hard'];
      const categories = ['Algorithms', 'Data Structures', 'System Design', 'OOP', 'Databases'];
      const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'];
      const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer'];
      
      const questions = [];
      
      for (let i = 0; i < count; i++) {
        const categoryIndex = i % categories.length;
        const difficultyIndex = i % difficulties.length;
        const companyIndex = i % companies.length;
        const roleIndex = i % roles.length;
        
        const question = {
          id: `mock-${Date.now()}-${i}`,
          question: `Sample question about ${categories[categoryIndex]} (${difficulties[difficultyIndex]})`,
          options: [
            `Incorrect option 1 about ${categories[categoryIndex]}`,
            `Incorrect option 2 about ${categories[categoryIndex]}`,
            `Incorrect option 3 about ${categories[categoryIndex]}`,
            `Correct answer for ${categories[categoryIndex]}`
          ],
          correct: 3, // 0-based index of correct answer
          explanation: `This is a detailed explanation for the question about ${categories[categoryIndex]}. The correct answer is important because it demonstrates understanding of ${categories[categoryIndex]} concepts.`,
          category: categories[categoryIndex],
          difficulty: difficulties[difficultyIndex],
          company: companies[companyIndex],
          role: roles[roleIndex],
          showExplanation: true,
          userAnswer: null
        };
        
        questions.push(question);
      }
      
      return questions;
    };

    try {
      const mockQuestions = generateMockQuestions(filters.limit || 10);
      console.log('Generated mock questions:', mockQuestions);
      return mockQuestions;
    } catch (error) {
      console.error('Error generating mock questions:', error);
      return [];
    }
  },

  // AI Analysis endpoints
  analyzeCode: async (code: string, language: string) => {
    const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code, language }),
    });
    return handleResponse<{ analysis: string; suggestions: string[] }>(response);
  },

  getHint: async (problemId: string, currentCode: string, language: string) => {
    const response = await fetch(`${API_BASE_URL}/ai/hint`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ problemId, currentCode, language }),
    });
    return handleResponse<{ hint: string }>(response);
  },

  generateMCQs: async (company: string, role: string, difficulty: string) => {
    const response = await fetch(`${API_BASE_URL}/ai/generate-mcqs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ company, role, difficulty }),
    });
    return handleResponse<Array<{ question: string; options: string[]; answer: string }>>(response);
  },

  // Reviews endpoints
  getReviews: async (filters: { company?: string; role?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.company) params.append('company', filters.company);
    if (filters.role) params.append('role', filters.role);
    const query = params.toString();

    const response = await fetch(`${API_BASE_URL}/reviews${query ? `?${query}` : ''}`, {
      headers: getHeaders(),
    });
    return handleResponse<Array<{ id: string; company: string; role: string; content: string; rating: number }>>(response);
  }
};

export default api;
