import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      try {
        const [stats, recentActivity] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getDashboardActivity()
        ]);
        return { stats, recentActivity };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Return default values if the API call fails
        return {
          stats: {
            problemsSolved: 0,
            dayStreak: 0,
            successRate: 0,
            companiesCount: 0
          },
          recentActivity: []
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Retry once if the request fails
  });
}

export function useMCQs() {
  return useQuery({
    queryKey: ['mcqs'],
    queryFn: () => apiService.getMCQs(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCodingProblems() {
  return useQuery({
    queryKey: ['coding-problems'],
    queryFn: () => apiService.getCodingProblems(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiService.getUserProfile(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
