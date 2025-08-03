/**
 * Application initialization utility
 * Clears old data and sets up fresh state for new users
 */

import { clearAllLocalData } from './clearLocalData';

export const initializeApp = () => {
  // Clear all existing data
  clearAllLocalData();
  
  // Set up fresh initial state
  const initialState = {
    appVersion: '1.0.0',
    initialized: true,
    firstVisit: new Date().toISOString(),
    onboardingComplete: false,
    
    // Fresh user stats
    userStats: {
      problemsSolved: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalSubmissions: 0,
      successfulSubmissions: 0,
      averageTime: 0,
      favoriteLanguage: 'javascript',
      skillLevel: 'beginner',
      joinDate: new Date().toISOString()
    },
    
    // Fresh progress tracking
    progress: {
      codingProblems: {
        easy: { solved: 0, total: 150 },
        medium: { solved: 0, total: 200 },
        hard: { solved: 0, total: 100 }
      },
      mcqs: {
        completed: 0,
        correct: 0,
        total: 500
      },
      interviews: {
        completed: 0,
        successful: 0
      }
    },
    
    // Fresh achievements
    achievements: [],
    
    // Fresh preferences (keep theme if it exists)
    preferences: {
      theme: localStorage.getItem('theme') || 'system',
      language: 'en',
      notifications: true,
      emailUpdates: false,
      difficulty: 'mixed',
      practiceReminders: true
    }
  };
  
  // Store the fresh state
  localStorage.setItem('geniq_app_state', JSON.stringify(initialState));
  
  console.log('App initialized with fresh state');
  return initialState;
};

export const getAppState = () => {
  const stored = localStorage.getItem('geniq_app_state');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing app state:', error);
      return initializeApp();
    }
  }
  return initializeApp();
};

export const updateAppState = (updates: any) => {
  const currentState = getAppState();
  const newState = { ...currentState, ...updates };
  localStorage.setItem('geniq_app_state', JSON.stringify(newState));
  return newState;
};

export const resetToFreshState = () => {
  console.log('Resetting to fresh state...');
  return initializeApp();
};