import { Problem, Review } from '@/types/dashboard';

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
  async getEnhancedCodingProblems(filters?: { company?: string; role?: string; difficulty?: string; category?: string; limit?: number }) {
    let apiProblems: any[] = [];
    
    // Try to fetch from API first
    try {
      console.log('🔄 Fetching coding problems from backend API...');
      
      // Build query parameters with cache-busting
      const params = new URLSearchParams();
      if (filters?.company) params.append('company', filters.company);
      if (filters?.role) params.append('role', filters.role);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.category) params.append('category', filters.category);
      // Request more problems to ensure we get at least 5-10, preferably 20
      const requestLimit = filters?.limit || 25;
      params.append('limit', requestLimit.toString());
      
      // Add cache-busting parameter to ensure fresh requests
      params.append('_t', Date.now().toString());
      
      // Add a random seed to get different questions each time
      params.append('seed', Math.random().toString(36).substring(7));
      
      console.log('🔍 Request params:', Object.fromEntries(params));
      console.log('🌐 Full API URL:', `/problems?${params.toString()}`);
      
      // Try both GET with query params and POST with JSON body
      let response;
      try {
        console.log('🔄 Trying GET request with query parameters...');
        response = await apiRequest(`/problems?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      } catch (error) {
        console.warn('⚠️ GET request failed, trying POST with JSON body');
        // Some APIs expect POST with JSON body instead of GET with query params
        const requestBody = {
          company: filters?.company,
          role: filters?.role,
          difficulty: filters?.difficulty,
          category: filters?.category,
          limit: requestLimit
        };
        
        response = await apiRequest('/problems', {
          method: 'POST',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          body: JSON.stringify(requestBody)
        });
      }
      
      if (response && Array.isArray(response) && response.length > 0) {
        console.log('✅ Received coding problems from API:', response.length, 'problems');
        console.log('🔍 API Response sample:', response[0]); // Debug: see what the API returns
      console.log('⚠️ Backend is returning same problems for all companies - implementing client-side filtering');
        
        apiProblems = response.map((problem: any) => ({
          ...problem,
          testCases: problem.testCases || [],
          codeTemplate: problem.codeTemplate || {
            javascript: '// Write your solution here',
            python: '# Write your solution here',
            java: '// Write your solution here'
          }
        }));
      } else {
        console.warn('⚠️ No problems returned from API');
      }
    } catch (error) {
      console.error('❌ Failed to fetch problems from API:', error);
    }
    
    // If we have API problems, enhance them with company-specific variations
    if (apiProblems.length > 0) {
      console.log('✅ Using API problems with client-side company filtering:', apiProblems.length);
      
      // Since backend doesn't filter by company/role, create variations on frontend
      const companySpecificProblems = this.createCompanySpecificProblems(apiProblems, filters);
      
      const requestedLimit = filters?.limit || 10;
      const finalProblems = companySpecificProblems.slice(0, requestedLimit);
      
      console.log(`✅ Returning ${finalProblems.length} company-specific problems for ${filters?.company || 'general'} ${filters?.role || 'role'}`);
      return finalProblems;
    }
    
    // Only use fallback data if API returned no problems
    console.log('🔄 No API problems available, using fallback data...');
      
      // Fallback to mock data if API fails
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
        }
      ];

    // Fallback data only (when API returns no problems)
    let fallbackProblems = [...this.allProblems, ...enhancedProblems];
    
    // Apply filters to fallback data
    if (filters?.company) {
      fallbackProblems = fallbackProblems.filter(p => 
        p.company?.toLowerCase().includes(filters.company!.toLowerCase()) ||
        p.companies?.some((c: string) => c.toLowerCase().includes(filters.company!.toLowerCase()))
      );
    }
    
    if (filters?.difficulty) {
      fallbackProblems = fallbackProblems.filter(p => 
        p.difficulty?.toLowerCase() === filters.difficulty!.toLowerCase()
      );
    }
    
    if (filters?.category) {
      fallbackProblems = fallbackProblems.filter(p => 
        p.category?.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    
    const requestedLimit = filters?.limit || 10;
    const finalFallbackProblems = fallbackProblems.slice(0, Math.max(requestedLimit, 2));
    
    console.log(`✅ Returning ${finalFallbackProblems.length} fallback problems`);
    return finalFallbackProblems;
  }

  // Create company-specific variations of problems (client-side workaround)
  private createCompanySpecificProblems(baseProblems: any[], filters?: any) {
    const company = filters?.company?.toLowerCase() || 'general';
    const role = filters?.role || 'Software Engineer';
    
    // Enhanced company-specific problem variations with more problems per company
    const companyProblems: { [key: string]: any[] } = {
      'amazon': [
        {
          id: 'amazon-1',
          title: 'Two Sum - Amazon Style',
          description: 'Amazon warehouse needs to find two package weights that sum to target weight for optimal shipping.',
          difficulty: 'Medium',
          category: 'algorithms',
          company: 'Amazon',
          role: role,
          acceptance: '65.2%',
          examples: [
            {
              input: 'weights = [2,7,11,15], target = 9',
              output: '[0,1]',
              explanation: 'Package weights 2 + 7 = 9, so return indices [0,1]'
            }
          ],
          constraints: [
            '2 <= weights.length <= 10^4',
            '-10^9 <= weights[i] <= 10^9',
            'Only one valid answer exists'
          ],
          topics: ['Array', 'Hash Table', 'Amazon Logistics'],
          companies: ['Amazon'],
          hints: [
            'Think about Amazon warehouse optimization',
            'Use hash table for O(1) lookup time'
          ],
          codeTemplate: {
            javascript: `function twoSum(weights, target) {
  // Amazon-specific implementation for package optimization
  const map = new Map();
  for (let i = 0; i < weights.length; i++) {
    const complement = target - weights[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(weights[i], i);
  }
  return [];
}`,
            python: `def two_sum(weights, target):
    # Amazon package optimization
    weight_map = {}
    for i, weight in enumerate(weights):
        complement = target - weight
        if complement in weight_map:
            return [weight_map[complement], i]
        weight_map[weight] = i
    return []`,
            java: `public int[] twoSum(int[] weights, int target) {
    // Amazon package optimization
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < weights.length; i++) {
        int complement = target - weights[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(weights[i], i);
    }
    return new int[]{};
}`
          },
          testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
            { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
          ]
        },
        {
          id: 'amazon-2',
          title: 'Valid Parentheses - Delivery Routes',
          description: 'Amazon delivery system needs to validate route brackets for optimal delivery paths.',
          difficulty: 'Easy',
          category: 'stack',
          company: 'Amazon',
          role: role,
          codeTemplate: {
            javascript: `function isValidRoute(route) {
  // Amazon delivery route validation
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of route) {
    if (char in pairs) {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
            python: `def is_valid_route(route):
    # Amazon delivery route validation
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in route:
        if char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0`,
            java: `public boolean isValidRoute(String route) {
    // Amazon delivery route validation
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> pairs = new HashMap<>();
    pairs.put(')', '(');
    pairs.put('}', '{');
    pairs.put(']', '[');
    
    for (char c : route.toCharArray()) {
        if (pairs.containsKey(c)) {
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) {
                return false;
            }
        } else {
            stack.push(c);
        }
    }
    
    return stack.isEmpty();
}`
          },
          testCases: [
            { input: { s: "()" }, expected: true },
            { input: { s: "()[]{}" }, expected: true }
          ]
        },
        {
          id: 'amazon-3',
          title: 'Longest Substring - Product Search',
          description: 'Amazon product search needs to find longest substring without repeating characters for search optimization.',
          difficulty: 'Medium',
          category: 'string',
          company: 'Amazon',
          role: role,
          codeTemplate: {
            javascript: `function lengthOfLongestSubstring(s) {
  // Amazon product search optimization
  let maxLength = 0;
  let start = 0;
  const charMap = new Map();
  
  for (let end = 0; end < s.length; end++) {
    if (charMap.has(s[end])) {
      start = Math.max(charMap.get(s[end]) + 1, start);
    }
    charMap.set(s[end], end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  
  return maxLength;
}`,
            python: `def length_of_longest_substring(s):
    # Amazon product search optimization
    max_length = 0
    start = 0
    char_map = {}
    
    for end in range(len(s)):
        if s[end] in char_map:
            start = max(char_map[s[end]] + 1, start)
        char_map[s[end]] = end
        max_length = max(max_length, end - start + 1)
    
    return max_length`,
            java: `public int lengthOfLongestSubstring(String s) {
    // Amazon product search optimization
    int maxLength = 0;
    int start = 0;
    Map<Character, Integer> charMap = new HashMap<>();
    
    for (int end = 0; end < s.length(); end++) {
        if (charMap.containsKey(s.charAt(end))) {
            start = Math.max(charMap.get(s.charAt(end)) + 1, start);
        }
        charMap.put(s.charAt(end), end);
        maxLength = Math.max(maxLength, end - start + 1);
    }
    
    return maxLength;
}`
          },
          testCases: [
            { input: { s: "abcabcbb" }, expected: 3 },
            { input: { s: "bbbbb" }, expected: 1 }
          ]
        },
        {
          id: 'amazon-4',
          title: 'Merge Intervals - Delivery Slots',
          description: 'Amazon delivery system needs to merge overlapping delivery time slots for efficiency.',
          difficulty: 'Medium',
          category: 'array',
          company: 'Amazon',
          role: role,
          codeTemplate: {
            javascript: `function merge(intervals) {
  // Amazon delivery slot optimization
  if (intervals.length <= 1) return intervals;
  
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = result[result.length - 1];
    
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current);
    }
  }
  
  return result;
}`,
            python: `def merge(intervals):
    # Amazon delivery slot optimization
    if len(intervals) <= 1:
        return intervals
    
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]
    
    for current in intervals[1:]:
        last = result[-1]
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            result.append(current)
    
    return result`,
            java: `public int[][] merge(int[][] intervals) {
    // Amazon delivery slot optimization
    if (intervals.length <= 1) return intervals;
    
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> result = new ArrayList<>();
    result.add(intervals[0]);
    
    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] last = result.get(result.size() - 1);
        
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            result.add(current);
        }
    }
    
    return result.toArray(new int[result.size()][]);
}`
          },
          testCases: [
            { input: { intervals: [[1,3],[2,6],[8,10],[15,18]] }, expected: [[1,6],[8,10],[15,18]] }
          ]
        },
        {
          id: 'amazon-5',
          title: 'Binary Tree Level Order - Warehouse Levels',
          description: 'Amazon warehouse management needs to process inventory by warehouse levels.',
          difficulty: 'Medium',
          category: 'tree',
          company: 'Amazon',
          role: role,
          codeTemplate: {
            javascript: `function levelOrder(root) {
  // Amazon warehouse level processing
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}`,
            python: `def level_order(root):
    # Amazon warehouse level processing
    if not root:
        return []
    
    result = []
    queue = [root]
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.pop(0)
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result`,
            java: `public List<List<Integer>> levelOrder(TreeNode root) {
    // Amazon warehouse level processing
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            currentLevel.add(node.val);
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        
        result.add(currentLevel);
    }
    
    return result;
}`
          },
          testCases: [
            { input: { root: [3,9,20,null,null,15,7] }, expected: [[3],[9,20],[15,7]] }
          ]
        }
      ],
      'google': [
        {
          id: 'google-1',
          title: 'Two Sum - Search Algorithm',
          description: 'Google search needs to find two query terms that together match user intent score.',
          difficulty: 'Medium',
          category: 'algorithms',
          company: 'Google',
          role: role,
          codeTemplate: {
            javascript: `function twoSum(queries, targetScore) {
  // Google search optimization algorithm
  const scoreMap = new Map();
  for (let i = 0; i < queries.length; i++) {
    const complement = targetScore - queries[i];
    if (scoreMap.has(complement)) {
      return [scoreMap.get(complement), i];
    }
    scoreMap.set(queries[i], i);
  }
  return [];
}`,
            python: `def two_sum(queries, target_score):
    # Google search optimization
    score_map = {}
    for i, score in enumerate(queries):
        complement = target_score - score
        if complement in score_map:
            return [score_map[complement], i]
        score_map[score] = i
    return []`,
            java: `public int[] twoSum(int[] queries, int targetScore) {
    // Google search optimization
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < queries.length; i++) {
        int complement = targetScore - queries[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(queries[i], i);
    }
    return new int[]{};
}`
          },
          testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
            { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
          ]
        },
        {
          id: 'google-2',
          title: 'PageRank Algorithm',
          description: 'Implement a simplified PageRank algorithm for web page ranking.',
          difficulty: 'Hard',
          category: 'graph',
          company: 'Google',
          role: role,
          codeTemplate: {
            javascript: `function pageRank(graph, iterations = 10) {
  // Simplified PageRank implementation
  const nodes = Object.keys(graph);
  let ranks = {};
  
  // Initialize ranks
  nodes.forEach(node => ranks[node] = 1.0 / nodes.length);
  
  for (let i = 0; i < iterations; i++) {
    const newRanks = {};
    nodes.forEach(node => {
      newRanks[node] = 0.15 / nodes.length;
      // Add contributions from linking pages
      nodes.forEach(linkingNode => {
        if (graph[linkingNode] && graph[linkingNode].includes(node)) {
          newRanks[node] += 0.85 * ranks[linkingNode] / graph[linkingNode].length;
        }
      });
    });
    ranks = newRanks;
  }
  
  return ranks;
}`,
            python: `def page_rank(graph, iterations=10):
    # Simplified PageRank implementation
    nodes = list(graph.keys())
    ranks = {node: 1.0 / len(nodes) for node in nodes}
    
    for _ in range(iterations):
        new_ranks = {}
        for node in nodes:
            new_ranks[node] = 0.15 / len(nodes)
            for linking_node in nodes:
                if linking_node in graph and node in graph[linking_node]:
                    new_ranks[node] += 0.85 * ranks[linking_node] / len(graph[linking_node])
        ranks = new_ranks
    
    return ranks`,
            java: `public Map<String, Double> pageRank(Map<String, List<String>> graph, int iterations) {
    // Simplified PageRank implementation
    Set<String> nodes = graph.keySet();
    Map<String, Double> ranks = new HashMap<>();
    
    // Initialize ranks
    for (String node : nodes) {
        ranks.put(node, 1.0 / nodes.size());
    }
    
    for (int i = 0; i < iterations; i++) {
        Map<String, Double> newRanks = new HashMap<>();
        for (String node : nodes) {
            newRanks.put(node, 0.15 / nodes.size());
            for (String linkingNode : nodes) {
                if (graph.containsKey(linkingNode) && graph.get(linkingNode).contains(node)) {
                    newRanks.put(node, newRanks.get(node) + 0.85 * ranks.get(linkingNode) / graph.get(linkingNode).size());
                }
            }
        }
        ranks = newRanks;
    }
    
    return ranks;
}`
          },
          testCases: [
            { input: { graph: { 'A': ['B'], 'B': ['A'] } }, expected: { 'A': 0.5, 'B': 0.5 } }
          ]
        },
        {
          id: 'google-3',
          title: 'LRU Cache - Search Results',
          description: 'Google search needs an LRU cache for storing recent search results efficiently.',
          difficulty: 'Medium',
          category: 'design',
          company: 'Google',
          role: role,
          codeTemplate: {
            javascript: `class LRUCache {
  constructor(capacity) {
    // Google search results cache
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}`,
            python: `class LRUCache:
    def __init__(self, capacity):
        # Google search results cache
        self.capacity = capacity
        self.cache = {}
        self.order = []
    
    def get(self, key):
        if key in self.cache:
            self.order.remove(key)
            self.order.append(key)
            return self.cache[key]
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            self.order.remove(key)
        elif len(self.cache) >= self.capacity:
            oldest = self.order.pop(0)
            del self.cache[oldest]
        
        self.cache[key] = value
        self.order.append(key)`,
            java: `class LRUCache {
    private int capacity;
    private Map<Integer, Integer> cache;
    
    public LRUCache(int capacity) {
        // Google search results cache
        this.capacity = capacity;
        this.cache = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry eldest) {
                return size() > LRUCache.this.capacity;
            }
        };
    }
    
    public int get(int key) {
        return cache.getOrDefault(key, -1);
    }
    
    public void put(int key, int value) {
        cache.put(key, value);
    }
}`
          },
          testCases: [
            { input: { operations: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"] }, expected: [null, null, null, 1, null, -1, null, -1, 3, 4] }
          ]
        },
        {
          id: 'google-4',
          title: 'Word Ladder - Search Suggestions',
          description: 'Google search suggestions need to find shortest transformation sequence between words.',
          difficulty: 'Hard',
          category: 'graph',
          company: 'Google',
          role: role,
          codeTemplate: {
            javascript: `function ladderLength(beginWord, endWord, wordList) {
  // Google search suggestions algorithm
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  
  const queue = [[beginWord, 1]];
  const visited = new Set([beginWord]);
  
  while (queue.length > 0) {
    const [word, level] = queue.shift();
    
    if (word === endWord) return level;
    
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        
        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord);
          queue.push([newWord, level + 1]);
        }
      }
    }
  }
  
  return 0;
}`,
            python: `def ladder_length(begin_word, end_word, word_list):
    # Google search suggestions algorithm
    word_set = set(word_list)
    if end_word not in word_set:
        return 0
    
    queue = [(begin_word, 1)]
    visited = {begin_word}
    
    while queue:
        word, level = queue.pop(0)
        
        if word == end_word:
            return level
        
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, level + 1))
    
    return 0`,
            java: `public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    // Google search suggestions algorithm
    Set<String> wordSet = new HashSet<>(wordList);
    if (!wordSet.contains(endWord)) return 0;
    
    Queue<String> queue = new LinkedList<>();
    queue.offer(beginWord);
    Set<String> visited = new HashSet<>();
    visited.add(beginWord);
    
    int level = 1;
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            String word = queue.poll();
            if (word.equals(endWord)) return level;
            
            for (int j = 0; j < word.length(); j++) {
                for (char c = 'a'; c <= 'z'; c++) {
                    String newWord = word.substring(0, j) + c + word.substring(j + 1);
                    if (wordSet.contains(newWord) && !visited.contains(newWord)) {
                        visited.add(newWord);
                        queue.offer(newWord);
                    }
                }
            }
        }
        level++;
    }
    
    return 0;
}`
          },
          testCases: [
            { input: { beginWord: "hit", endWord: "cog", wordList: ["hot","dot","dog","lot","log","cog"] }, expected: 5 }
          ]
        }
      ],
      'microsoft': [
        {
          id: 'microsoft-1',
          title: 'Two Sum - Office Integration',
          description: 'Microsoft Office needs to find two cell values that sum to a target for Excel formulas.',
          difficulty: 'Medium',
          category: 'algorithms',
          company: 'Microsoft',
          role: role,
          codeTemplate: {
            javascript: `function twoSum(cellValues, target) {
  // Microsoft Excel formula optimization
  const valueMap = new Map();
  for (let i = 0; i < cellValues.length; i++) {
    const complement = target - cellValues[i];
    if (valueMap.has(complement)) {
      return [valueMap.get(complement), i];
    }
    valueMap.set(cellValues[i], i);
  }
  return [];
}`,
            python: `def two_sum(cell_values, target):
    # Microsoft Excel formula optimization
    value_map = {}
    for i, value in enumerate(cell_values):
        complement = target - value
        if complement in value_map:
            return [value_map[complement], i]
        value_map[value] = i
    return []`,
            java: `public int[] twoSum(int[] cellValues, int target) {
    // Microsoft Excel formula optimization
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < cellValues.length; i++) {
        int complement = target - cellValues[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(cellValues[i], i);
    }
    return new int[]{};
}`
          },
          testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
            { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
          ]
        },
        {
          id: 'microsoft-2',
          title: 'Reverse Linked List - Office Documents',
          description: 'Microsoft Office needs to reverse document revision history for version control.',
          difficulty: 'Easy',
          category: 'linked-list',
          company: 'Microsoft',
          role: role,
          codeTemplate: {
            javascript: `function reverseList(head) {
  // Microsoft Office document revision reversal
  let prev = null;
  let current = head;
  
  while (current !== null) {
    const nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }
  
  return prev;
}`,
            python: `def reverse_list(head):
    # Microsoft Office document revision reversal
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev`,
            java: `public ListNode reverseList(ListNode head) {
    // Microsoft Office document revision reversal
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        ListNode nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}`
          },
          testCases: [
            { input: { head: [1,2,3,4,5] }, expected: [5,4,3,2,1] }
          ]
        },
        {
          id: 'microsoft-3',
          title: 'Maximum Subarray - Sales Analytics',
          description: 'Microsoft sales team needs to find maximum profit subarray for quarterly reports.',
          difficulty: 'Easy',
          category: 'array',
          company: 'Microsoft',
          role: role,
          codeTemplate: {
            javascript: `function maxSubArray(nums) {
  // Microsoft sales analytics - Kadane's algorithm
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  
  return maxSoFar;
}`,
            python: `def max_sub_array(nums):
    # Microsoft sales analytics - Kadane's algorithm
    max_so_far = nums[0]
    max_ending_here = nums[0]
    
    for i in range(1, len(nums)):
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far`,
            java: `public int maxSubArray(int[] nums) {
    // Microsoft sales analytics - Kadane's algorithm
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}`
          },
          testCases: [
            { input: { nums: [-2,1,-3,4,-1,2,1,-5,4] }, expected: 6 }
          ]
        }
      ],
      'infosys': [
        {
          id: 'infosys-1',
          title: 'Two Sum - Client Data Processing',
          description: 'Infosys client project requires finding two data points that sum to target value for reporting.',
          difficulty: 'Easy',
          category: 'algorithms',
          company: 'Infosys',
          role: role,
          codeTemplate: {
            javascript: `function twoSum(clientData, target) {
  // Infosys client data processing solution
  const dataMap = new Map();
  for (let i = 0; i < clientData.length; i++) {
    const complement = target - clientData[i];
    if (dataMap.has(complement)) {
      return [dataMap.get(complement), i];
    }
    dataMap.set(clientData[i], i);
  }
  return [];
}`,
            python: `def two_sum(client_data, target):
    # Infosys client data processing
    data_map = {}
    for i, data in enumerate(client_data):
        complement = target - data
        if complement in data_map:
            return [data_map[complement], i]
        data_map[data] = i
    return []`,
            java: `public int[] twoSum(int[] clientData, int target) {
    // Infosys client data processing
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < clientData.length; i++) {
        int complement = target - clientData[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(clientData[i], i);
    }
    return new int[]{};
}`
          },
          testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
            { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
          ]
        },
        {
          id: 'infosys-2',
          title: 'Binary Search - Database Query',
          description: 'Infosys database optimization requires efficient binary search for client data queries.',
          difficulty: 'Easy',
          category: 'search',
          company: 'Infosys',
          role: role,
          codeTemplate: {
            javascript: `function search(nums, target) {
  // Infosys database query optimization
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
            python: `def search(nums, target):
    # Infosys database query optimization
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
            java: `public int search(int[] nums, int target) {
    // Infosys database query optimization
    int left = 0;
    int right = nums.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`
          },
          testCases: [
            { input: { nums: [-1,0,3,5,9,12], target: 9 }, expected: 4 }
          ]
        },
        {
          id: 'infosys-3',
          title: 'Palindrome Check - Data Validation',
          description: 'Infosys data validation system needs to check if client input strings are palindromes.',
          difficulty: 'Easy',
          category: 'string',
          company: 'Infosys',
          role: role,
          codeTemplate: {
            javascript: `function isPalindrome(s) {
  // Infosys data validation system
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}`,
            python: `def is_palindrome(s):
    # Infosys data validation system
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    left, right = 0, len(cleaned) - 1
    
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    
    return True`,
            java: `public boolean isPalindrome(String s) {
    // Infosys data validation system
    String cleaned = s.toLowerCase().replaceAll("[^a-z0-9]", "");
    int left = 0;
    int right = cleaned.length() - 1;
    
    while (left < right) {
        if (cleaned.charAt(left) != cleaned.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}`
          },
          testCases: [
            { input: { s: "A man, a plan, a canal: Panama" }, expected: true }
          ]
        }
      ],
      'tcs': [
        {
          id: 'tcs-1',
          title: 'Array Rotation - Banking System',
          description: 'TCS banking system needs to rotate transaction arrays for daily processing cycles.',
          difficulty: 'Medium',
          category: 'array',
          company: 'TCS',
          role: role,
          codeTemplate: {
            javascript: `function rotate(nums, k) {
  // TCS banking transaction rotation
  k = k % nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

function reverse(nums, start, end) {
  while (start < end) {
    [nums[start], nums[end]] = [nums[end], nums[start]];
    start++;
    end--;
  }
}`,
            python: `def rotate(nums, k):
    # TCS banking transaction rotation
    k = k % len(nums)
    reverse(nums, 0, len(nums) - 1)
    reverse(nums, 0, k - 1)
    reverse(nums, k, len(nums) - 1)

def reverse(nums, start, end):
    while start < end:
        nums[start], nums[end] = nums[end], nums[start]
        start += 1
        end -= 1`,
            java: `public void rotate(int[] nums, int k) {
    // TCS banking transaction rotation
    k = k % nums.length;
    reverse(nums, 0, nums.length - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.length - 1);
}

private void reverse(int[] nums, int start, int end) {
    while (start < end) {
        int temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start++;
        end--;
    }
}`
          },
          testCases: [
            { input: { nums: [1,2,3,4,5,6,7], k: 3 }, expected: [5,6,7,1,2,3,4] }
          ]
        }
      ],
      'wipro': [
        {
          id: 'wipro-1',
          title: 'Stack Implementation - System Monitoring',
          description: 'Wipro system monitoring needs a stack data structure for tracking system events.',
          difficulty: 'Easy',
          category: 'stack',
          company: 'Wipro',
          role: role,
          codeTemplate: {
            javascript: `class MinStack {
  constructor() {
    // Wipro system monitoring stack
    this.stack = [];
    this.minStack = [];
  }
  
  push(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
      this.minStack.push(val);
    }
  }
  
  pop() {
    const popped = this.stack.pop();
    if (popped === this.minStack[this.minStack.length - 1]) {
      this.minStack.pop();
    }
    return popped;
  }
  
  top() {
    return this.stack[this.stack.length - 1];
  }
  
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}`,
            python: `class MinStack:
    def __init__(self):
        # Wipro system monitoring stack
        self.stack = []
        self.min_stack = []
    
    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self):
        popped = self.stack.pop()
        if popped == self.min_stack[-1]:
            self.min_stack.pop()
        return popped
    
    def top(self):
        return self.stack[-1]
    
    def get_min(self):
        return self.min_stack[-1]`,
            java: `class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;
    
    public MinStack() {
        // Wipro system monitoring stack
        stack = new Stack<>();
        minStack = new Stack<>();
    }
    
    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }
    
    public void pop() {
        int popped = stack.pop();
        if (popped == minStack.peek()) {
            minStack.pop();
        }
    }
    
    public int top() {
        return stack.peek();
    }
    
    public int getMin() {
        return minStack.peek();
    }
}`
          },
          testCases: [
            { input: { operations: ["MinStack","push","push","push","getMin","pop","top","getMin"] }, expected: [null,null,null,null,-3,null,0,-2] }
          ]
        }
      ]
    };
    
    // Return company-specific problems or enhanced base problems
    if (companyProblems[company]) {
      console.log(`🎯 Using ${company}-specific problems`);
      return companyProblems[company];
    } else {
      // Enhance base problems with company context
      console.log(`🔧 Enhancing base problems for ${company}`);
      return baseProblems.map((problem, index) => ({
        ...problem,
        id: `${company}-${problem.id || index}`,
        title: `${problem.title} - ${company.charAt(0).toUpperCase() + company.slice(1)} Edition`,
        description: `${problem.description} (Adapted for ${company.charAt(0).toUpperCase() + company.slice(1)} interview)`,
        company: company.charAt(0).toUpperCase() + company.slice(1),
        role: role
      }));
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
      console.log('🔄 Fetching MCQs from backend API...');
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.company) params.append('company', filters.company);
        if (filters.category && filters.category !== 'all') params.append('category', filters.category);
        if (filters.difficulty && filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
        // Request more than needed to account for filtering
        params.append('limit', Math.max(filters.limit || 10, 20).toString());
      }
      
      // Make API request
      const response = await apiRequest(`/mcqs?${params.toString()}`, {
        method: 'GET'
      });
      
      if (response && Array.isArray(response)) {
        console.log('✅ MCQs API response:', response.length, 'questions');
        
        // Transform API response to match MCQ interface
        const mcqs = response.map((mcq: any): any => ({
          id: mcq.id || `mcq-${Math.random().toString(36).substr(2, 9)}`,
          question: mcq.question,
          options: Array.isArray(mcq.options) ? mcq.options : [],
          correct: typeof mcq.correct === 'number' ? mcq.correct : (mcq.correctIndex || 0),
          category: mcq.category || 'General',
          difficulty: mcq.difficulty || 'Medium',
          company: mcq.company || filters?.company || 'General',
          role: mcq.role || 'Software Engineer',
          explanation: mcq.explanation || 'No explanation available',
          userAnswer: null
        }));
        
        return mcqs;
      } else {
        console.warn('⚠️ No MCQs returned from API');
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to fetch MCQs from API:', error);
      return [];
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;