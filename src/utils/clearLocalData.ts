/**
 * Utility to clear all local data and reset the application to a fresh state
 */

export const clearAllLocalData = () => {
  try {
    // List of known localStorage keys used in the application
    const keysToRemove = [
      'resumeData',
      'userProfile',
      'dashboardData',
      'practiceProgress',
      'codingProgress',
      'mcqProgress',
      'interviewHistory',
      'userPreferences',
      'authToken',
      'user',
      'lastVisited',
      'onboardingComplete',
      'streakData',
      'achievementData',
      'leaderboardData',
      'discussionData',
      'reviewsData',
      'companyData',
      'problemsData',
      'analyticsData'
    ];

    // Remove specific keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear sessionStorage as well
    sessionStorage.clear();

    // Clear any IndexedDB data if used
    if ('indexedDB' in window) {
      // Note: This is a basic clear, might need more specific clearing based on actual usage
      indexedDB.databases?.().then(databases => {
        databases.forEach(db => {
          if (db.name?.includes('geniq') || db.name?.includes('interview')) {
            indexedDB.deleteDatabase(db.name);
          }
        });
      });
    }

    console.log('All local data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing local data:', error);
    return false;
  }
};

export const resetUserSession = () => {
  // Clear authentication data
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  
  // Clear user-specific data
  localStorage.removeItem('userProfile');
  localStorage.removeItem('userPreferences');
  
  // Keep theme preference as it's a user preference that should persist
  // localStorage.removeItem('theme'); // Don't remove this
  
  console.log('User session reset successfully');
};

export const resetApplicationData = () => {
  // Clear application data but keep user preferences
  const keysToKeep = ['theme', 'language', 'accessibility'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  sessionStorage.clear();
  console.log('Application data reset successfully');
};

export const getStorageUsage = () => {
  let totalSize = 0;
  const usage: Record<string, number> = {};
  
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      const size = localStorage[key].length;
      usage[key] = size;
      totalSize += size;
    }
  }
  
  return {
    totalSize,
    usage,
    totalSizeKB: Math.round(totalSize / 1024 * 100) / 100
  };
};