// Company-specific interview preparation data
export interface Company {
  id: string;
  name: string;
  logo: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  focus: string[];
  description: string;
  problems: number;
  successRate: number;
  avgSalary: string;
  color: string;
  tier: string;
  interviewProcess: {
    rounds: number;
    duration: string;
    stages: string[];
  };
  keyTopics: string[];
  tips: string[];
  features?: {
    aiPowered?: boolean;
    voiceCoding?: boolean;
    whiteboard?: boolean;
    peerReview?: boolean;
    companySpecific?: boolean;
    analytics?: boolean;
  };
}

export const companies: Company[] = [
  {
    id: 'google',
    name: 'Google',
    logo: '/companies/google.png',
    difficulty: 'Hard',
    focus: ['Algorithms', 'System Design', 'Data Structures'],
    description: 'Focus on algorithmic thinking and system design. Expect 4-5 rounds including coding, system design, and behavioral.',
    problems: 342,
    successRate: 89,
    avgSalary: '$180k',
    color: 'bg-blue-500',
    tier: 'FAANG',
    interviewProcess: {
      rounds: 5,
      duration: '4-6 weeks',
      stages: ['Phone Screen', 'Technical Phone', 'Onsite Coding', 'System Design', 'Behavioral']
    },
    keyTopics: ['Dynamic Programming', 'Graph Algorithms', 'System Design', 'Distributed Systems'],
    tips: [
      'Practice whiteboard coding extensively',
      'Focus on optimal solutions with clear explanations',
      'Prepare for system design at scale',
      'Know Google\'s products and engineering culture'
    ],
    features: {
      aiPowered: true,
      voiceCoding: true,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '/companies/amazon.png',
    difficulty: 'Medium',
    focus: ['Leadership', 'Behavioral', 'Coding'],
    description: 'Strong emphasis on leadership principles and behavioral questions. Technical rounds focus on practical problem-solving.',
    problems: 298,
    successRate: 76,
    avgSalary: '$165k',
    color: 'bg-orange-500',
    tier: 'FAANG',
    interviewProcess: {
      rounds: 4,
      duration: '3-5 weeks',
      stages: ['Phone Screen', 'Technical Assessment', 'Onsite Technical', 'Bar Raiser']
    },
    keyTopics: ['Leadership Principles', 'Trees and Graphs', 'Object-Oriented Design', 'Scalability'],
    tips: [
      'Master all 16 Leadership Principles with STAR examples',
      'Practice customer obsession scenarios',
      'Focus on practical coding solutions',
      'Prepare for ownership and bias for action questions'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '/companies/microsoft.png',
    difficulty: 'Medium',
    focus: ['Problem Solving', 'Design', 'Collaboration'],
    description: 'Collaborative problem-solving approach. Expect questions about design decisions and technical trade-offs.',
    problems: 234,
    successRate: 82,
    avgSalary: '$170k',
    color: 'bg-yellow-500',
    tier: 'Big Tech',
    interviewProcess: {
      rounds: 4,
      duration: '2-4 weeks',
      stages: ['Recruiter Screen', 'Technical Phone', 'Onsite Loop', 'As Appropriate (AA)']
    },
    keyTopics: ['Data Structures', 'Algorithms', 'System Design', 'Collaboration'],
    tips: [
      'Emphasize collaborative problem-solving',
      'Show growth mindset and learning agility',
      'Practice explaining technical concepts clearly',
      'Demonstrate passion for Microsoft products'
    ],
    features: {
      aiPowered: true,
      voiceCoding: true,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'apple',
    name: 'Apple',
    logo: '/companies/apple.png',
    difficulty: 'Hard',
    focus: ['Innovation', 'Design', 'Performance'],
    description: 'Focus on innovation and attention to detail. Technical questions often involve optimization and creative thinking.',
    problems: 187,
    successRate: 85,
    avgSalary: '$190k',
    color: 'bg-gray-800',
    tier: 'FAANG',
    interviewProcess: {
      rounds: 6,
      duration: '4-8 weeks',
      stages: ['Phone Screen', 'Technical Phone', 'Take Home', 'Onsite Technical', 'Design Review', 'Executive Review']
    },
    keyTopics: ['Performance Optimization', 'Memory Management', 'iOS/macOS Development', 'Hardware-Software Integration'],
    tips: [
      'Focus on clean, efficient code',
      'Understand Apple\'s design philosophy',
      'Practice low-level optimization problems',
      'Show attention to user experience details'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: '/companies/meta.png',
    difficulty: 'Hard',
    focus: ['Algorithms', 'System Design', 'Product Sense'],
    description: 'Emphasis on building at scale and product thinking. Strong focus on algorithms and distributed systems.',
    problems: 289,
    successRate: 78,
    avgSalary: '$185k',
    color: 'bg-blue-600',
    tier: 'FAANG',
    interviewProcess: {
      rounds: 5,
      duration: '4-6 weeks',
      stages: ['Recruiter Screen', 'Technical Phone', 'Onsite Coding', 'System Design', 'Behavioral']
    },
    keyTopics: ['Graph Algorithms', 'Distributed Systems', 'Product Design', 'Scalability'],
    tips: [
      'Practice graph and tree problems extensively',
      'Understand social network algorithms',
      'Focus on building products for billions of users',
      'Show impact and data-driven thinking'
    ],
    features: {
      aiPowered: true,
      voiceCoding: true,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: '/companies/netflix.png',
    difficulty: 'Hard',
    focus: ['Scalability', 'Performance', 'Innovation'],
    description: 'Focus on high-performance systems and innovative solutions. Emphasis on handling massive scale.',
    problems: 156,
    successRate: 81,
    avgSalary: '$195k',
    color: 'bg-red-600',
    tier: 'Streaming',
    interviewProcess: {
      rounds: 4,
      duration: '3-5 weeks',
      stages: ['Phone Screen', 'Technical Assessment', 'System Design', 'Culture Fit']
    },
    keyTopics: ['Microservices', 'Streaming Systems', 'Performance Optimization', 'A/B Testing'],
    tips: [
      'Understand streaming and CDN concepts',
      'Focus on performance at scale',
      'Practice microservices architecture',
      'Show innovation and creative problem-solving'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'tesla',
    name: 'Tesla',
    logo: '/companies/tesla.png',
    difficulty: 'Hard',
    focus: ['Innovation', 'Performance', 'Hardware'],
    description: 'Cutting-edge technology focus with emphasis on performance and innovation in automotive and energy.',
    problems: 134,
    successRate: 79,
    avgSalary: '$175k',
    color: 'bg-red-500',
    tier: 'Innovation',
    interviewProcess: {
      rounds: 5,
      duration: '3-6 weeks',
      stages: ['Phone Screen', 'Technical Challenge', 'Onsite Technical', 'System Design', 'Elon Review']
    },
    keyTopics: ['Real-time Systems', 'Embedded Programming', 'Machine Learning', 'Performance Optimization'],
    tips: [
      'Focus on real-time and embedded systems',
      'Understand automotive software challenges',
      'Practice performance-critical algorithms',
      'Show passion for sustainable technology'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: false,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'uber',
    name: 'Uber',
    logo: '/companies/uber.png',
    difficulty: 'Medium',
    focus: ['System Design', 'Scalability', 'Algorithms'],
    description: 'Focus on building scalable systems for real-world problems. Emphasis on practical solutions.',
    problems: 198,
    successRate: 74,
    avgSalary: '$160k',
    color: 'bg-black',
    tier: 'Unicorn',
    interviewProcess: {
      rounds: 4,
      duration: '2-4 weeks',
      stages: ['Phone Screen', 'Technical Phone', 'Onsite Coding', 'System Design']
    },
    keyTopics: ['Location Services', 'Real-time Systems', 'Distributed Systems', 'Graph Algorithms'],
    tips: [
      'Understand location-based services',
      'Practice real-time matching algorithms',
      'Focus on practical system design',
      'Show understanding of marketplace dynamics'
    ],
    features: {
      aiPowered: true,
      voiceCoding: true,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    logo: '/companies/airbnb.png',
    difficulty: 'Medium',
    focus: ['Product Sense', 'Design', 'Algorithms'],
    description: 'Strong emphasis on product thinking and user experience. Focus on building delightful products.',
    problems: 167,
    successRate: 77,
    avgSalary: '$170k',
    color: 'bg-pink-500',
    tier: 'Unicorn',
    interviewProcess: {
      rounds: 5,
      duration: '3-5 weeks',
      stages: ['Phone Screen', 'Technical Phone', 'Coding Challenge', 'System Design', 'Cross-functional']
    },
    keyTopics: ['Product Design', 'User Experience', 'Search Algorithms', 'Recommendation Systems'],
    tips: [
      'Focus on user-centric solutions',
      'Practice product design questions',
      'Understand marketplace and trust & safety',
      'Show empathy and belonging mindset'
    ],
    features: {
      aiPowered: true,
      voiceCoding: true,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'twitter',
    name: 'Twitter',
    logo: '/companies/twitter.png',
    difficulty: 'Medium',
    focus: ['Real-time Systems', 'Scalability', 'Algorithms'],
    description: 'Focus on real-time data processing and social media algorithms. Emphasis on handling viral content.',
    problems: 145,
    successRate: 72,
    avgSalary: '$155k',
    color: 'bg-blue-400',
    tier: 'Social Media',
    interviewProcess: {
      rounds: 4,
      duration: '2-4 weeks',
      stages: ['Phone Screen', 'Technical Assessment', 'System Design', 'Culture Fit']
    },
    keyTopics: ['Real-time Processing', 'Social Graphs', 'Content Ranking', 'Distributed Systems'],
    tips: [
      'Understand social media algorithms',
      'Practice real-time data processing',
      'Focus on handling viral content',
      'Show understanding of content moderation'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    logo: '/companies/linkedin.png',
    difficulty: 'Medium',
    focus: ['Networking', 'Algorithms', 'Product'],
    description: 'Professional networking focus with emphasis on connection algorithms and career-focused products.',
    problems: 178,
    successRate: 80,
    avgSalary: '$165k',
    color: 'bg-blue-700',
    tier: 'Professional',
    interviewProcess: {
      rounds: 4,
      duration: '3-4 weeks',
      stages: ['Phone Screen', 'Technical Phone', 'Onsite Coding', 'System Design']
    },
    keyTopics: ['Graph Algorithms', 'Recommendation Systems', 'Search', 'Professional Networks'],
    tips: [
      'Understand professional networking',
      'Practice graph and network algorithms',
      'Focus on career-related product features',
      'Show understanding of professional development'
    ],
    features: {
      aiPowered: true,
      voiceCoding: true,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logo: '/companies/spotify.png',
    difficulty: 'Medium',
    focus: ['Music Tech', 'Algorithms', 'Scalability'],
    description: 'Music streaming focus with emphasis on recommendation algorithms and audio processing.',
    problems: 142,
    successRate: 83,
    avgSalary: '$150k',
    color: 'bg-green-500',
    tier: 'Entertainment',
    interviewProcess: {
      rounds: 4,
      duration: '2-4 weeks',
      stages: ['Phone Screen', 'Technical Challenge', 'System Design', 'Culture Fit']
    },
    keyTopics: ['Recommendation Systems', 'Audio Processing', 'Machine Learning', 'Content Delivery'],
    tips: [
      'Understand music recommendation algorithms',
      'Practice machine learning concepts',
      'Focus on content delivery at scale',
      'Show passion for music and audio technology'
    ],
    features: {
      aiPowered: true,
      voiceCoding: true,
      whiteboard: false,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'adobe',
    name: 'Adobe',
    logo: '/companies/adobe.png',
    difficulty: 'Medium',
    focus: ['Creative Tech', 'Algorithms', 'Design'],
    description: 'Creative software focus with emphasis on graphics, design tools, and creative workflows.',
    problems: 156,
    successRate: 78,
    avgSalary: '$155k',
    color: 'bg-red-600',
    tier: 'Creative',
    interviewProcess: {
      rounds: 4,
      duration: '3-4 weeks',
      stages: ['Phone Screen', 'Technical Assessment', 'Design Challenge', 'Final Interview']
    },
    keyTopics: ['Graphics Programming', 'Image Processing', 'Creative Workflows', 'User Experience'],
    tips: [
      'Understand graphics and image processing',
      'Practice creative problem-solving',
      'Focus on user experience in creative tools',
      'Show appreciation for design and creativity'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: '/companies/salesforce.png',
    difficulty: 'Medium',
    focus: ['CRM', 'Cloud', 'Enterprise'],
    description: 'Enterprise software focus with emphasis on CRM, cloud platforms, and business solutions.',
    problems: 189,
    successRate: 75,
    avgSalary: '$145k',
    color: 'bg-blue-500',
    tier: 'Enterprise',
    interviewProcess: {
      rounds: 4,
      duration: '2-4 weeks',
      stages: ['Phone Screen', 'Technical Assessment', 'System Design', 'Values Interview']
    },
    keyTopics: ['Enterprise Architecture', 'Cloud Platforms', 'CRM Systems', 'Business Logic'],
    tips: [
      'Understand enterprise software patterns',
      'Practice business logic problems',
      'Focus on scalable cloud solutions',
      'Show understanding of customer success'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'oracle',
    name: 'Oracle',
    logo: '/companies/oracle.png',
    difficulty: 'Medium',
    focus: ['Database', 'Enterprise', 'Cloud'],
    description: 'Database and enterprise software focus with emphasis on data management and cloud infrastructure.',
    problems: 167,
    successRate: 73,
    avgSalary: '$140k',
    color: 'bg-red-700',
    tier: 'Enterprise',
    interviewProcess: {
      rounds: 4,
      duration: '3-5 weeks',
      stages: ['Phone Screen', 'Technical Phone', 'Onsite Technical', 'Manager Interview']
    },
    keyTopics: ['Database Systems', 'SQL Optimization', 'Distributed Systems', 'Enterprise Architecture'],
    tips: [
      'Master database concepts and SQL',
      'Understand enterprise software architecture',
      'Practice data management problems',
      'Show knowledge of cloud infrastructure'
    ],
    features: {
      aiPowered: false,
      voiceCoding: false,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'ibm',
    name: 'IBM',
    logo: '/companies/ibm.png',
    difficulty: 'Medium',
    focus: ['AI', 'Cloud', 'Enterprise'],
    description: 'Focus on AI, cloud computing, and enterprise solutions with emphasis on innovation and research.',
    problems: 145,
    successRate: 76,
    avgSalary: '$135k',
    color: 'bg-blue-800',
    tier: 'Enterprise',
    interviewProcess: {
      rounds: 4,
      duration: '3-4 weeks',
      stages: ['Phone Screen', 'Technical Assessment', 'Technical Interview', 'Behavioral Interview']
    },
    keyTopics: ['Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'Enterprise Solutions'],
    tips: [
      'Understand AI and machine learning concepts',
      'Practice enterprise-scale problems',
      'Focus on innovative solutions',
      'Show interest in research and development'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: false,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'intel',
    name: 'Intel',
    logo: '/companies/intel.png',
    difficulty: 'Hard',
    focus: ['Hardware', 'Performance', 'Systems'],
    description: 'Hardware and systems focus with emphasis on performance optimization and low-level programming.',
    problems: 123,
    successRate: 81,
    avgSalary: '$150k',
    color: 'bg-blue-600',
    tier: 'Hardware',
    interviewProcess: {
      rounds: 5,
      duration: '4-6 weeks',
      stages: ['Phone Screen', 'Technical Phone', 'Onsite Technical', 'System Design', 'Final Review']
    },
    keyTopics: ['Computer Architecture', 'Performance Optimization', 'Embedded Systems', 'Hardware-Software Interface'],
    tips: [
      'Understand computer architecture deeply',
      'Practice low-level optimization problems',
      'Focus on hardware-software interaction',
      'Show knowledge of processor design'
    ],
    features: {
      aiPowered: false,
      voiceCoding: false,
      whiteboard: true,
      peerReview: false,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    logo: '/companies/nvidia.png',
    difficulty: 'Hard',
    focus: ['GPU', 'AI', 'Performance'],
    description: 'GPU computing and AI focus with emphasis on parallel processing and high-performance computing.',
    problems: 134,
    successRate: 84,
    avgSalary: '$180k',
    color: 'bg-green-600',
    tier: 'Hardware',
    interviewProcess: {
      rounds: 5,
      duration: '4-6 weeks',
      stages: ['Phone Screen', 'Technical Assessment', 'GPU Programming', 'System Design', 'Final Interview']
    },
    keyTopics: ['GPU Programming', 'Parallel Computing', 'Machine Learning', 'Computer Graphics'],
    tips: [
      'Master parallel programming concepts',
      'Understand GPU architecture and CUDA',
      'Practice machine learning algorithms',
      'Show knowledge of computer graphics'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: false,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'snap',
    name: 'Snap',
    logo: '/companies/snap.png',
    difficulty: 'Medium',
    focus: ['Mobile', 'AR', 'Social'],
    description: 'Mobile and AR focus with emphasis on creative technology and social media innovation.',
    problems: 112,
    successRate: 79,
    avgSalary: '$165k',
    color: 'bg-yellow-400',
    tier: 'Social Media',
    interviewProcess: {
      rounds: 4,
      duration: '2-4 weeks',
      stages: ['Phone Screen', 'Technical Phone', 'Onsite Coding', 'Product Interview']
    },
    keyTopics: ['Mobile Development', 'Augmented Reality', 'Computer Vision', 'Real-time Processing'],
    tips: [
      'Understand mobile app development',
      'Practice AR and computer vision concepts',
      'Focus on creative and visual features',
      'Show understanding of social media trends'
    ],
    features: {
      aiPowered: true,
      voiceCoding: true,
      whiteboard: false,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    logo: '/companies/tiktok.png',
    difficulty: 'Medium',
    focus: ['Algorithms', 'Video', 'Social'],
    description: 'Video platform focus with emphasis on recommendation algorithms and content processing.',
    problems: 98,
    successRate: 77,
    avgSalary: '$170k',
    color: 'bg-black',
    tier: 'Social Media',
    interviewProcess: {
      rounds: 4,
      duration: '2-4 weeks',
      stages: ['Phone Screen', 'Technical Assessment', 'Algorithm Design', 'Culture Fit']
    },
    keyTopics: ['Recommendation Systems', 'Video Processing', 'Content Algorithms', 'Social Networks'],
    tips: [
      'Understand recommendation algorithms',
      'Practice video processing concepts',
      'Focus on viral content mechanics',
      'Show understanding of global social media'
    ],
    features: {
      aiPowered: true,
      voiceCoding: false,
      whiteboard: true,
      peerReview: true,
      companySpecific: true,
      analytics: true
    }
  }
];

// Company features and capabilities
export const companyFeatures = {
  aiPowered: {
    title: 'AI-Powered Code Analysis',
    description: 'Get instant feedback with complexity analysis, optimization suggestions, and personalized hints',
    icon: '🤖'
  },
  companySpecific: {
    title: 'Company-Specific Preparation',
    description: 'Practice with real interview questions from top tech companies with detailed insights',
    icon: '🏢'
  },
  peerReview: {
    title: 'Peer Review System',
    description: 'Share solutions and get feedback from the community with voting and comment system',
    icon: '👥'
  },
  voiceCoding: {
    title: 'Voice Coding Interface',
    description: 'Practice coding with speech-to-text technology for accessibility and hands-free coding',
    icon: '🎤'
  },
  whiteboard: {
    title: 'Whiteboard Simulator',
    description: 'Practice system design and algorithm sketching with our advanced drawing tools',
    icon: '🖊️'
  },
  analytics: {
    title: 'Advanced Analytics',
    description: 'Track your progress with detailed performance metrics and personalized recommendations',
    icon: '📊'
  }
};

// Company tiers for categorization
export const companyTiers = {
  'FAANG': { color: 'bg-purple-500', label: 'FAANG' },
  'Big Tech': { color: 'bg-blue-500', label: 'Big Tech' },
  'Unicorn': { color: 'bg-green-500', label: 'Unicorn' },
  'Streaming': { color: 'bg-red-500', label: 'Streaming' },
  'Innovation': { color: 'bg-orange-500', label: 'Innovation' },
  'Social Media': { color: 'bg-pink-500', label: 'Social Media' },
  'Professional': { color: 'bg-indigo-500', label: 'Professional' },
  'Entertainment': { color: 'bg-yellow-500', label: 'Entertainment' },
  'Creative': { color: 'bg-purple-600', label: 'Creative' },
  'Enterprise': { color: 'bg-gray-500', label: 'Enterprise' },
  'Hardware': { color: 'bg-cyan-500', label: 'Hardware' }
};

// Helper functions
export const getCompanyById = (id: string): Company | undefined => {
  return companies.find(company => company.id === id);
};

export const getCompaniesByTier = (tier: string): Company[] => {
  return companies.filter(company => company.tier === tier);
};

export const getCompaniesByDifficulty = (difficulty: string): Company[] => {
  return companies.filter(company => company.difficulty === difficulty);
};

export const searchCompanies = (query: string): Company[] => {
  const lowercaseQuery = query.toLowerCase();
  return companies.filter(company => 
    company.name.toLowerCase().includes(lowercaseQuery) ||
    company.focus.some(focus => focus.toLowerCase().includes(lowercaseQuery)) ||
    company.keyTopics.some(topic => topic.toLowerCase().includes(lowercaseQuery))
  );
};

export const getFeaturedCompanies = (): Company[] => {
  return companies.filter(company => ['google', 'amazon', 'microsoft', 'apple', 'meta'].includes(company.id));
};

export const getAllTiers = (): string[] => {
  return [...new Set(companies.map(company => company.tier))];
};