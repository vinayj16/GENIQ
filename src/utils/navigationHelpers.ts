/**
 * Navigation helper functions to ensure consistent navigation throughout the app
 */

import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';

export const navigationHelpers = {
  // Dashboard navigation
  goToDashboard: (navigate: NavigateFunction) => {
    navigate('/dashboard');
    toast.success('Welcome to your dashboard! 📊');
  },

  goToCoding: (navigate: NavigateFunction, company?: string) => {
    const url = company ? `/dashboard/coding?company=${company}` : '/dashboard/coding';
    navigate(url);
    toast.success('Starting coding practice! 💻');
  },

  goToMCQs: (navigate: NavigateFunction, company?: string) => {
    const url = company ? `/dashboard/mcqs?company=${company}` : '/dashboard/mcqs';
    navigate(url);
    toast.success('Starting MCQ practice! 📝');
  },

  goToInterviews: (navigate: NavigateFunction) => {
    navigate('/dashboard/face-to-face');
    toast.success('Starting mock interviews! 🎤');
  },

  goToResume: (navigate: NavigateFunction) => {
    navigate('/dashboard/resume');
    toast.success('Opening resume builder! 📄');
  },

  goToAnalytics: (navigate: NavigateFunction) => {
    navigate('/dashboard/analytics');
    toast.success('Viewing your analytics! 📈');
  },

  goToProfile: (navigate: NavigateFunction) => {
    navigate('/dashboard/profile');
    toast.success('Opening your profile! 👤');
  },

  goToSettings: (navigate: NavigateFunction) => {
    navigate('/dashboard/settings');
    toast.success('Opening settings! ⚙️');
  },

  // Company navigation
  goToCompanies: (navigate: NavigateFunction) => {
    navigate('/companies');
    toast.success('Exploring companies! 🏢');
  },

  goToCompanyProfile: (navigate: NavigateFunction, companyId: string) => {
    navigate(`/companies/${companyId.toLowerCase()}`);
    toast.success(`Viewing ${companyId} profile! 🏢`);
  },

  // Practice navigation
  startPractice: (navigate: NavigateFunction, type: 'coding' | 'mcqs' | 'interview', company?: string) => {
    switch (type) {
      case 'coding':
        navigationHelpers.goToCoding(navigate, company);
        break;
      case 'mcqs':
        navigationHelpers.goToMCQs(navigate, company);
        break;
      case 'interview':
        navigationHelpers.goToInterviews(navigate);
        break;
    }
  },

  // Auth navigation
  goToAuth: (navigate: NavigateFunction, mode: 'login' | 'signup' = 'login') => {
    navigate(`/auth?mode=${mode}`);
    toast.success(`Welcome to ${mode}! 🔐`);
  },

  // General navigation
  goHome: (navigate: NavigateFunction) => {
    navigate('/');
    toast.success('Welcome home! 🏠');
  },

  goBack: (navigate: NavigateFunction) => {
    navigate(-1);
    toast.success('Going back! ⬅️');
  },

  // External links
  openExternal: (url: string, description?: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    if (description) {
      toast.success(`Opening ${description}! 🔗`);
    }
  }
};

// Hook for easy access to navigation helpers
export const useNavigationHelpers = (navigate: NavigateFunction) => {
  return {
    goToDashboard: () => navigationHelpers.goToDashboard(navigate),
    goToCoding: (company?: string) => navigationHelpers.goToCoding(navigate, company),
    goToMCQs: (company?: string) => navigationHelpers.goToMCQs(navigate, company),
    goToInterviews: () => navigationHelpers.goToInterviews(navigate),
    goToResume: () => navigationHelpers.goToResume(navigate),
    goToAnalytics: () => navigationHelpers.goToAnalytics(navigate),
    goToProfile: () => navigationHelpers.goToProfile(navigate),
    goToSettings: () => navigationHelpers.goToSettings(navigate),
    goToCompanies: () => navigationHelpers.goToCompanies(navigate),
    goToCompanyProfile: (companyId: string) => navigationHelpers.goToCompanyProfile(navigate, companyId),
    startPractice: (type: 'coding' | 'mcqs' | 'interview', company?: string) => 
      navigationHelpers.startPractice(navigate, type, company),
    goToAuth: (mode: 'login' | 'signup' = 'login') => navigationHelpers.goToAuth(navigate, mode),
    goHome: () => navigationHelpers.goHome(navigate),
    goBack: () => navigationHelpers.goBack(navigate),
    openExternal: (url: string, description?: string) => navigationHelpers.openExternal(url, description)
  };
};