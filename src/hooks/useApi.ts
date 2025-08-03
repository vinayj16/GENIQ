import { useState, useCallback, useEffect, useRef } from 'react';
import { apiService } from '@/lib/api';
import {
  UserProfile,
  DashboardStats,
  Activity,
  Problem,
  Review
} from '@/types/dashboard';

// Define additional types that aren't in the dashboard types
type MCQ = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  category?: string;
  difficulty?: string;
  company?: string;
};

type CodeAnalysisResult = {
  analysis: string;
  suggestions: string[];
};

type ApiFunction<T extends any[], R> = (...args: T) => Promise<R>;

interface UseApiOptions<T = any> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  initialData?: T;
}

export function useApi<T extends any[], R>(
  apiFunction: ApiFunction<T, R>,
  { onSuccess, onError, enabled = true, initialData = null }: UseApiOptions<R> = {}
) {
  const [data, setData] = useState<R | null>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMounted = useRef(true);
  const isInitialMount = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: T) => {
      if (!isMounted.current) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        if (isMounted.current) {
          setData(result);
          onSuccess?.(result);
        }
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        if (isMounted.current) {
          setError(error);
          onError?.(error);
        }
        throw error;
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [apiFunction, onError, onSuccess]
  );

  // Auto-execute on mount if enabled
  useEffect(() => {
    if (enabled && isInitialMount.current) {
      isInitialMount.current = false;
      // Use a ref to track if we've already executed
      const hasExecuted = { current: false };

      if (!hasExecuted.current) {
        hasExecuted.current = true;
        execute(...([] as unknown as T)).catch(() => { });
      }
    }
  }, [enabled]); // Removed execute from dependencies to prevent loops

  // Refetch function
  const refetch = useCallback(() => {
    return execute(...([] as unknown as T));
  }, [execute]);

  return {
    execute,
    data,
    error,
    isLoading: isLoading && enabled,
    refetch
  };
}

// Specific API hooks with proper typing and options
export const useDashboardStats = (options?: Omit<UseApiOptions<DashboardStats>, 'initialData'>) =>
  useApi(() => apiService.getDashboardStats(), options);

export const useActivities = (options?: Omit<UseApiOptions<Activity[]>, 'initialData'>) => {
  // Mock activities data since our API service doesn't have this method yet
  const mockActivities: Activity[] = [
    {
      id: 1,
      type: 'coding',
      title: 'Two Sum Problem',
      status: 'completed',
      time: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: 2,
      type: 'mcq',
      title: 'JavaScript Fundamentals',
      status: 'in-progress',
      time: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    },
    {
      id: 3,
      type: 'interview',
      title: 'Mock Interview - Google',
      status: 'completed',
      time: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
  ];

  return useApi(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      return mockActivities;
    },
    { initialData: [], ...options }
  );
};

export const useProblems = (options?: Omit<UseApiOptions<Problem[]>, 'initialData'>) =>
  useApi(() => apiService.getProblems(), { initialData: [], ...options });

export const useMCQs = (
  filters?: { category?: string; difficulty?: string; company?: string },
  options?: Omit<UseApiOptions<MCQ[]>, 'initialData'>
) => {
  // Generate mock MCQs since our API service doesn't have this method
  const generateMockMCQs = async (): Promise<MCQ[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

    const mockMCQs: MCQ[] = [
      {
        id: '1',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        answer: 'O(log n)',
        category: 'Algorithms',
        difficulty: 'Medium',
        company: 'Google'
      },
      {
        id: '2',
        question: 'Which data structure uses LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        answer: 'Stack',
        category: 'Data Structures',
        difficulty: 'Easy',
        company: 'Microsoft'
      }
    ];

    return mockMCQs;
  };

  return useApi(generateMockMCQs, { initialData: [], ...options });
};

export const useCodeAnalysis = (options?: UseApiOptions<CodeAnalysisResult>) => {
  const mockAnalysis = async (code: string, language: string): Promise<CodeAnalysisResult> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate AI processing
    return {
      analysis: `Your ${language} code looks good! The algorithm has O(n) time complexity.`,
      suggestions: [
        'Consider adding input validation',
        'Add comments for better readability',
        'Handle edge cases for empty inputs'
      ]
    };
  };

  return useApi(mockAnalysis, options);
};

export const useHint = (options?: UseApiOptions<{ hint: string }>) => {
  const mockHint = async (): Promise<{ hint: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      hint: 'Try using a hash map to store previously seen values for O(1) lookup time.'
    };
  };

  return useApi(mockHint, options);
};

export const useMCQGeneration = (options?: UseApiOptions<MCQ[]>) => {
  const generateMCQs = async (): Promise<MCQ[]> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate AI generation
    return [
      {
        id: 'gen-1',
        question: 'What is the main advantage of using React hooks?',
        options: ['Better performance', 'Simpler state management', 'Smaller bundle size', 'All of the above'],
        answer: 'Simpler state management',
        category: 'React',
        difficulty: 'Medium'
      }
    ];
  };

  return useApi(generateMCQs, { initialData: [], ...options });
};

export const useReviews = (options?: Omit<UseApiOptions<Review[]>, 'initialData'>) =>
  useApi(() => apiService.getReviews(), { initialData: [], ...options });

// Mock user profile data
const mockUserProfile: UserProfile = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Developer',
  joinDate: '2023-01-01',
  lastActive: new Date().toISOString()
};

export const useUserProfile = (options?: Omit<UseApiOptions<UserProfile>, 'initialData'>) => {
  const {
    data,
    error,
    isLoading,
    refetch
  } = useApi(
    async (): Promise<UserProfile> => {
      // In a real app, this would be an actual API call
      // const response = await api.getUserProfile();
      // return response.data;

      // For now, return mock data after a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUserProfile;
    },
    {
      initialData: mockUserProfile,
      ...options
    }
  );

  return {
    data,
    error,
    isLoading,
    refetch
  };
};
