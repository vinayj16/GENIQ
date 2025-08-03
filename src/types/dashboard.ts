export interface DashboardStats {
  problemsSolved: number;
  dayStreak: number;
  successRate: number;
  companiesCount: number;
}

export interface Activity {
  id: number;
  type: string;
  title: string;
  status: string;
  time: string;
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  category: string;
}

export interface Review {
  id: number;
  company: string;
  role: string;
  date: string;
  author: string;
  experience: 'Positive' | 'Mixed' | 'Negative' | string; // Allow for detailed string experience
  difficulty: 'Easy' | 'Medium' | 'Hard' | string; // Allow for custom difficulty strings
  rating: number;
  interview_process: string;
  questions_asked: string[];
  preparation_tips: string;
  // Add optional fields for structured data
  status?: 'Selected' | 'Rejected' | 'In Progress';
  location?: string;
  rounds?: Array<{
    name: string;
    description: string;
    questions?: string[];
    tips?: string;
  }>;
  advice?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  joinDate?: string;
  lastActive?: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  company: string;
  role?: string;
  acceptance: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
  topics: string[];
  companies: string[];
  codeTemplate: {
    javascript: string;
    python: string;
    java: string;
    cpp?: string;
  };
  testCases: Array<{
    input: any;
    expected: any;
  }>;
  hints?: string[];
  solution?: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    explanation: string;
  };
  status?: 'Solved' | 'In Progress' | 'Not Started';
  lastAttempt?: string | null;
}


