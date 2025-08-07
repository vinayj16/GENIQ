import { Problem, Review } from '@/types/dashboard';
import { blink } from './blink';

// Base URL configuration - use Vite proxy in development, or relative URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Vite proxy will handle the base URL in development
  : '/api'; // In production, we use relative URL since frontend is served from the same domain

// Helper function to handle API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_API_KEY || '',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include' // Include cookies for authentication
    });

    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn(`⚠️ API endpoint ${endpoint} returned non-JSON response (${contentType})`);
      throw new Error(`API returned HTML instead of JSON for ${endpoint}`);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Helper function to simulate network delay
const simulateNetworkDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

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
    try {
      console.log('🔄 Fetching reviews from backend API...');
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.company) params.append('company', filters.company);
        if (filters.role) params.append('role', filters.role);
        if (filters.experience) params.append('experience', filters.experience);
      }
      
      const response = await apiRequest(`/reviews?${params.toString()}`, {
        method: 'GET'
      });
      
      console.log('✅ Reviews API response:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch reviews:', error);
      // Return filtered mock data as fallback
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
  }

  async getProblems(filters?: { difficulty?: string; category?: string; company?: string }) {
    try {
      console.log('🔄 Fetching filtered problems from backend API...');
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.difficulty) params.append('difficulty', filters.difficulty);
        if (filters.category) params.append('category', filters.category);
        if (filters.company) params.append('company', filters.company);
      }
      
      const response = await apiRequest(`/problems?${params.toString()}`, {
        method: 'GET'
      });
      
      console.log('✅ Filtered problems API response:', response);
      
      // Transform backend response to match Problem interface
      const problems = response.map((problem: any) => ({
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty || 'Medium',
        category: problem.category || 'General',
        description: problem.description || 'No description available.',
        company: 'Various',
        role: 'Software Engineer',
        acceptance: '50.0%',
        examples: [{
          input: 'Example input',
          output: 'Example output', 
          explanation: 'Example explanation'
        }],
        constraints: problem.constraints || ['No specific constraints'],
        topics: [problem.category || 'General'],
        companies: ['Various'],
        testCases: problem.testCases || [],
        codeTemplate: {
          javascript: problem.solution || '// Write your solution here',
          python: '# Write your solution here', 
          java: '// Write your solution here'
        },
        hints: ['Think about the problem step by step'],
        solution: {
          approach: 'Standard approach',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)', 
          explanation: 'Standard algorithm approach'
        }
      }));
      
      return problems;
    } catch (error) {
      console.error('❌ Failed to fetch filtered problems:', error);
      // Return filtered mock data as fallback
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
    try {
      console.log('🔄 Fetching dashboard stats from backend API...');
      const response = await apiRequest('/dashboard/stats', {
        method: 'GET'
      });
      
      console.log('✅ Dashboard stats API response:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch dashboard stats:', error);
      // Return mock data as fallback
      await simulateNetworkDelay();
      
      return {
        problemsSolved: 89,
        dayStreak: 5,
        successRate: 76,
        companiesCount: 12
      };
    }
  }

  async getDashboardActivity() {
    try {
      console.log('🔄 Fetching dashboard activity from backend API...');
      const response = await apiRequest('/dashboard/activity', {
        method: 'GET'
      });
      
      console.log('✅ Dashboard activity API response:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch dashboard activity:', error);
      // Return mock data as fallback
      await simulateNetworkDelay();
      
      return [
        {
          id: 1,
          type: 'problem_solved',
          title: 'Solved Two Sum',
          status: 'completed',
          time: '2 hours ago'
        },
        {
          id: 2,
          type: 'review_submitted',
          title: 'Submitted Google Interview Review',
          status: 'completed',
          time: '5 hours ago'
        },
        {
          id: 3,
          type: 'mcq_completed',
          title: 'Completed Amazon MCQ Test',
          status: 'completed',
          time: '1 day ago'
        }
      ];
    }
  }

  async getUserProfile() {
    try {
      console.log('🔄 Fetching user profile from backend API...');
      const response = await apiRequest('/user/profile', {
        method: 'GET'
      });
      
      console.log('✅ User profile API response:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      // Return mock data as fallback
      await simulateNetworkDelay();
      
      return {
        id: 'user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: null,
        role: 'Software Engineer',
        joinDate: '2024-01-15',
        lastActive: new Date().toISOString()
      };
    }
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

  // Submit interview review
  async submitReview(reviewData: any) {
    await simulateNetworkDelay();
    
    // Create a new review with ID and timestamp
    const newReview = {
      id: Date.now(),
      author: 'Anonymous User',
      date: new Date().toISOString().split('T')[0],
      ...reviewData
    };

    // Mock AI insights generation
    const aiInsights = {
      additional_prep_tips: `For ${reviewData.company} ${reviewData.role} positions, focus on ${reviewData.difficulty.toLowerCase()} level problems and system design fundamentals. Practice coding problems similar to those mentioned in the review.`,
      common_followup_questions: [
        'Can you explain your approach to solving this problem?',
        'How would you optimize this solution?',
        'What would you do if the input size was much larger?',
        'How would you handle edge cases?'
      ],
      industry_insights: `${reviewData.company} is known for rigorous technical interviews with emphasis on problem-solving skills and system design knowledge. The interview process typically involves multiple rounds of technical screening.`,
      salary_insights: `Based on similar roles and company size, ${reviewData.role} positions at ${reviewData.company} typically offer competitive compensation packages with good growth opportunities.`
    };

    return {
      success: true,
      review: newReview,
      aiInsights: aiInsights,
      message: 'Review submitted successfully!'
    };
  }

  // Enhanced Coding Problems method
  async getEnhancedCodingProblems(filters?: { company?: string; role?: string; difficulty?: string; category?: string }) {
    await simulateNetworkDelay();
    
    let problems = [...this.allProblems];
    
    // Add more sample problems for enhanced coding
    const enhancedProblems: Problem[] = [
      {
        id: 2,
        title: 'Add Two Numbers',
        difficulty: 'Medium',
        category: 'Linked List',
        description: 'You are given two non-empty linked lists representing two non-negative integers.',
        company: 'Amazon',
        role: 'Software Engineer',
        acceptance: '38.2%',
        examples: [
          {
            input: 'l1 = [2,4,3], l2 = [5,6,4]',
            output: '[7,0,8]',
            explanation: '342 + 465 = 807.'
          }
        ],
        constraints: [
          'The number of nodes in each linked list is in the range [1, 100].',
          '0 <= Node.val <= 9'
        ],
        topics: ['Linked List', 'Math', 'Recursion'],
        companies: ['Amazon', 'Microsoft', 'Facebook'],
        testCases: [
          { input: { l1: [2,4,3], l2: [5,6,4] }, expected: [7,0,8] },
          { input: { l1: [0], l2: [0] }, expected: [0] }
        ],
        codeTemplate: {
          javascript: `function addTwoNumbers(l1, l2) {
    // Write your solution here
    let dummy = new ListNode(0);
    let current = dummy;
    let carry = 0;
    
    while (l1 || l2 || carry) {
        let sum = carry;
        if (l1) {
            sum += l1.val;
            l1 = l1.next;
        }
        if (l2) {
            sum += l2.val;
            l2 = l2.next;
        }
        
        carry = Math.floor(sum / 10);
        current.next = new ListNode(sum % 10);
        current = current.next;
    }
    
    return dummy.next;
}`,
          python: `def addTwoNumbers(l1, l2):
    # Write your solution here
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        total = carry
        if l1:
            total += l1.val
            l1 = l1.next
        if l2:
            total += l2.val
            l2 = l2.next
            
        carry = total // 10
        current.next = ListNode(total % 10)
        current = current.next
    
    return dummy.next`,
          java: `public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    // Write your solution here
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;
    int carry = 0;
    
    while (l1 != null || l2 != null || carry != 0) {
        int sum = carry;
        if (l1 != null) {
            sum += l1.val;
            l1 = l1.next;
        }
        if (l2 != null) {
            sum += l2.val;
            l2 = l2.next;
        }
        
        carry = sum / 10;
        current.next = new ListNode(sum % 10);
        current = current.next;
    }
    
    return dummy.next;
}`
        },
        hints: [
          "Think about how you add numbers digit by digit.",
          "Don't forget to handle the carry from one digit to the next."
        ],
        solution: {
          approach: "Elementary Math",
          timeComplexity: "O(max(m, n))",
          spaceComplexity: "O(max(m, n))",
          explanation: "We simulate the process of adding two numbers digit by digit."
        }
      },
      {
        id: 3,
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        category: 'String',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        company: 'Google',
        role: 'Software Engineer',
        acceptance: '33.8%',
        examples: [
          {
            input: 's = "abcabcbb"',
            output: '3',
            explanation: 'The answer is "abc", with the length of 3.'
          }
        ],
        constraints: [
          '0 <= s.length <= 5 * 10^4',
          's consists of English letters, digits, symbols and spaces.'
        ],
        topics: ['Hash Table', 'String', 'Sliding Window'],
        companies: ['Google', 'Amazon', 'Facebook'],
        testCases: [
          { input: { s: "abcabcbb" }, expected: 3 },
          { input: { s: "bbbbb" }, expected: 1 },
          { input: { s: "pwwkew" }, expected: 3 }
        ],
        codeTemplate: {
          javascript: `function lengthOfLongestSubstring(s) {
    // Write your solution here
    let maxLength = 0;
    let left = 0;
    const charMap = new Map();
    
    for (let right = 0; right < s.length; right++) {
        if (charMap.has(s[right])) {
            left = Math.max(charMap.get(s[right]) + 1, left);
        }
        charMap.set(s[right], right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
          python: `def lengthOfLongestSubstring(s):
    # Write your solution here
    char_map = {}
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        if s[right] in char_map:
            left = max(char_map[s[right]] + 1, left)
        char_map[s[right]] = right
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
          java: `public int lengthOfLongestSubstring(String s) {
    // Write your solution here
    Map<Character, Integer> charMap = new HashMap<>();
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        if (charMap.containsKey(s.charAt(right))) {
            left = Math.max(charMap.get(s.charAt(right)) + 1, left);
        }
        charMap.put(s.charAt(right), right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`
        },
        hints: [
          "Use a sliding window approach with two pointers.",
          "Keep track of characters you've seen and their positions."
        ],
        solution: {
          approach: "Sliding Window",
          timeComplexity: "O(n)",
          spaceComplexity: "O(min(m, n))",
          explanation: "We use a sliding window with a hash map to track character positions."
        }
      }
    ];

    problems = [...problems, ...enhancedProblems];
    
    // Apply filters
    if (filters?.company) {
      problems = problems.filter(p => 
        p.company.toLowerCase().includes(filters.company!.toLowerCase()) ||
        p.companies?.some(c => c.toLowerCase().includes(filters.company!.toLowerCase()))
      );
    }
    
    if (filters?.difficulty) {
      problems = problems.filter(p => 
        p.difficulty.toLowerCase() === filters.difficulty!.toLowerCase()
      );
    }
    
    if (filters?.category) {
      problems = problems.filter(p => 
        p.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    
    return problems;
  }

  // Add AI analysis method using Blink SDK
  async analyzeCode(code: string, language: string = 'javascript') {
    try {
      console.log('🔄 Analyzing code with AI...');
      
      const { text } = await blink.ai.generateText({
        prompt: `You are an expert code reviewer. Analyze this ${language} code and provide detailed feedback.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Overall assessment and score (1-100)
2. Code quality feedback
3. Specific suggestions for improvement
4. Performance considerations

Format your response clearly with sections.`,
        model: 'gpt-4o-mini',
        maxTokens: 800
      });
      
      console.log('✅ AI analysis response:', text);
      
      // Parse score from response or default to 85
      const scoreMatch = text.match(/score[:\s]*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 85;
      
      return {
        analysis: text,
        feedback: text,
        score: score,
        suggestions: [
          'Consider edge cases',
          'Add error handling', 
          'Optimize for performance'
        ],
        overallScore: score,
        codeQuality: Math.max(score - 5, 70),
        efficiency: Math.min(score + 5, 95)
      };
    } catch (error) {
      console.error('❌ Failed to analyze code:', error);
      throw error;
    }
  }

  // Add AI hint functionality using Blink SDK
  async getAIHint(currentCode?: string, problemDescription?: string) {
    try {
      console.log('🔄 Getting AI hint...');
      
      const { text } = await blink.ai.generateText({
        prompt: `You are a helpful coding mentor. The user is working on this problem:

Problem: ${problemDescription || 'A coding challenge'}

Their current code:
\`\`\`
${currentCode || 'No code written yet'}
\`\`\`

Provide a helpful hint that guides them toward the solution without giving it away completely. Be encouraging and educational.`,
        model: 'gpt-4o-mini',
        maxTokens: 300
      });
      
      console.log('✅ AI hint response:', text);
      return text;
    } catch (error) {
      console.error('❌ Failed to get AI hint:', error);
      throw error;
    }
  }

  // Get problems from backend API
  async getFallbackProblems() {
    try {
      console.log('🔄 Fetching problems from backend API...');
      
      // Check if response is JSON by examining content-type
      const url = `${API_BASE_URL}/problems`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
        credentials: 'include'
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('⚠️ API returned non-JSON response, using fallback data');
        throw new Error('API returned HTML instead of JSON');
      }

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Backend API response received:', data);
      
      // Transform backend response to match Problem interface
      const problems = data.map((problem: any) => ({
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty || 'Medium',
        category: problem.category || 'General',
        description: problem.description || 'No description available.',
        company: 'Various',
        role: 'Software Engineer',
        acceptance: '50.0%',
        examples: [{
          input: 'Example input',
          output: 'Example output', 
          explanation: 'Example explanation'
        }],
        constraints: problem.constraints || ['No specific constraints'],
        topics: [problem.category || 'General'],
        companies: ['Various'],
        testCases: problem.testCases || [],
        codeTemplate: {
          javascript: problem.solution || '// Write your solution here',
          python: '# Write your solution here',
          java: '// Write your solution here'
        },
        hints: ['Think about the problem step by step'],
        solution: {
          approach: 'Standard approach',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          explanation: 'Standard algorithm approach'
        }
      }));
      
      console.log('✅ Transformed problems:', problems.length);
      return problems;
    } catch (error) {
      console.error('❌ Failed to fetch problems from API:', error);
      console.log('🔄 Using fallback mock data instead');
      // Return mock data as fallback
      await simulateNetworkDelay();
      return this.allProblems;
    }
  }

  // Enhanced MCQs method
  async getMCQs(filters?: { company?: string; category?: string; difficulty?: string; limit?: number }) {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.company) params.append('company', filters.company);
        if (filters.category && filters.category !== 'all') params.append('category', filters.category);
        if (filters.difficulty && filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
        if (filters.limit) params.append('limit', filters.limit.toString());
      }
      
      // Make API request
      const response = await apiRequest(`/mcqs?${params.toString()}`, {
        method: 'GET'
      });
      
      // Transform API response to match MCQ interface
      const mcqs = response.map((mcq: any) => ({
        id: mcq.id || `mcq-${Math.random().toString(36).substr(2, 9)}`,
        question: mcq.question,
        options: mcq.options || [],
        correct: mcq.correctIndex || 0,
        category: mcq.category || 'General',
        difficulty: mcq.difficulty || 'Medium',
        company: mcq.company || filters?.company || 'General',
        role: mcq.role || 'Software Engineer',
        explanation: mcq.explanation || 'No explanation available',
        showExplanation: false,
        userAnswer: null
      }));
      
      return mcqs;
    } catch (error) {
      console.error('Failed to fetch MCQs:', error);
      // Return empty array in case of error
      return [];
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;