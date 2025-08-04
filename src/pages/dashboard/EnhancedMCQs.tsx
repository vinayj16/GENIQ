/** @jsxImportSource react */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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
  showExplanation?: boolean;
  userAnswer?: number | null;
}

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
  showExplanation?: boolean;
  userAnswer?: number | null;
}

const EnhancedMCQs: React.FC = () => {
  // State for form inputs
  const [companyInput, setCompanyInput] = useState<string>('');
  const [roleInput, setRoleInput] = useState<string>('');

  // State for filters
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    limit: 10
  });

  // State for MCQs and test flow
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [learningMode, setLearningMode] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes in seconds
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Helper function to calculate score
  const calculateScore = (answers: (number | null)[], questions: MCQ[]): number => {
    return answers.reduce((acc, answer, index) => {
      return answer === questions[index]?.correct ? acc + 1 : acc;
    }, 0);
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (submitted || !testStarted) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
    setSelectedAnswer(answerIndex);
    
    if (learningMode) {
      // In learning mode, show explanation immediately
      const updatedMcqs = [...mcqs];
      updatedMcqs[currentQuestion] = {
        ...updatedMcqs[currentQuestion],
        showExplanation: true,
        userAnswer: answerIndex
      };
      setMcqs(updatedMcqs);
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(userAnswers[currentQuestion + 1] ?? null);
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1] ?? null);
    }
  };

  // Submit test
  const submitTest = () => {
    const finalScore = calculateScore(userAnswers, mcqs);
    setScore(finalScore);
    setSubmitted(true);
    setShowResult(true);
    setTimerActive(false);
  };

  // Reset test
  const resetTest = () => {
    setMcqs(prev => prev.map(mcq => ({
      ...mcq,
      showExplanation: false,
      userAnswer: null
    })));
    setUserAnswers(new Array(mcqs.length).fill(null));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowResult(false);
    setScore(0);
    setTimeLeft(1800);
    setTestStarted(false);
    setLearningMode(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && testStarted) {
      finishTest();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, testStarted]);

  useEffect(() => {
    if (mcqs.length > 0 && !showResult) {
      const allAnswered = userAnswers.every(answer => answer !== null);
      if (allAnswered && userAnswers.length > 0) {
        const timer = setTimeout(() => {
          finishTest();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [userAnswers, mcqs, showResult]);

  const startLearning = () => {
    setLearningMode(true);
    setTestStarted(true);
    setTimerActive(false);
    setShowResult(false);
    setSubmitted(false);
  };

  const startTest = () => {
    if (mcqs.length === 0) {
      toast.error('No questions available. Please fetch questions first.');
      return;
    }

    setTestStarted(true);
    setLearningMode(false);
    setTimeLeft(1800); // 30 minutes
    setTimerActive(true);
    setShowResult(false);
    setSubmitted(false);

    // Reset user answers for test mode
    setUserAnswers(new Array(mcqs.length).fill(null));
    setCurrentQuestion(0);
    setScore(0);
  };

  const fetchMCQs = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (companyInput) params.append('company', companyInput);
      if (roleInput) params.append('role', roleInput);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
      if (filters.limit) params.append('limit', filters.limit.toString());

      // Call the API service to fetch MCQs
      const fetchedMCQs = await apiService.getMCQs({
        company: companyInput,
        category: filters.category !== 'all' ? filters.category : undefined,
        difficulty: filters.difficulty !== 'all' ? filters.difficulty : undefined,
        limit: filters.limit
      });

      if (fetchedMCQs.length === 0) {
        toast.info('No MCQs found for the selected filters. Try different criteria.');
        return;
      }

      // Transform the response to match our MCQ interface
      const formattedMCQs: MCQ[] = fetchedMCQs.map((mcq: any) => ({
        id: mcq.id || Math.random().toString(36).substr(2, 9),
        question: mcq.question || 'Sample question',
        options: Array.isArray(mcq.options) ? mcq.options : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correct: typeof mcq.correct === 'number' ? mcq.correct : 0,
        explanation: mcq.explanation || 'No explanation available',
        category: mcq.category || 'General',
        difficulty: mcq.difficulty || 'Medium',
        company: mcq.company || 'General',
        role: mcq.role || '',
        showExplanation: false,
        userAnswer: null
      }));

      // Update state with the fetched and formatted MCQs
      setMcqs(formattedMCQs);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setUserAnswers(new Array(formattedMCQs.length).fill(null));
      setScore(0);
      setSubmitted(false);
      setShowResult(false);

      // Start in learning mode with the first question
      setLearningMode(true);
      setTestStarted(true);
      setTimerActive(false);

      toast.success(`Fetched ${formattedMCQs.length} MCQs`);
    } catch (error) {
      console.error('Error fetching MCQs:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch MCQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize test with fetched questions
  const initializeTest = () => {
    if (mcqs.length === 0) {
      alert('No questions available. Please fetch questions first.');
      return false;
    }
    setTestStarted(true);
    setScore(0);
    setUserAnswers(new Array(mcqs.length).fill(null));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setSubmitted(false);
    setTimeLeft(1800);
    return true;
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    if (submitted || !testStarted) return;

    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);

    // Update the MCQ with the user's answer and show explanation in learning mode
    setMcqs(prevMcqs =>
      prevMcqs.map((mcq, i) => {
        if (i === questionIndex) {
          const updatedMcq = {
            ...mcq,
            userAnswer: answerIndex,
            isCorrect: answerIndex === mcq.correct
          };

          // In learning mode, show explanation immediately
          if (learningMode) {
            updatedMcq.showExplanation = true;
          }

          return updatedMcq;
        }
        return mcq;
      })
    );

    // In learning mode, move to next question after a short delay
    if (learningMode && questionIndex < mcqs.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => Math.min(prev + 1, mcqs.length - 1));
      }, 1000);
    }
  };

  const finishTest = () => {
    if (!submitted && mcqs.length > 0) {
      // Ensure all unanswered questions are marked as incorrect
      const finalUserAnswers = [...userAnswers];
      let correctCount = 0;

      // Calculate score and update answers
      const updatedMcqs = mcqs.map((mcq, index) => {
        const userAnswer = finalUserAnswers[index];
        const isCorrect = userAnswer === mcq.correct;

        if (userAnswer === null) {
          finalUserAnswers[index] = -1; // Mark as unanswered
        } else if (isCorrect) {
          correctCount++;
        }

        return {
          ...mcq,
          userAnswer,
          isCorrect,
          showExplanation: true // Show explanations in results
        };
      });

      // Update state
      setMcqs(updatedMcqs);
      setUserAnswers(finalUserAnswers);
      setScore(Math.round((correctCount / mcqs.length) * 100));
      setSubmitted(true);
      setShowResult(true);
      setTimerActive(false);

      // Save test results
      const testResults = {
        id: Date.now(),
        date: new Date().toISOString(),
        company: companyInput || 'Demo Company',
        role: roleInput || 'Senior Developer',
        totalQuestions: mcqs.length,
        correctAnswers: correctCount,
        score: Math.round((correctCount / mcqs.length) * 100),
        timeSpent: 1800 - timeLeft,
        questions: updatedMcqs.map((q, i) => ({
          question: q.question,
          userAnswer: finalUserAnswers[i],
          correctAnswer: q.correct,
          isCorrect: finalUserAnswers[i] === q.correct,
          explanation: q.explanation
        }))
      };

      // Save to localStorage
      const previousResults = JSON.parse(localStorage.getItem('testResults') || '[]');
      localStorage.setItem('testResults', JSON.stringify([...previousResults, testResults]));

      // Show success message
      toast.success(`Test submitted! Your score: ${Math.round((correctCount / mcqs.length) * 100)}%`);

      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const resetQuiz = () => {
    setMcqs([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTestStarted(false);
    setSubmitted(false);
    setTimeLeft(1800);
    setScore(0);
    setUserAnswers([]);
    setCompanyInput('');
    setRoleInput('');
    setFilters({
      category: 'all',
      difficulty: 'all',
      limit: 10
    });
  };

  const clearResults = () => {
    setMcqs([]);
    setShowResult(false);
    setTestStarted(false);
    setUserAnswers([]);
    setScore(0);
    setCompanyInput('');
    setRoleInput('');
    resetQuiz();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/20 text-success border-success/30';
      case 'Medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'Hard': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const answeredCount = userAnswers.filter(a => a !== null).length;
  const progress = mcqs.length > 0 ? Math.round((answeredCount / mcqs.length) * 100) : 0;
  const timeLeftFormatted = formatTime(timeLeft);

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="card-glow p-6 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10 rounded-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            📝 MCQ Practice
          </h1>
          <p className="text-muted-foreground">Test your knowledge with company-specific questions</p>

          {mcqs.length > 0 && !showResult && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress: {answeredCount}/{mcqs.length} answered</span>
                <span>⏱️ {timeLeftFormatted} remaining</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        {/* Input Section */}
        {!testStarted && !showResult && (
          <Card className="card-elevated p-6 border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Test Configuration</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <Input
                  placeholder="e.g., Google, Amazon, Microsoft"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <Input
                  placeholder="e.g., Software Engineer, Data Scientist"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger className="input-premium">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="algorithms">Algorithms</SelectItem>
                    <SelectItem value="system-design">System Design</SelectItem>
                    <SelectItem value="databases">Databases</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <Select value={filters.difficulty} onValueChange={(value) => setFilters({ ...filters, difficulty: value })}>
                  <SelectTrigger className="input-premium">
                    <SelectValue placeholder="All Levels" />
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
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 btn-hero"
                  onClick={async () => {
                    await fetchMCQs();
                    if (mcqs.length > 0) {
                      initializeTest();
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    `Fetch & Start Test (${mcqs.length > 0 ? mcqs.length + ' questions' : ''})`
                  )}
                </Button>
              </div>
              {showResult && (
                <Button onClick={clearResults} variant="outline" className="btn-premium">
                  🗑️ Clear Results
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Questions List */}
        {mcqs.length > 0 && !showResult && (
          <Card className="card-elevated p-6 border border-border/50 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground/90">{companyInput}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{roleInput}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {mcqs.length} {mcqs.length === 1 ? 'Question' : 'Questions'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {timeLeftFormatted} remaining
                  </span>
                </div>
              </div>
              <Button
                onClick={finishTest}
                variant="default"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md shadow-primary/20"
                disabled={userAnswers.every(a => a === null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Submit All Answers
              </Button>
            </div>

            {mcqs.map((mcq, questionIndex) => (
              <div key={mcq.id || questionIndex} className="group relative p-5 rounded-xl border border-border/50 hover:border-primary/30 transition-colors mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getDifficultyColor(mcq.difficulty)}>
                      {mcq.difficulty}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      {mcq.category}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    {userAnswers[questionIndex] !== null && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Answered
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Question {questionIndex + 1} of {mcqs.length}
                  </span>
                </div>

                <h4 className="text-lg font-semibold mb-4 text-foreground/90">{mcq.question}</h4>

                {/* Answer Options */}
                <div className="space-y-3 mb-4">
                  {mcq.options && mcq.options.map((option, optionIndex) => {
                    const isSelected = userAnswers[questionIndex] === optionIndex;
                    const isCorrect = optionIndex === mcq.correct;
                    const showResult = submitted || (learningMode && userAnswers[questionIndex] !== null);

                    let optionClass = "p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary/50";

                    if (showResult) {
                      if (isCorrect) {
                        optionClass += " bg-green-50 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-400 dark:text-green-200";
                      } else if (isSelected && !isCorrect) {
                        optionClass += " bg-red-50 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-200";
                      } else {
                        optionClass += " bg-muted/30 border-border";
                      }
                    } else if (isSelected) {
                      optionClass += " bg-primary/10 border-primary text-primary";
                    } else {
                      optionClass += " bg-background border-border hover:bg-muted/50";
                    }

                    return (
                      <div
                        key={optionIndex}
                        className={optionClass}
                        onClick={() => !submitted && handleAnswer(questionIndex, optionIndex)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${showResult && isCorrect
                              ? 'border-green-500 bg-green-500'
                              : showResult && isSelected && !isCorrect
                                ? 'border-red-500 bg-red-500'
                                : isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-muted-foreground'
                              }`}>
                              {showResult && isCorrect && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {showResult && isSelected && !isCorrect && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                              {isSelected && !showResult && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-sm">
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </span>
                          </div>
                          {showResult && isCorrect && (
                            <div className="flex-shrink-0">
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-600">
                                Correct
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show explanation after answering or in results */}
                {(submitted || (learningMode && userAnswers[questionIndex] !== null)) && mcq.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-1">Explanation:</p>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">{mcq.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </Card>
        )}

        {/* Results Section */}
        {showResult && (
          <div id="results-section" className="space-y-6">
            {/* Score Summary */}
            <Card className="card-glow p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Test Completed!</h2>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{score}%</div>
                <p className="text-green-700 dark:text-green-300">
                  You scored {userAnswers.filter((answer, i) => answer === mcqs[i]?.correct).length} out of {mcqs.length} questions correctly
                </p>
                <div className="flex justify-center gap-4 mt-4 text-sm text-green-600 dark:text-green-400">
                  <span>⏱️ Time taken: {formatTime(1800 - timeLeft)}</span>
                  <span>📊 Accuracy: {score}%</span>
                  <span>✅ Correct: {userAnswers.filter((answer, i) => answer === mcqs[i]?.correct).length}</span>
                  <span>❌ Incorrect: {userAnswers.filter((answer, i) => answer !== mcqs[i]?.correct && answer !== null).length}</span>
                </div>
              </div>
            </Card>

            {/* Performance Breakdown */}
            <Card className="card-elevated p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                Performance Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Easy', 'Medium', 'Hard'].map(difficulty => {
                  const questionsOfDifficulty = mcqs.filter(q => q.difficulty === difficulty);
                  const correctOfDifficulty = questionsOfDifficulty.filter((q, i) => {
                    const originalIndex = mcqs.findIndex(mq => mq.id === q.id);
                    return userAnswers[originalIndex] === q.correct;
                  }).length;
                  const totalOfDifficulty = questionsOfDifficulty.length;
                  const percentageOfDifficulty = totalOfDifficulty > 0 ? Math.round((correctOfDifficulty / totalOfDifficulty) * 100) : 0;

                  return (
                    <div key={difficulty} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{difficulty}</span>
                        <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                          {correctOfDifficulty}/{totalOfDifficulty}
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${difficulty === 'Easy' ? 'bg-green-500' :
                            difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${percentageOfDifficulty}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{percentageOfDifficulty}% correct</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setShowResult(false);
                  setTestStarted(false);
                  setSubmitted(false);
                  setUserAnswers(new Array(mcqs.length).fill(null));
                  setScore(0);
                  setTimeLeft(1800);
                  // Reset MCQs to hide explanations
                  setMcqs(mcqs.map(mcq => ({ ...mcq, showExplanation: false, userAnswer: null })));
                }}
                className="btn-hero"
              >
                🔄 Retake Test
              </Button>
              <Button
                onClick={() => fetchMCQs()}
                variant="outline"
                className="btn-premium"
              >
                📝 New Questions
              </Button>
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="btn-premium"
              >
                🏠 Back to Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMCQs;