import { Problem, Review } from '@/types/dashboard';

// Base URL configuration - use Vite proxy in development, or full URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? ''  // Vite proxy will handle the base URL in development
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Add a small delay to simulate network latency in development
const simulateNetworkDelay = async () => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};

class ApiService {
  private allReviews: Review[] = [
    {
      id: 1,
      author: 'Cisco Candidate 1',
      company: 'Cisco',
      role: 'Software Developer Intern',
      experience: 'Positive',
      difficulty: 'Hard',
      rating: 4,
      date: '2024-06-15',
      interview_process: '3 Rounds: OA, Technical, HR',
      questions_asked: ['Reverse Linked List', 'SQL Joins', 'OOPs concepts', 'Data Structures'],
      preparation_tips: 'Focus on DSA and core CS concepts. Practice Leetcode medium problems.'
    },
    {
      id: 2,
      author: 'Cisco Candidate 2',
      company: 'Cisco',
      role: 'Full Stack Developer',
      experience: 'Positive',
      difficulty: 'Medium',
      rating: 5,
      date: '2024-05-20',
      interview_process: '3 Rounds: Technical Screen, Panel, HR',
      questions_asked: ['React concepts', 'Node.js architecture', 'REST API design', 'System design basics'],
      preparation_tips: 'Prepare your portfolio projects. Be ready for in-depth technical discussions.'
    }
  ];

  private allProblems: Problem[] = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Array',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
      company: 'Facebook',
      role: 'Software Engineer',
      acceptance: '50.5%',
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        }
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        'Only one valid answer exists.'
      ],
      topics: ['Array', 'Hash Table'],
      companies: ['Google', 'Amazon', 'Apple'],
      testCases: [
        { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
      ],
      codeTemplate: {
        javascript: `function twoSum(nums, target) {
    // Write your solution here
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
        python: `def twoSum(nums, target):
    # Write your solution here
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`
      },
      hints: [
        "Think about using a hash table to store numbers you've seen before.",
        "For each number, calculate what its complement should be to reach the target."
      ],
      solution: {
        approach: "Hash Table (One Pass)",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        explanation: "We iterate through the array once, using a hash table to store numbers and their indices."
      }
    }
  ];

  async getCodingProblems() {
    await simulateNetworkDelay();
    return [
      {
        id: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Array',
        status: 'Solved',
        lastAttempt: '2024-08-01',
      },
      {
        id: 2,
        title: 'Add Two Numbers',
        difficulty: 'Medium',
        category: 'Linked List',
        status: 'In Progress',
        lastAttempt: '2024-07-30',
      },
      {
        id: 3,
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        category: 'String',
        status: 'Not Started',
        lastAttempt: null,
      },
    ];
  }

  async getReviews(filters?: { company?: string; role?: string; experience?: string }) {
    await simulateNetworkDelay();
    
    let filteredReviews = this.allReviews;
    
    if (filters?.company) {
      filteredReviews = filteredReviews.filter(review => 
        review.company.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }
    
    if (filters?.role) {
      filteredReviews = filteredReviews.filter(review => 
        review.role.toLowerCase().includes(filters.role!.toLowerCase())
      );
    }
    
    if (filters?.experience) {
      filteredReviews = filteredReviews.filter(review => 
        review.experience.toLowerCase() === filters.experience!.toLowerCase()
      );
    }
    
    return filteredReviews;
  }

  async getProblems(filters?: { difficulty?: string; category?: string; company?: string }) {
    await simulateNetworkDelay();
    
    let filteredProblems = this.allProblems;
    
    if (filters?.difficulty) {
      filteredProblems = filteredProblems.filter(problem => 
        problem.difficulty.toLowerCase() === filters.difficulty!.toLowerCase()
      );
    }
    
    if (filters?.category) {
      filteredProblems = filteredProblems.filter(problem => 
        problem.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }
    
    if (filters?.company) {
      filteredProblems = filteredProblems.filter(problem => 
        problem.companies?.some(company => 
          company.toLowerCase().includes(filters.company!.toLowerCase())
        )
      );
    }
    
    return filteredProblems;
  }

  async getProblemById(id: number) {
    await simulateNetworkDelay();
    return this.allProblems.find(problem => problem.id === id) || null;
  }

  async submitSolution(problemId: number, code: string, language: string) {
    await simulateNetworkDelay();
    
    // Mock solution submission
    return {
      success: true,
      testsPassed: Math.floor(Math.random() * 8) + 2,
      totalTests: 10,
      executionTime: Math.floor(Math.random() * 100) + 50,
      memoryUsed: Math.floor(Math.random() * 50) + 20,
      feedback: 'Good solution! Consider optimizing for better performance.'
    };
  }

  async runTests(problemId: number, code: string, language: string) {
    await simulateNetworkDelay();
    
    const problem = this.allProblems.find(p => p.id === problemId);
    if (!problem) {
      throw new Error('Problem not found');
    }

    // Mock test execution
    const results = problem.testCases?.map(testCase => ({
      ...testCase,
      passed: Math.random() > 0.3,
      executionTime: Math.floor(Math.random() * 50) + 10,
      output: testCase.expected
    })) || [];

    return {
      results,
      allPassed: results.every(r => r.passed),
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length
    };
  }

  // Dashboard analytics methods
  async getDashboardStats() {
    await simulateNetworkDelay();
    
    return {
      problemsSolved: 89,
      dayStreak: 5,
      successRate: 76,
      companiesCount: 12
    };
  }

  async getProgressData() {
    await simulateNetworkDelay();
    
    return {
      weeklyProgress: [
        { week: 'Week 1', solved: 12, target: 15 },
        { week: 'Week 2', solved: 18, target: 15 },
        { week: 'Week 3', solved: 14, target: 15 },
        { week: 'Week 4', solved: 20, target: 15 }
      ],
      difficultyBreakdown: {
        easy: { solved: 45, total: 120 },
        medium: { solved: 32, total: 80 },
        hard: { solved: 12, total: 40 }
      },
      topicProgress: [
        { topic: 'Arrays', solved: 25, total: 40, percentage: 62.5 },
        { topic: 'Strings', solved: 18, total: 30, percentage: 60 },
        { topic: 'Trees', solved: 15, total: 25, percentage: 60 },
        { topic: 'Graphs', solved: 8, total: 20, percentage: 40 },
        { topic: 'Dynamic Programming', solved: 6, total: 15, percentage: 40 }
      ]
    };
  }

  // Company-specific methods
  async getCompanyProblems(companyId: string) {
    await simulateNetworkDelay();
    
    // Filter problems by company
    const companyProblems = this.allProblems.filter(problem => 
      problem.companies?.includes(companyId) || 
      problem.company?.toLowerCase() === companyId.toLowerCase()
    );
    
    return companyProblems;
  }

  async getCompanyInterviewExperiences(companyId: string) {
    await simulateNetworkDelay();
    
    // Filter reviews by company
    const companyReviews = this.allReviews.filter(review => 
      review.company.toLowerCase() === companyId.toLowerCase()
    );
    
    return companyReviews;
  }

  async getCompanyAnalytics(companyId: string) {
    await simulateNetworkDelay();
    
    // Mock analytics data for company
    return {
      totalProblems: Math.floor(Math.random() * 500) + 100,
      solvedProblems: Math.floor(Math.random() * 50),
      successRate: Math.floor(Math.random() * 40) + 60,
      averageTime: Math.floor(Math.random() * 60) + 30,
      difficultyBreakdown: {
        easy: Math.floor(Math.random() * 30) + 20,
        medium: Math.floor(Math.random() * 40) + 30,
        hard: Math.floor(Math.random() * 30) + 15
      },
      topicBreakdown: {
        'Arrays': Math.floor(Math.random() * 25) + 15,
        'Strings': Math.floor(Math.random() * 20) + 10,
        'Trees': Math.floor(Math.random() * 20) + 10,
        'Graphs': Math.floor(Math.random() * 15) + 8,
        'Dynamic Programming': Math.floor(Math.random() * 15) + 5,
        'System Design': Math.floor(Math.random() * 10) + 5
      }
    };
  }

  async startCompanyPractice(companyId: string, problemId: number) {
    await simulateNetworkDelay();
    
    // Mock starting a practice session
    return {
      sessionId: `${companyId}-${problemId}-${Date.now()}`,
      problem: this.allProblems.find(p => p.id === problemId),
      startTime: new Date().toISOString(),
      features: {
        aiHints: true,
        voiceCoding: true,
        whiteboard: true,
        peerReview: true
      }
    };
  }

  async submitCompanySolution(sessionId: string, code: string, language: string) {
    await simulateNetworkDelay();
    
    // Mock solution submission with AI feedback
    const feedback = {
      passed: Math.random() > 0.3,
      testsPassed: Math.floor(Math.random() * 8) + 2,
      totalTests: 10,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      aiSuggestions: [
        'Consider using a hash map for O(1) lookup time',
        'Your solution handles edge cases well',
        'The code is clean and readable'
      ],
      optimizationTips: [
        'You can reduce space complexity by using two pointers',
        'Consider the trade-off between time and space complexity'
      ],
      score: Math.floor(Math.random() * 40) + 60
    };
    
    return feedback;
  }

  async getVoiceCodingSession(companyId: string, problemId: number) {
    await simulateNetworkDelay();
    
    // Mock voice coding session setup
    return {
      sessionId: `voice-${companyId}-${problemId}-${Date.now()}`,
      speechRecognitionEnabled: true,
      supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
      voiceCommands: [
        'start coding',
        'run tests',
        'explain solution',
        'get hint',
        'submit solution'
      ],
      accessibility: {
        screenReader: true,
        highContrast: true,
        largeText: true
      }
    };
  }

  async getWhiteboardSession(companyId: string, problemType: 'algorithm' | 'system-design') {
    await simulateNetworkDelay();
    
    // Mock whiteboard session
    return {
      sessionId: `whiteboard-${companyId}-${problemType}-${Date.now()}`,
      tools: {
        pen: true,
        shapes: true,
        text: true,
        eraser: true,
        colors: ['black', 'red', 'blue', 'green'],
        templates: problemType === 'system-design' ? [
          'Basic Architecture',
          'Database Design',
          'API Design',
          'Microservices'
        ] : [
          'Tree Structure',
          'Graph',
          'Array Visualization',
          'Algorithm Flow'
        ]
      },
      collaboration: {
        realTime: true,
        sharing: true,
        recording: true
      }
    };
  }

  async getPeerReviews(solutionId: string) {
    await simulateNetworkDelay();
    
    // Mock peer reviews
    return [
      {
        id: 1,
        reviewer: 'CodeMaster123',
        rating: 4,
        comment: 'Great solution! Clean and efficient approach.',
        timestamp: '2024-01-15T10:30:00Z',
        helpful: 12,
        suggestions: ['Consider adding more comments', 'Edge case handling could be improved']
      },
      {
        id: 2,
        reviewer: 'AlgoExpert',
        rating: 5,
        comment: 'Perfect implementation with optimal time complexity.',
        timestamp: '2024-01-14T15:45:00Z',
        helpful: 8,
        suggestions: ['Well done!']
      }
    ];
  }

  async submitPeerReview(solutionId: string, rating: number, comment: string) {
    await simulateNetworkDelay();
    
    // Mock submitting peer review
    return {
      success: true,
      reviewId: `review-${solutionId}-${Date.now()}`,
      message: 'Review submitted successfully!'
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;