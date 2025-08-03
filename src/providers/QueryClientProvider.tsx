import { QueryClient, QueryClientProvider as ReactQueryProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

// Create a query cache with error handling
const queryCache = new QueryCache({
  onError: (error: Error) => {
    console.error('Query error:', error);
    toast({
      title: 'Error',
      description: error.message || 'An error occurred while fetching data',
      variant: 'destructive',
    });
  },
});

// Create a mutation cache with error handling
const mutationCache = new MutationCache({
  onError: (error: Error) => {
    console.error('Mutation error:', error);
    toast({
      title: 'Error',
      description: error.message || 'An error occurred while saving data',
      variant: 'destructive',
    });
  },
});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider client={queryClient}>
      {children}
    </ReactQueryProvider>
  );
}

export default QueryClientProvider;
