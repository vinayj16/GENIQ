// Simple test to verify API service functionality
import { apiService } from './api';

export const testApiService = async () => {
  try {
    console.log('Testing API Service...');
    
    // Test basic methods
    const problems = await apiService.getCodingProblems();
    console.log('✅ getCodingProblems:', problems.length, 'problems');
    
    const reviews = await apiService.getReviews();
    console.log('✅ getReviews:', reviews.length, 'reviews');
    
    const dashboardStats = await apiService.getDashboardStats();
    console.log('✅ getDashboardStats:', dashboardStats);
    
    // Test company-specific methods
    const companyProblems = await apiService.getCompanyProblems('google');
    console.log('✅ getCompanyProblems:', companyProblems.length, 'problems for Google');
    
    const companyAnalytics = await apiService.getCompanyAnalytics('google');
    console.log('✅ getCompanyAnalytics:', companyAnalytics);
    
    // Test solution submission
    const submissionResult = await apiService.submitSolution(1, 'test code', 'javascript');
    console.log('✅ submitSolution:', submissionResult);
    
    console.log('🎉 All API tests passed!');
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
};

// Export for use in development
if (import.meta.env.DEV) {
  (window as any).testApiService = testApiService;
}