import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { Clock, CheckCircle, XCircle, RotateCcw, Play, BookOpen, Search } from 'lucide-react';
import { apiService } from '@/lib/api';

interface MCQ {
  id: string | number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: string;
  company: string;
  role?: string;
  userAnswer?: number | null;
}

// Generate mock MCQs to supplement API data
const generateMockMCQs = (company: string, role: string, category: string, difficulty: string, count: number): MCQ[] => {
  const mockQuestions = [
    {
      question: `What is the time complexity of searching in a hash table for ${company} interviews?`,
      options: ['O(1) average case', 'O(n) always', 'O(log n) average case', 'O(n²) worst case'],
      correct: 0,
      explanation: 'Hash tables provide O(1) average case lookup time due to direct indexing, though worst case can be O(n) with many collisions.',
      category: 'Data Structures'
    },
    {
      question: `Which design pattern is commonly used in ${company} systems for creating objects?`,
      options: ['Observer Pattern', 'Factory Pattern', 'Strategy Pattern', 'Decorator Pattern'],
      correct: 1,
      explanation: 'Factory Pattern is widely used for object creation, providing flexibility and decoupling object creation from usage.',
      category: 'System Design'
    },
    {
      question: `In JavaScript, what does 'this' refer to in an arrow function?`,
      options: ['The global object', 'The calling object', 'The lexical scope', 'Undefined'],
      correct: 2,
      explanation: 'Arrow functions inherit "this" from the enclosing lexical scope, unlike regular functions.',
      category: 'JavaScript'
    },
    {
      question: `What is the space complexity of merge sort algorithm?`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correct: 2,
      explanation: 'Merge sort requires O(n) additional space for the temporary arrays used during merging.',
      category: 'Algorithms'
    },
    {
      question: `Which HTTP status code indicates a successful POST request that created a resource?`,
      options: ['200 OK', '201 Created', '202 Accepted', '204 No Content'],
      correct: 1,
      explanation: '201 Created indicates that the request was successful and a new resource was created.',
      category: 'Web Development'
    },
    {
      question: `In Python, what is the difference between '==' and 'is'?`,
      options: ['No difference', '== compares values, is compares identity', 'is compares values, == compares identity', 'Both compare identity'],
      correct: 1,
      explanation: '== compares values for equality, while "is" compares object identity (memory location).',
      category: 'Python'
    },
    {
      question: `What is the primary advantage of using microservices architecture?`,
      options: ['Faster development', 'Better scalability and maintainability', 'Lower costs', 'Simpler deployment'],
      correct: 1,
      explanation: 'Microservices provide better scalability, maintainability, and allow teams to work independently on different services.',
      category: 'System Design'
    },
    {
      question: `Which data structure is best for implementing a LRU cache?`,
      options: ['Array', 'Linked List', 'Hash Map + Doubly Linked List', 'Binary Tree'],
      correct: 2,
      explanation: 'LRU cache is efficiently implemented using a combination of hash map for O(1) access and doubly linked list for O(1) insertion/deletion.',
      category: 'Data Structures'
    },
    {
      question: `What is the purpose of the 'virtual' keyword in C++?`,
      options: ['Memory optimization', 'Enable polymorphism', 'Prevent inheritance', 'Static binding'],
      correct: 1,
      explanation: 'The virtual keyword enables runtime polymorphism by allowing derived classes to override base class methods.',
      category: 'C++'
    },
    {
      question: `In database design, what is normalization?`,
      options: ['Data encryption', 'Organizing data to reduce redundancy', 'Creating indexes', 'Data backup'],
      correct: 1,
      explanation: 'Normalization is the process of organizing database tables to reduce data redundancy and improve data integrity.',
      category: 'Database'
    }
  ];

  const selectedQuestions = mockQuestions.slice(0, count);
  
  return selectedQuestions.map((q, index): MCQ => ({
    id: `mock-${Date.now()}-${index}`,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    category: category !== 'all' ? category : q.category,
    difficulty: difficulty !== 'all' ? difficulty : 'Medium',
    company: company,
    role: role || 'Software Engineer',
    userAnswer: null
  }));
};

const EnhancedMCQs: React.FC = () => {
  // User input state
  const [company, setCompany] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  // Fixed limit of 10 questions (handled by backend)

  // MCQ state
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Test state
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [learningMode] = useState<boolean>(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);
  
  // Results state
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Fetch MCQs from API based on user input
  const fetchMCQs = async () => {
    if (!company.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('company', company);
      if (role) params.append('role', role);
      if (category !== 'all') params.append('category', category);
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      params.append('limit', '10'); // Fixed limit of 10 questions

      console.log('🔍 Fetching MCQs with params:', Object.fromEntries(params));

      // Use API service method with fallback
      let apiMCQs = await apiService.getMCQs({
        company: company,
        category: category !== 'all' ? category : undefined,
        difficulty: difficulty !== 'all' ? difficulty : undefined,
        limit: limit
      });

      console.log('✅ Received MCQs from API:', apiMCQs.length, 'questions');

      // If we don't have enough MCQs, add some mock data to reach 10 questions
      if (apiMCQs.length < 10) {
        const mockMCQs = generateMockMCQs(company, role, category, difficulty, 10 - apiMCQs.length);
        apiMCQs = [...apiMCQs, ...mockMCQs];
        console.log('✅ Added mock MCQs, total:', apiMCQs.length, 'questions');
      }

      if (apiMCQs.length === 0) {
        toast.warning('No MCQs found for your criteria. Try different filters.');
        setMcqs([]);
        return;
      }

      // API service already returns properly formatted MCQ objects
      // Just ensure userAnswer is set to null for all questions
      const finalMCQs: MCQ[] = apiMCQs.map(mcq => ({
        ...mcq,
        userAnswer: null
      }));

      // Set MCQs and reset test state
      setMcqs(finalMCQs);
      setUserAnswers(new Array(finalMCQs.length).fill(null));
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTestStarted(false);
      setTestCompleted(false);
      setShowResults(false);
      setScore(0);

      toast.success(`🎉 Loaded ${finalMCQs.length} MCQs for ${company}! Ready to start test.`);
    } catch (error: any) {
      console.error('❌ Failed to fetch MCQs:', error);
      toast.error(`Failed to fetch MCQs: ${error.message}`);
      setMcqs([]);
    } finally {
      setLoading(false);
    }
  };

  // Start the test
  const handleStartTest = () => {
    if (mcqs.length === 0) {
      toast.error('Please fetch MCQs first');
      return;
    }

    setTestStarted(true);
    // RestCompleted(false);
    setCurrentQuestion(0);
    setUserAnswers(new Array(mcqs.length).fill(null));
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(1800); // 30 minutes
    setTimerActive(true);
    setScore(0);
    setShowResults(false);

    toast.success(`🚀 Test started! ${mcqs.length} questions, 30 minutes to complete.`);
  };

  // Handle answer selection with proper TypeScript types
  const handleAnswer = (questionIndex: number, answerIndex: number): void => {
    if (testCompleted) return;
    
    // Update user's answer with proper type safety
    setUserAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
    
    // Update selected answer for the current question
    setSelectedAnswer(answerIndex);
    
    // In learning mode, show explanation immediately
    if (learningMode) {
      setShowExplanation(true);
    }
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(userAnswers[currentQuestion + 1]);
      setShowExplanation(false);
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1]);
      setShowExplanation(false);
    }
  };

  // Show explanation for current question
  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  // Finish the test and show results
  const handleFinishTest = () => {
    setTestCompleted(true);
    setTimerActive(false);
    setShowResults(true);

    // Calculate score
    const correctAnswers = userAnswers.reduce((count, answer, index) => {
      return answer === mcqs[index]?.correct ? count + 1 : count;
    }, 0);

    const finalScore = Math.round((correctAnswers / mcqs.length) * 100);
    setScore(finalScore);

    // Save test results
    const testResults = {
      id: Date.now(),
      date: new Date().toISOString(),
      company: company,
      role: role || 'Software Engineer',
      category: category,
      difficulty: difficulty,
      totalQuestions: mcqs.length,
      correctAnswers: correctAnswers,
      incorrectAnswers: mcqs.length - correctAnswers,
      unansweredQuestions: userAnswers.filter(a => a === null).length,
      score: finalScore,
      timeSpent: 1800 - timeLeft,
      timeSpentMinutes: Math.floor((1800 - timeLeft) / 60),
      timeSpentSeconds: (1800 - timeLeft) % 60,
      questions: mcqs.map((q, i) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        userAnswer: userAnswers[i],
        correctAnswer: q.correct,
        isCorrect: userAnswers[i] === q.correct,
        explanation: q.explanation
      }))
    };

    // Save to localStorage
    const previousResults = JSON.parse(localStorage.getItem('mcqTestResults') || '[]');
    localStorage.setItem('mcqTestResults', JSON.stringify([...previousResults, testResults]));

    toast.success(`🎯 Test completed! Score: ${correctAnswers}/${mcqs.length} (${finalScore}%)`);
  };

  // Reset everything
  const handleReset = () => {
    setMcqs([]);
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(1800);
    setTimerActive(false);
    setScore(0);
    setShowResults(false);
    setCompany('');
    setRole('');
    setCategory('all');
    setDifficulty('all');

    toast.info('Reset complete. Ready for new MCQs!');
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const progress = mcqs.length > 0 ? ((currentQuestion + 1) / mcqs.length) * 100 : 0;
  const answeredCount = userAnswers.filter(answer => answer !== null).length;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
            📝 MCQ Practice Test
          </h1>
          <p className="text-blue-700 dark:text-blue-300">
            Test your knowledge with company-specific multiple choice questions
          </p>
          
          {testStarted && !showResults && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                <span>Progress: {answeredCount}/{mcqs.length} answered</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)} remaining
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        {/* Input Section - Only show when not in test */}
        {!testStarted && !showResults && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold">Configure Your Test</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <Input
                  placeholder="e.g., Google, Amazon, Microsoft"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <Input
                  placeholder="e.g., Software Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="algorithms">Algorithms</SelectItem>
                    <SelectItem value="data-structures">Data Structures</SelectItem>
                    <SelectItem value="system-design">System Design</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>


            </div>

            <div className="flex gap-3">
              <Button 
                onClick={fetchMCQs} 
                disabled={loading || !company.trim()}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Fetching...' : 'Fetch MCQs'}
              </Button>
              
              {mcqs.length > 0 && (
                <Button 
                  onClick={handleStartTest}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4" />
                  Start Test ({mcqs.length} Questions)
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* MCQ Preview - Show when MCQs are loaded but test not started */}
        {mcqs.length > 0 && !testStarted && !showResults && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                  📚 MCQ Preview - {mcqs.length} Questions Loaded
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Review the questions and explanations below, then start the test when ready
                </p>
              </div>
              
              <Button 
                onClick={handleStartTest}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                Start Test Mode
              </Button>
            </div>

            {/* Questions Preview */}
            <div className="space-y-6">
              {mcqs.map((mcq, index) => (
                <div key={mcq.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-medium">
                      Q{index + 1}: {mcq.question}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{mcq.difficulty}</Badge>
                      <Badge variant="outline">{mcq.category}</Badge>
                    </div>
                  </div>

                  {/* Options Preview */}
                  <div className="space-y-2 mb-4">
                    {mcq.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`p-3 rounded border ${
                          optionIndex === mcq.correct 
                            ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                            : 'border-gray-200 bg-white dark:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            optionIndex === mcq.correct
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300'
                          }`}>
                            {optionIndex === mcq.correct && (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </div>
                          <span className={optionIndex === mcq.correct ? 'font-medium text-green-700 dark:text-green-300' : ''}>
                            {option}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Explanation Preview */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Explanation:</h5>
                    <p className="text-blue-800 dark:text-blue-200">{mcq.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* MCQ Test Mode - Show when test is started */}
        {testStarted && !showResults && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">
                  Question {currentQuestion + 1} of {mcqs.length}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{company}</Badge>
                  <Badge variant="outline">{mcqs[currentQuestion]?.difficulty}</Badge>
                  <Badge variant="outline">{mcqs[currentQuestion]?.category}</Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Time Remaining</div>
                <div className="text-lg font-mono font-bold text-orange-600">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">
                {mcqs[currentQuestion]?.question}
              </h4>

              {/* Options */}
              <div className="space-y-3">
                {mcqs[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion, index)}
                    disabled={testCompleted}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    } ${testCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation in test mode (only show if learning mode or after answer) */}
            {showExplanation && mcqs[currentQuestion]?.explanation && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation:</h5>
                <p className="text-blue-800 dark:text-blue-200">{mcqs[currentQuestion].explanation}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {selectedAnswer !== null && !showExplanation && (
                  <Button
                    onClick={handleShowExplanation}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Show Explanation
                  </Button>
                )}

                <Button
                  onClick={handleFinishTest}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Finish Test
                </Button>
              </div>

              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestion === mcqs.length - 1}
              >
                Next
              </Button>
            </div>
          </Card>
        )}

        {/* Results Section */}
        {showResults && (
          <div className="space-y-6">
            {/* Score Summary */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
                  <span className="text-2xl font-bold text-white">{score}%</span>
                </div>
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                  Test Completed!
                </h2>
                <p className="text-green-700 dark:text-green-300">
                  You scored {userAnswers.filter((answer, index) => answer === mcqs[index]?.correct).length} out of {mcqs.length} questions correctly
                </p>
              </div>
            </Card>

            {/* Detailed Statistics */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Test Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{userAnswers.filter((answer, index) => answer === mcqs[index]?.correct).length}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Correct</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{userAnswers.filter((answer, index) => answer !== null && answer !== mcqs[index]?.correct).length}</div>
                  <div className="text-sm text-red-700 dark:text-red-300">Incorrect</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{userAnswers.filter(answer => answer === null).length}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Unanswered</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formatTime(1800 - timeLeft)}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Time Taken</div>
                </div>
              </div>

              {/* Question Review */}
              <div className="space-y-4">
                <h4 className="font-semibold">Question Review:</h4>
                {mcqs.map((mcq, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === mcq.correct;
                  const wasAnswered = userAnswer !== null;

                  return (
                    <div key={mcq.id} className={`p-4 rounded-lg border ${
                      !wasAnswered ? 'border-gray-300 bg-gray-50 dark:bg-gray-800' :
                      isCorrect ? 'border-green-300 bg-green-50 dark:bg-green-900/20' :
                      'border-red-300 bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium">Q{index + 1}: {mcq.question}</h5>
                        <div className="flex items-center gap-2">
                          {!wasAnswered ? (
                            <XCircle className="w-5 h-5 text-gray-500" />
                          ) : isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        {!wasAnswered ? (
                          <p className="text-gray-600 dark:text-gray-400">Not answered</p>
                        ) : (
                          <>
                            <p className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                              Your answer: {mcq.options[userAnswer]}
                            </p>
                            {!isCorrect && (
                              <p className="text-green-700 dark:text-green-300">
                                Correct answer: {mcq.options[mcq.correct]}
                              </p>
                            )}
                          </>
                        )}
                        <p className="text-blue-700 dark:text-blue-300 mt-2">
                          <strong>Explanation:</strong> {mcq.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleReset} className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Take Another Test
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMCQs;