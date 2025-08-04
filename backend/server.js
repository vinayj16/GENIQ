import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({
  path: path.join(__dirname, '../.env')
});

// In production, we expect Render to set the environment variables directly
if (process.env.NODE_ENV === 'production') {
  console.log(' Running in production mode with environment variables from host');
}

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy for production
if (isProduction) {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Total-Count']
};

app.use(cors(corsOptions));
console.log(`🌐 CORS enabled for origin: ${corsOptions.origin}`);
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware to check for API key
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  if (apiKey && apiKey === process.env.VITE_API_KEY) {
    next();
  } else {
    console.log(`Unauthorized access attempt from ${req.ip}`);
    res.status(401).json({ error: 'Unauthorized: Missing or invalid API key' });
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  const statusCode = err.statusCode || 500;
  const response = {
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
    status: 'error',
    statusCode
  };

  // Include stack trace in development
  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    company: 'Cisco',
    role: 'Software Developer Intern',
    experience: 'Positive',
    difficulty: 'Hard',
    rating: 4,
    date: '2024-06-15',
    interview_process: '3 Rounds: OA, Technical, HR',
    questions_asked: ['Reverse Linked List', 'SQL Joins', 'OOPs concepts', 'Data Structures'],
    preparation_tips: 'Focus on DSA and core CS concepts. Practice Leetcode medium problems.',
    author: 'Sample Data'
  },
  {
    id: 2,
    company: 'Cisco',
    role: 'Full Stack Developer',
    experience: 'Positive',
    difficulty: 'Medium',
    rating: 5,
    date: '2024-05-20',
    interview_process: '3 Rounds: Technical Screen, Panel, HR',
    questions_asked: ['React concepts', 'Node.js architecture', 'REST API design', 'System design basics'],
    preparation_tips: 'Prepare your portfolio projects. Be ready for in-depth technical discussions.',
    author: 'Sample Data'
  },
  {
    id: 3,
    company: 'Infosys',
    role: 'Senior Software Engineer',
    experience: 'Neutral',
    difficulty: 'Medium',
    rating: 3,
    date: '2024-04-10',
    interview_process: '2 Rounds: Technical, Managerial',
    questions_asked: ['System design for a URL shortener', 'Database design', 'REST API best practices'],
    preparation_tips: 'Focus on system design and database concepts. Know your resume well.',
    author: 'Sample Data'
  },
  {
    id: 4,
    company: 'Microsoft',
    role: 'Software Engineer',
    experience: 'Positive',
    difficulty: 'Hard',
    rating: 5,
    date: '2024-06-20',
    interview_process: '4 Rounds: OA, Technical Phone Screen, Onsite (2x Technical, 1x Behavioral)',
    questions_asked: ['Design a URL shortener', 'Implement LRU Cache', 'Find the median of two sorted arrays', 'System design for a chat application'],
    preparation_tips: 'Focus on system design and algorithms. Be prepared for in-depth technical discussions. Practice coding on a whiteboard.',
    author: 'Sample Data'
  },
  {
    id: 5,
    company: 'Microsoft',
    role: 'Senior Software Engineer',
    experience: 'Positive',
    difficulty: 'Very Hard',
    rating: 4,
    date: '2024-05-15',
    interview_process: '5 Rounds: Recruiter Call, Technical Phone Screen, Onsite (3x Technical, 1x Behavioral)',
    questions_asked: ['Design a distributed key-value store', 'Implement a thread-safe cache', 'Lowest Common Ancestor in a Binary Tree', 'Design Netflix'],
    preparation_tips: 'Strong system design skills are crucial. Be ready for in-depth discussions about distributed systems and concurrency. Practice system design interviews.',
    author: 'Sample Data'
  },
  {
    id: 6,
    company: 'Microsoft',
    role: 'Software Engineer II',
    experience: 'Neutral',
    difficulty: 'Hard',
    rating: 4,
    date: '2024-04-05',
    interview_process: '4 Rounds: OA, Technical Phone Screen, Onsite (2x Technical, 1x Behavioral)',
    questions_asked: ['Design a parking lot', 'Serialize and Deserialize a Binary Tree', 'Merge k Sorted Lists', 'Design a rate limiter'],
    preparation_tips: 'Practice both coding and system design. Be prepared for behavioral questions using the STAR method. Know your resume inside out.',
    author: 'Sample Data'
  }
];

// Sample data
const sampleProblems = [
  {
    id: 1,
    title: 'Two Sum',
    description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
    difficulty: 'Easy',
    category: 'algorithms',
    testCases: [
      { input: { nums: [2,7,11,15], target: 9 }, output: [0,1] },
      { input: { nums: [3,2,4], target: 6 }, output: [1,2] },
      { input: { nums: [3,3], target: 6 }, output: [0,1] }
    ],
    solution: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}'
  },
  {
    id: 2,
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    difficulty: 'Easy',
    category: 'algorithms',
    testCases: [
      { input: { s: ["h","e","l","l","o"] }, output: ["o","l","l","e","h"] },
      { input: { s: ["H","a","n","n","a","h"] }, output: ["h","a","n","n","a","H"] }
    ],
    solution: 'function reverseString(s) {\n  let left = 0;\n  let right = s.length - 1;\n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++;\n    right--;\n  }\n  return s;\n}'
  },
  {
    id: 3,
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    difficulty: 'Medium',
    category: 'data structures',
    testCases: [
      { input: { s: "()" }, output: true },
      { input: { s: "()[]{}" }, output: true },
      { input: { s: "(]" }, output: false },
      { input: { s: "([)]" }, output: false },
      { input: { s: "{[]}" }, output: true }
    ],
    solution: 'function isValid(s) {\n  const stack = [];\n  const map = { ")": "(", "}": "{", "]": "[" };\n  for (const char of s) {\n    if (!(char in map)) {\n      stack.push(char);\n    } else if (stack.pop() !== map[char]) {\n      return false;\n    }\n  }\n  return stack.length === 0;\n}'
  }
];

const sampleMCQs = [
  {
    id: 1,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correct: 1,
    category: 'algorithms',
    difficulty: 'Easy',
    company: 'Google',
    role: 'Software Engineer',
    explanation: 'Binary search works by repeatedly dividing the search interval in half.'
  },
  {
    id: 2,
    question: 'Which data structure uses LIFO (Last In First Out) principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correct: 1,
    category: 'data structures',
    difficulty: 'Easy',
    company: 'Microsoft',
    role: 'Frontend Developer',
    explanation: 'Stack follows LIFO principle where the last element added is the first one to be removed.'
  },
  {
    id: 3,
    question: "What is the space complexity of merge sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 2,
    category: "algorithms",
    difficulty: "Medium",
    company: "Microsoft",
    explanation: "Merge sort requires O(n) extra space for the temporary arrays used during merging."
  },
  {
    id: 4,
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correct: 0,
    category: 'algorithms',
    difficulty: 'Easy',
    company: 'Amazon',
    role: 'Backend Developer',
    explanation: 'Array elements are stored in contiguous memory locations, allowing O(1) access time.'
  },
  {
    id: 5,
    question: 'Which sorting algorithm has the worst-case time complexity of O(n²)?',
    options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Heap Sort'],
    correct: 2,
    category: 'algorithms',
    difficulty: 'Medium',
    company: 'Facebook',
    role: 'Full Stack Developer',
    explanation: 'Bubble Sort has O(n²) time complexity in both average and worst case.'
  },
  {
    id: 6,
    question: 'What is the main advantage of using a hash table?',
    options: ['Maintains order of elements', 'O(1) average time complexity for search/insert/delete', 'Efficient for range queries', 'No collision handling needed'],
    correct: 1,
    category: 'data structures',
    difficulty: 'Medium',
    company: 'Google',
    role: 'Software Engineer',
    explanation: 'Hash tables provide average O(1) time complexity for basic operations.'
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Reviews endpoint with filtering and AI generation
// Cache for storing generated reviews to avoid excessive API calls
const reviewCache = new Map();

// Helper function to generate cache key
const getCacheKey = (company, role) => `${company.toLowerCase()}:${role.toLowerCase()}`;

// Helper function to sanitize review data
const sanitizeReviewData = (review) => {
  return {
    id: review.id || Date.now(),
    company: String(review.company || ''),
    role: String(review.role || ''),
    experience: String(review.experience || 'Neutral'),
    difficulty: String(review.difficulty || 'Medium'),
    rating: Math.min(5, Math.max(1, parseInt(review.rating) || 3)),
    date: String(review.date || new Date().toISOString().split('T')[0]),
    interview_process: String(review.interview_process || ''),
    questions_asked: Array.isArray(review.questions_asked) 
      ? review.questions_asked.map(q => String(q)).filter(q => q.trim())
      : [],
    preparation_tips: String(review.preparation_tips || ''),
    author: String(review.author || 'Unknown')
  };
};

// GET reviews endpoint - fetch existing reviews or generate new ones
app.get('/api/reviews', apiKeyAuth, async (req, res) => {
  try {
    const { company, role } = req.query;
    
    // If no filters provided, return sample reviews (sanitized)
    if (!company && !role) {
      return res.json(sampleReviews.map(sanitizeReviewData));
    }

    // Filter existing sample reviews first
    const filteredReviews = sampleReviews.filter(review => {
      const companyMatch = !company || 
        (review.company && review.company.toLowerCase().includes(company.toLowerCase()));
      const roleMatch = !role || 
        (review.role && review.role.toLowerCase().includes(role.toLowerCase()));
      return companyMatch && roleMatch;
    });

    // If we have matching sample reviews, return them (sanitized)
    if (filteredReviews.length > 0) {
      return res.json(filteredReviews.map(sanitizeReviewData));
    }

    // If no matches and both company and role are provided, generate AI review
    if (company && role) {
      const cacheKey = getCacheKey(company, role);
      
      // Check cache first
      if (reviewCache.has(cacheKey)) {
        const { data, timestamp } = reviewCache.get(cacheKey);
        // Cache expires after 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return res.json(data);
        }
        // Remove expired cache
        reviewCache.delete(cacheKey);
      }

      // Generate AI review
      const aiReview = await generateAIReview(company, role);
      const sanitizedAiReview = sanitizeReviewData(aiReview);
      
      // Cache the result
      reviewCache.set(cacheKey, {
        data: [sanitizedAiReview],
        timestamp: Date.now()
      });
      
      return res.json([sanitizedAiReview]);
    }

    // Return empty array if no matches and insufficient data for AI generation
    res.json([]);
  } catch (error) {
    console.error('Error in reviews endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST reviews endpoint - submit new review and get AI-enhanced response
app.post('/api/reviews', apiKeyAuth, async (req, res) => {
  try {
    const { company, role, experience, difficulty, rating, interview_process, questions_asked, preparation_tips } = req.body;
    
    if (!company || !role) {
      return res.status(400).json({ error: 'Company and role are required' });
    }

    // Create the submitted review
    const submittedReview = sanitizeReviewData({
      id: Date.now(),
      company,
      role,
      experience: experience || 'Neutral',
      difficulty: difficulty || 'Medium',
      rating: Math.min(5, Math.max(1, parseInt(rating) || 3)),
      date: new Date().toISOString().split('T')[0],
      interview_process: interview_process || '',
      questions_asked: Array.isArray(questions_asked) ? questions_asked.filter(q => q.trim()) : [],
      preparation_tips: preparation_tips || '',
      author: 'User Submitted'
    });

    // Generate AI-enhanced insights based on the submitted review
    let aiInsights = null;
    try {
      const model = initializeAI();
      const prompt = `Based on this interview review submission, provide additional insights and suggestions:
      
      Company: ${company}
      Role: ${role}
      Experience: ${experience}
      Difficulty: ${difficulty}
      Interview Process: ${interview_process}
      Questions Asked: ${questions_asked?.join(', ') || 'None specified'}
      Preparation Tips: ${preparation_tips}
      
      Please provide:
      1. Additional preparation suggestions
      2. Common follow-up questions for this role
      3. Industry-specific insights for ${company}
      4. Salary expectations and negotiation tips
      
      Format as JSON:
      {
        "additional_prep_tips": "string",
        "common_followup_questions": ["question1", "question2", "question3"],
        "industry_insights": "string",
        "salary_insights": "string"
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiInsights = JSON.parse(jsonMatch[0]);
      }
    } catch (aiError) {
      console.error('AI insights generation failed:', aiError);
      // Continue without AI insights
    }

    // Add to sample reviews for future queries
    sampleReviews.unshift(submittedReview);

    // Return the submitted review with AI insights
    const response = {
      review: submittedReview,
      aiInsights: aiInsights,
      message: 'Review submitted successfully!'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Helper function to generate AI review
async function generateAIReview(company, role) {
  try {
    const model = initializeAI();
    
    const prompt = `Generate a realistic and detailed interview review for a ${role} position at ${company}. Include:
    - Interview experience (Positive/Mixed/Negative)
    - Interview difficulty (Easy/Medium/Hard)
    - Rating (1-5)
    - Recent date
    - Detailed interview process (multiple rounds)
    - At least 4 specific technical questions
    - Comprehensive preparation tips
    
    Format as JSON:
    {
      "company": "${company}",
      "role": "${role}",
      "experience": "",
      "difficulty": "",
      "rating": 0,
      "date": "",
      "interview_process": "",
      "questions_asked": [],
      "preparation_tips": ""
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const review = JSON.parse(jsonMatch[0]);
    
    // Process and validate the review
    return sanitizeReviewData({
      id: Date.now(),
      company: review.company || company,
      role: review.role || role,
      experience: review.experience || 'Neutral',
      difficulty: review.difficulty || 'Medium',
      rating: Math.min(5, Math.max(1, parseInt(review.rating) || 3)),
      date: review.date || new Date().toISOString().split('T')[0],
      interview_process: review.interview_process || 'Not specified',
      questions_asked: Array.isArray(review.questions_asked) ? 
        review.questions_asked.map(q => String(q)) : 
        ['No questions provided'],
      preparation_tips: review.preparation_tips || 'No preparation tips provided',
      author: 'AI Generated'
    });
  } catch (error) {
    console.error('AI review generation failed:', error);
    
    // Return a fallback review
    return sanitizeReviewData({
      id: Date.now(),
      company,
      role,
      experience: 'Neutral',
      difficulty: 'Medium',
      rating: 3,
      date: new Date().toISOString().split('T')[0],
      interview_process: 'Standard technical interview process',
      questions_asked: ['Technical questions related to the role'],
      preparation_tips: 'Practice relevant technical skills and review company information',
      author: 'System Generated'
    });
  }
}

// Dashboard endpoints
app.get('/api/dashboard/stats', apiKeyAuth, (req, res) => {
  res.json({
    problemsSolved: 42,
    dayStreak: 7,
    successRate: 85,
    companiesCount: 12
  });
});

app.get('/api/dashboard/activity', apiKeyAuth, (req, res) => {
  const activities = [
    {
      id: 1,
      type: 'problem',
      title: 'Two Sum',
      status: 'solved',
      time: '2024-07-29T10:30:00Z'
    },
    {
      id: 2,
      type: 'mcq',
      title: 'JavaScript Fundamentals',
      status: 'completed',
      time: '2024-07-28T15:45:00Z'
    },
    {
      id: 3,
      type: 'mock',
      title: 'System Design Mock Interview',
      status: 'completed',
      time: '2024-07-27T11:20:00Z'
    }
  ];
  res.json(activities);
});

app.get('/api/problems', apiKeyAuth, (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let filteredProblems = [...sampleProblems];
    
    if (category) {
      filteredProblems = filteredProblems.filter(problem => 
        problem.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (difficulty) {
      filteredProblems = filteredProblems.filter(problem => 
        problem.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(filteredProblems);
  } catch (error) {
    console.error('Error processing problems request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single problem by ID
app.get('/api/problems/:id', apiKeyAuth, (req, res) => {
  try {
    const problem = sampleProblems.find(p => p.id === parseInt(req.params.id));
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CORS is already configured above, remove duplicate configuration

app.get('/api/mcqs', apiKeyAuth, (req, res) => {
  const { category, difficulty, company, role } = req.query;
  let filteredMCQs = [...sampleMCQs];
  
  try {
    if (category) filteredMCQs = filteredMCQs.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
    if (difficulty) filteredMCQs = filteredMCQs.filter(q => q.difficulty && q.difficulty.toLowerCase() === difficulty.toLowerCase());
    if (company) filteredMCQs = filteredMCQs.filter(q => q.company && q.company.toLowerCase().includes(company.toLowerCase()));
    // If role is provided, filter by role (case-insensitive)
    if (role) filteredMCQs = filteredMCQs.filter(q => 
      q.role && q.role.toLowerCase().includes(role.toLowerCase())
    );
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(filteredMCQs);
  } catch (error) {
    console.error('Error processing MCQs request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



const initializeAI = () => {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY is not configured on the server.');
  }
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

app.post('/api/ai/analyze-code', async (req, res) => {
  try {
    const model = initializeAI();
    const { code, language } = req.body;
    const prompt = `Analyze this ${language} code and provide feedback on correctness, efficiency, and best practices: ${code}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ analysis: response.text() });
  } catch (error) {
    console.error('AI analysis error:', error.message);
    res.status(500).json({ error: 'AI analysis failed: ' + error.message });
  }
});

app.post('/api/ai/hint', async (req, res) => {
  try {
    const model = initializeAI();
    const { currentCode } = req.body;
    const prompt = `Provide a helpful hint for solving this coding problem. Current code: ${currentCode || 'No code yet'}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ hint: response.text() });
  } catch (error) {
    console.error('AI hint error:', error.message);
    res.status(500).json({ error: 'AI hint generation failed: ' + error.message });
  }
});

app.post('/api/ai/generate-mcqs', async (req, res) => {
  try {
    const model = initializeAI();
    const { company, role, difficulty } = req.body;
    const prompt = `Generate 5 technical interview MCQs for ${role} position at ${company} with ${difficulty} difficulty. Format as JSON array with question, options, correct answer index, and explanation.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ mcqs: response.text() });
  } catch (error) {
    console.error('AI MCQ generation error:', error.message);
    res.status(500).json({ error: 'AI MCQ generation failed: ' + error.message });
  }
});

// Additional endpoints for enhanced functionality

// User progress tracking
app.get('/api/user/progress', apiKeyAuth, (req, res) => {
  try {
    const progress = {
      totalProblems: 150,
      solvedProblems: 42,
      totalMCQs: 200,
      completedMCQs: 85,
      studyStreak: 7,
      totalStudyTime: 1250, // in minutes
      achievements: [
        { id: 'first-problem', name: 'First Steps', unlocked: true },
        { id: 'week-streak', name: 'Week Warrior', unlocked: true },
        { id: 'problem-solver', name: 'Problem Solver', unlocked: false }
      ],
      weeklyActivity: [
        { day: 'Mon', problems: 3, mcqs: 5 },
        { day: 'Tue', problems: 2, mcqs: 8 },
        { day: 'Wed', problems: 4, mcqs: 3 },
        { day: 'Thu', problems: 1, mcqs: 6 },
        { day: 'Fri', problems: 5, mcqs: 4 },
        { day: 'Sat', problems: 2, mcqs: 7 },
        { day: 'Sun', problems: 3, mcqs: 2 }
      ]
    };
    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
});

// Analytics endpoint
app.get('/api/analytics', apiKeyAuth, (req, res) => {
  try {
    const analytics = {
      performanceMetrics: {
        averageScore: 78.5,
        improvementRate: 12.3,
        timeSpent: 1250,
        problemsSolved: 42
      },
      categoryBreakdown: [
        { category: 'Algorithms', solved: 15, total: 25, percentage: 60 },
        { category: 'Data Structures', solved: 12, total: 20, percentage: 60 },
        { category: 'System Design', solved: 8, total: 15, percentage: 53 },
        { category: 'Databases', solved: 7, total: 12, percentage: 58 }
      ],
      difficultyBreakdown: [
        { difficulty: 'Easy', solved: 20, total: 30, percentage: 67 },
        { difficulty: 'Medium', solved: 15, total: 25, percentage: 60 },
        { difficulty: 'Hard', solved: 7, total: 15, percentage: 47 }
      ],
      monthlyProgress: [
        { month: 'Jan', problems: 8, mcqs: 15 },
        { month: 'Feb', problems: 12, mcqs: 20 },
        { month: 'Mar', problems: 15, mcqs: 25 },
        { month: 'Apr', problems: 18, mcqs: 30 },
        { month: 'May', problems: 22, mcqs: 35 },
        { month: 'Jun', problems: 25, mcqs: 40 }
      ]
    };
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Leaderboard endpoint
app.get('/api/leaderboard', apiKeyAuth, (req, res) => {
  try {
    const leaderboard = {
      global: [
        { rank: 1, name: 'Alex Chen', score: 2450, problems: 180, streak: 25 },
        { rank: 2, name: 'Sarah Johnson', score: 2380, problems: 175, streak: 22 },
        { rank: 3, name: 'Mike Rodriguez', score: 2320, problems: 165, streak: 18 },
        { rank: 4, name: 'Emily Davis', score: 2280, problems: 160, streak: 20 },
        { rank: 5, name: 'David Kim', score: 2250, problems: 155, streak: 15 }
      ],
      friends: [
        { rank: 1, name: 'You', score: 1850, problems: 42, streak: 7 },
        { rank: 2, name: 'John Doe', score: 1720, problems: 38, streak: 5 },
        { rank: 3, name: 'Jane Smith', score: 1650, problems: 35, streak: 8 }
      ],
      weekly: [
        { rank: 1, name: 'CodeMaster', score: 450, problems: 15 },
        { rank: 2, name: 'AlgoExpert', score: 420, problems: 14 },
        { rank: 3, name: 'DevNinja', score: 380, problems: 12 }
      ]
    };
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Mock interview endpoint
app.post('/api/mock-interview', apiKeyAuth, async (req, res) => {
  try {
    const { company, role, experience, duration } = req.body;
    
    if (!company || !role) {
      return res.status(400).json({ error: 'Company and role are required' });
    }

    const model = initializeAI();
    const prompt = `Generate a mock interview for a ${role} position at ${company} for someone with ${experience} experience. 
    Duration: ${duration} minutes.
    
    Include:
    1. 5-7 technical questions with expected answers
    2. 2-3 behavioral questions
    3. Company-specific questions
    4. Difficulty progression from easy to hard
    
    Format as JSON:
    {
      "questions": [
        {
          "type": "technical|behavioral|company",
          "question": "string",
          "expectedAnswer": "string",
          "difficulty": "easy|medium|hard",
          "timeLimit": "number in minutes"
        }
      ],
      "totalDuration": "number",
      "tips": ["tip1", "tip2", "tip3"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const interviewData = JSON.parse(jsonMatch[0]);
      res.json(interviewData);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error generating mock interview:', error);
    res.status(500).json({ error: 'Failed to generate mock interview' });
  }
});

// Resume analysis endpoint
app.post('/api/resume/analyze', apiKeyAuth, async (req, res) => {
  try {
    const { resumeText, targetRole, targetCompany } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const model = initializeAI();
    const prompt = `Analyze this resume for a ${targetRole} position at ${targetCompany}:

    ${resumeText}

    Provide:
    1. Overall score (1-10)
    2. Strengths
    3. Areas for improvement
    4. Missing keywords
    5. Suggestions for better formatting
    6. ATS compatibility score

    Format as JSON:
    {
      "overallScore": number,
      "atsScore": number,
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "missingKeywords": ["keyword1", "keyword2"],
      "suggestions": ["suggestion1", "suggestion2"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      res.json(analysis);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// Study plan generation
app.post('/api/study-plan', apiKeyAuth, async (req, res) => {
  try {
    const { targetRole, currentLevel, timeAvailable, weakAreas } = req.body;
    
    const model = initializeAI();
    const prompt = `Create a personalized study plan for someone preparing for a ${targetRole} position.
    
    Current level: ${currentLevel}
    Time available: ${timeAvailable} hours per week
    Weak areas: ${weakAreas?.join(', ') || 'Not specified'}
    
    Create a 4-week study plan with:
    1. Daily tasks
    2. Weekly goals
    3. Resource recommendations
    4. Practice problems
    5. Mock interview schedule
    
    Format as JSON with weeks array containing daily tasks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const studyPlan = JSON.parse(jsonMatch[0]);
      res.json(studyPlan);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error generating study plan:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

// Company insights endpoint
app.get('/api/company/:name/insights', apiKeyAuth, async (req, res) => {
  try {
    const { name } = req.params;
    
    const model = initializeAI();
    const prompt = `Provide comprehensive interview insights for ${name} company:
    
    Include:
    1. Interview process overview
    2. Common question types
    3. Company culture and values
    4. Technical stack preferences
    5. Salary ranges for different roles
    6. Interview tips specific to this company
    
    Format as JSON with structured data.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const insights = JSON.parse(jsonMatch[0]);
      res.json(insights);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error fetching company insights:', error);
    res.status(500).json({ error: 'Failed to fetch company insights' });
  }
});

// Apply error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Function to start the server
const startServer = () => {
  const httpServer = app.listen(PORT, '0.0.0.0', () => {
    const key = process.env.VITE_API_KEY;
    const aiKey = process.env.GOOGLE_AI_API_KEY;
    
    console.log(`🚀 Server is running on port ${PORT}`);
    
    // Log API key status (only last 4 chars for security)
    if (key) {
      console.log(`🔑 API Key loaded: ****${key.slice(-4)}`);
    } else {
      console.log('⚠️  API Key is NOT loaded!');
    }
    
    if (aiKey) {
      console.log(`🤖 Google AI API Key loaded: ****${aiKey.slice(-4)}`);
    } else {
      console.log('⚠️  Google AI API Key is NOT loaded!');
    }
    
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  return httpServer;
};

// Only start the server if this file is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

// Export both app and startServer function
// The app can be used for testing with supertest
// The startServer function can be used to start the server with custom options
export { app, startServer };