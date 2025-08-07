import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { apiService } from '@/lib/api';
import { aiService } from '@/lib/blink';
import { Problem } from '@/types/dashboard';
import { CheckCircle, Clock, Play, Terminal, Lightbulb } from 'lucide-react';

interface TestResult {
  status: 'success' | 'error';
  output: string;
  testCasesPassed: number;
  totalTestCases: number;
  executionTime: string;
  memoryUsage: string;
  results: Array<{
    input: any;
    expected: any;
    actual: any;
    passed: boolean;
  }>;
}

interface AIAnalysis {
  feedback: string;
  score: number;
  suggestions: string[];
  overallScore: number;
  codeQuality: number;
  efficiency: number;
}

const EnhancedCoding = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [userCode, setUserCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [userSolutions, setUserSolutions] = useState<Record<number, string>>({});
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testStartedMode, setTestStartedMode] = useState(false);
  const [learningMode, setLearningMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [companyInput, setCompanyInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [difficultyFilter, setDifficultyFilter] = useState('All Levels');
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [testScore, setTestScore] = useState(0);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [completedProblems, setCompletedProblems] = useState<Set<number>>(new Set());
  const [hint, setHint] = useState<string>('');

  useEffect(() => {
    const loadInitialProblems = async () => {
      setLoading(true);
      try {
        console.log('Loading initial problems...');
        const fallbackProblems = await apiService.getFallbackProblems();
        console.log('Loaded problems:', fallbackProblems);
        
        if (fallbackProblems && fallbackProblems.length > 0) {
          setProblems(fallbackProblems);
          setFilteredProblems(fallbackProblems);
          console.log('Problems set successfully:', fallbackProblems.length);
        } else {
          console.warn('No problems returned from API');
          toast.error('No problems available. Please try again later.');
        }
      } catch (error) {
        toast.error('Failed to load introductory problems.');
        console.error('Failed to load introductory problems:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialProblems();
  }, []);

  const finishTest = useCallback(() => {
    setTestStartedMode(false);
    setTimerActive(false);
    setShowResult(true);
    setSubmitted(true);
    
    // Calculate final test score
    const totalProblems = filteredProblems.length;
    const completedCount = completedProblems.size;
    const finalScore = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;
    
    setTestScore(finalScore);
    setProblemsCompleted(completedCount);
    
    // Save test results to localStorage
    const testResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      company: companyInput || 'General',
      role: roleInput || 'Software Engineer',
      totalProblems,
      completedProblems: completedCount,
      score: finalScore,
      timeSpent: 3600 - timeLeft,
      problems: filteredProblems.map(p => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        completed: completedProblems.has(p.id),
        category: p.category
      }))
    };
    
    const previousResults = JSON.parse(localStorage.getItem('codingTestResults') || '[]');
    localStorage.setItem('codingTestResults', JSON.stringify([...previousResults, testResult]));
    
    toast.success(`Test completed! Score: ${finalScore}%`);
  }, [filteredProblems, completedProblems, companyInput, roleInput, timeLeft]);

  const runCode = useCallback(async (): Promise<TestResult | null> => {
    if (!userCode.trim()) {
      toast.error('Please write some code first');
      return null;
    }
    setLoading(true);
    try {
      // Simulate running test cases
      await new Promise(resolve => setTimeout(resolve, 1000));
      const totalTestCases = selectedProblem?.testCases.length || 3;
      const passedTestCases = Math.floor(Math.random() * (totalTestCases + 1));
      const executionTime = Math.floor(Math.random() * 100) + 10;

      const mockResults: TestResult = {
        status: passedTestCases === totalTestCases ? 'success' : 'error',
        output: passedTestCases === totalTestCases ? 'All test cases passed!' : 'Some test cases failed',
        testCasesPassed: passedTestCases,
        totalTestCases: totalTestCases,
        executionTime: `${executionTime}ms`,
        memoryUsage: `${(Math.random() * 10).toFixed(2)}MB`,
        results: Array.from({ length: totalTestCases }, (_, index) => ({
          input: selectedProblem?.testCases[index]?.input || `Test Case ${index + 1}`,
          expected: selectedProblem?.testCases[index]?.expected || 'Expected Output',
          actual: index < passedTestCases ? (selectedProblem?.testCases[index]?.expected || 'Expected Output') : 'Wrong Output',
          passed: index < passedTestCases
        }))
      };
      setTestResults(mockResults);
      if (learningMode) {
        toast.success(`Test cases passed: ${passedTestCases}/${totalTestCases}`);
      }
      return mockResults;
    } catch (error) {
      console.error('Error running code:', error);
      toast.error('Failed to run code');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userCode, learningMode, selectedProblem]);

  const runAIAnalysis = useCallback(async () => {
    if (!userCode.trim() || !selectedProblem) {
      toast.error('Please write some code first');
      return;
    }
    
    setLoading(true);
    try {
      const analysis = await aiService.analyzeCode(
        userCode, 
        language, 
        selectedProblem.difficulty
      );
      
      const aiAnalysisResult: AIAnalysis = {
        feedback: analysis.feedback,
        score: analysis.score,
        suggestions: analysis.suggestions || [],
        overallScore: analysis.score,
        codeQuality: Math.round(analysis.score * 0.9),
        efficiency: Math.round(analysis.score * 1.1)
      };
      
      setAiAnalysis(aiAnalysisResult);
      toast.success('AI analysis complete!');
    } catch (error) {
      console.error('Error running AI analysis:', error);
      toast.error('Failed to run AI analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userCode, language, selectedProblem]);

  const handleSubmitAndAnalyze = useCallback(async () => {
    const results = await runCode();
    if (results && results.status === 'success') {
      runAIAnalysis();
    } else if (results) {
      toast.error('Please fix the errors before analyzing the code.');
    }
  }, [runCode, runAIAnalysis]);

  const handleProblemSelect = useCallback((problemId: number) => {
    const problem = filteredProblems.find(p => p.id === problemId);
    if (problem) {
      setSelectedProblem(problem);
      setUserCode(userSolutions[problem.id] || problem.codeTemplate[language as keyof typeof problem.codeTemplate] || '');
      setTestResults(null);
      setAiAnalysis(null);
    }
  }, [filteredProblems, userSolutions, language]);

  const handleSubmit = useCallback(async () => {
    if (!selectedProblem) return;
    setLoading(true);
    try {
      const updatedSolutions = { ...userSolutions };
      updatedSolutions[selectedProblem.id] = userCode;
      setUserSolutions(updatedSolutions);
      const results = await runCode();
      if (testStartedMode && results?.testCasesPassed === results?.totalTestCases) {
        // Mark problem as completed
        setCompletedProblems(prev => new Set([...prev, selectedProblem.id]));
        
        const currentIndex = filteredProblems.findIndex(p => p.id === selectedProblem.id);
        if (currentIndex < filteredProblems.length - 1) {
          const nextProblem = filteredProblems[currentIndex + 1];
          handleProblemSelect(nextProblem.id);
          toast.success('Problem completed! Moving to next problem.');
        } else {
          toast.success('Congratulations! You have completed all problems.');
          finishTest();
        }
      }
      toast.success('Code submitted successfully!');
    } catch (error) {
      console.error('Error submitting code:', error);
      toast.error('Failed to submit code');
    } finally {
      setLoading(false);
    }
  }, [selectedProblem, userCode, userSolutions, filteredProblems, testStartedMode, runCode, finishTest, handleProblemSelect]);

  const analyzeCode = useCallback(async () => {
    if (!userCode.trim() || !selectedProblem) {
      toast.error('Please write some code first');
      return;
    }
    
    setLoading(true);
    try {
      const analysis = await aiService.analyzeCode(
        userCode, 
        language, 
        selectedProblem.difficulty
      );
      
      const aiAnalysisResult: AIAnalysis = {
        feedback: analysis.feedback,
        score: analysis.score,
        suggestions: analysis.suggestions || [],
        overallScore: analysis.score,
        codeQuality: Math.round(analysis.score * 0.9),
        efficiency: Math.round(analysis.score * 1.1)
      };
      
      setAiAnalysis(aiAnalysisResult);
      toast.success('Code analysis complete!');
    } catch (error) {
      console.error('Error analyzing code:', error);
      toast.error('Failed to analyze code. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userCode, language, selectedProblem]);

  const generateHint = useCallback(async () => {
    if (!selectedProblem) {
      toast.error('Please select a problem first');
      return;
    }
    
    setLoading(true);
    try {
      const hintResult = await aiService.generateHint(
        selectedProblem.title,
        userCode,
        language
      );
      
      setHint(hintResult.hint);
      toast.success('Hint generated!');
    } catch (error) {
      console.error('Error generating hint:', error);
      toast.error('Failed to generate hint. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedProblem, userCode, language]);

  const clearResults = useCallback(() => {
    setTestResults(null);
    setAiAnalysis(null);
    setHint('');
    if (selectedProblem) {
      setUserCode(userSolutions[selectedProblem.id] || selectedProblem.codeTemplate[language as keyof typeof selectedProblem.codeTemplate] || '');
    }
  }, [selectedProblem, userSolutions, language]);

  const getDifficultyColor = useCallback((difficulty: string): string => {
    const difficultyMap: Record<string, string> = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800',
    };
    return difficultyMap[difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }, []);

  const startLearning = useCallback(() => {
    setLearningMode(true);
    setTestStarted(false);
    setTimerActive(false);
    setShowResult(false);
    setSubmitted(false);
    if (problems.length > 0) {
      setFilteredProblems(problems);
      handleProblemSelect(problems[0].id);
    }
  }, [problems, handleProblemSelect]);

  const startTest = useCallback(() => {
    setLearningMode(false);
    setTestStarted(true);
    setTestStartedMode(true);
    setTimeLeft(3600);
    setTimerActive(true);
    setShowResult(false);
    setSubmitted(false);
    if (filteredProblems.length > 0) {
      handleProblemSelect(filteredProblems[0].id);
    }
  }, [filteredProblems, handleProblemSelect]);

  const handleFilterChange = useCallback(async (isSearch = false) => {
    setLoading(true);
    try {
      let finalProblems: Problem[] = [];

      if (isSearch && (companyInput.trim() || roleInput.trim())) {
        const searchResults = await apiService.getEnhancedCodingProblems({ company: companyInput, role: roleInput });
        finalProblems = searchResults.slice(0, 5);

        if (finalProblems.length < 5) {
          const fallbackProblems = problems
            .filter(p => !finalProblems.some(sp => sp.id === p.id))
            .slice(0, 5 - finalProblems.length);
          finalProblems = [...finalProblems, ...fallbackProblems];
        }
      } else {
        finalProblems = problems.filter(p => 
          (categoryFilter === 'All Categories' || p.category === categoryFilter) &&
          (difficultyFilter === 'All Levels' || p.difficulty === difficultyFilter)
        );
      }

      if (finalProblems.length > 0) {
        setFilteredProblems(finalProblems);
        const firstProblem = finalProblems[0];
        setSelectedProblem(firstProblem);
        setUserCode(userSolutions[firstProblem.id] || firstProblem.codeTemplate[language as keyof typeof firstProblem.codeTemplate] || '');
        setTestResults(null);
        setAiAnalysis(null);
      } else {
        toast.error('No problems found for your criteria.');
        setFilteredProblems([]);
        setSelectedProblem(null);
      }
    } catch (error) {
      toast.error('Failed to fetch or filter problems.');
      console.error('Filter/Search error:', error);
      setFilteredProblems(problems);
    } finally {
      setLoading(false);
    }
  }, [problems, categoryFilter, difficultyFilter, companyInput, roleInput, language, userSolutions]);

  const handleSearch = useCallback(() => {
    handleFilterChange(true);
  }, [handleFilterChange]);

  useEffect(() => {
    if (filteredProblems.length > 0) {
      const problemExists = filteredProblems.some(p => p.id === selectedProblem?.id);
      if (!problemExists) {
        handleProblemSelect(filteredProblems[0].id);
      }
    } else {
      setSelectedProblem(null);
    }
  }, [filteredProblems, handleProblemSelect]);

  const fetchAndStartTest = useCallback(async () => {
    if (!companyInput || !roleInput) {
      toast.error("Please provide both company and role to fetch questions.");
      return;
    }
    setLoading(true);
    try {
      const fetchedProblems = await apiService.getEnhancedCodingProblems({ company: companyInput, role: roleInput });
      if (fetchedProblems && fetchedProblems.length > 0) {
        setProblems(fetchedProblems);
        setFilteredProblems(fetchedProblems);
        handleProblemSelect(fetchedProblems[0].id);
        startTest();
      } else {
        toast.warning('No problems found for the selected criteria. Please try different filters.');
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      toast.error('Failed to fetch problems. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [companyInput, roleInput, handleProblemSelect, startTest]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Test Results Component
  const TestResultsSection = () => (
    <div className="space-y-6">
      {/* Score Summary */}
      <Card className="card-glow p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Coding Test Completed!</h2>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{testScore}%</div>
          <p className="text-green-700 dark:text-green-300">
            You completed {problemsCompleted} out of {filteredProblems.length} problems
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-green-600 dark:text-green-400">
            <span>⏱️ Time taken: {formatTime(3600 - timeLeft)}</span>
            <span>📊 Success rate: {testScore}%</span>
            <span>✅ Completed: {problemsCompleted}</span>
            <span>📝 Total: {filteredProblems.length}</span>
          </div>
        </div>
      </Card>

      {/* Problem Breakdown */}
      <Card className="card-elevated p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          Problem Breakdown
        </h3>
        <div className="space-y-3">
          {filteredProblems.map((problem, index) => {
            const isCompleted = completedProblems.has(problem.id);
            return (
              <div key={problem.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{problem.title}</p>
                    <p className="text-sm text-muted-foreground">{problem.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                  <Badge variant={isCompleted ? "default" : "secondary"}>
                    {isCompleted ? "Completed" : "Not Attempted"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Performance Analysis */}
      <Card className="card-elevated p-6">
        <h3 className="text-xl font-semibold mb-4">Performance Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Easy', 'Medium', 'Hard'].map(difficulty => {
            const problemsOfDifficulty = filteredProblems.filter(p => p.difficulty === difficulty);
            const completedOfDifficulty = problemsOfDifficulty.filter(p => completedProblems.has(p.id)).length;
            const totalOfDifficulty = problemsOfDifficulty.length;
            const percentageOfDifficulty = totalOfDifficulty > 0 ? Math.round((completedOfDifficulty / totalOfDifficulty) * 100) : 0;

            return (
              <div key={difficulty} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{difficulty}</span>
                  <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                    {completedOfDifficulty}/{totalOfDifficulty}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      difficulty === 'Easy' ? 'bg-green-500' : 
                      difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentageOfDifficulty}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{percentageOfDifficulty}% completed</p>
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
            setTestStartedMode(false);
            setSubmitted(false);
            setCompletedProblems(new Set());
            setTestScore(0);
            setProblemsCompleted(0);
            setTimeLeft(3600);
          }}
          className="btn-hero"
        >
          🔄 Retake Test
        </Button>
        <Button 
          onClick={() => {
            setShowResult(false);
            setTestStartedMode(false);
            setCompletedProblems(new Set());
            setCompanyInput('');
            setRoleInput('');
          }}
          variant="outline"
          className="btn-premium"
        >
          📝 New Test
        </Button>
        <Button 
          onClick={() => {
            setShowResult(false);
            setTestStartedMode(false);
            setCompletedProblems(new Set());
            startLearning();
          }}
          variant="outline"
          className="btn-premium"
        >
          📖 Learning Mode
        </Button>
      </div>
    </div>
  );

  if (showResult) {
    return (
      <div className="container mx-auto p-4 pt-6">
        <TestResultsSection />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Enhanced Coding</h1>
        <div className="flex items-center space-x-4">
          {testStartedMode && (
            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold tabular-nums">{formatTime(timeLeft)}</span>
            </div>
          )}
          <div className="flex space-x-2">
            {testStartedMode ? (
              <Button onClick={finishTest} variant="destructive">Finish Test</Button>
            ) : (
              <>
                <Button onClick={startLearning}>Learning Mode</Button>
                <Button onClick={startTest}>Test Mode</Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${testStartedMode ? 'lg:grid-cols-1' : 'lg:grid-cols-[400px_1fr]'} gap-6`}>
        {!testStartedMode && (
          <div className="flex flex-col space-y-6">
            <Card className="card-elevated p-4">
              <h3 className="text-lg font-semibold mb-4">🔍 Filter & Prepare</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company" className="text-sm font-medium text-muted-foreground">Company Name *</label>
                  <Input 
                    id="company" 
                    placeholder="e.g., Google, Amazon, Microsoft" 
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    className="input-premium mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="text-sm font-medium text-muted-foreground">Role *</label>
                  <Input 
                    id="role" 
                    placeholder="e.g., Software Engineer, Data Scientist"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="input-premium mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="text-sm font-medium text-muted-foreground">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category" className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Categories">All Categories</SelectItem>
                      {[...new Set(problems.map(p => p.category))].map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="difficulty" className="text-sm font-medium text-muted-foreground">Difficulty</label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger id="difficulty" className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Levels">All Levels</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleFilterChange(false)} className="w-full">Apply Filters</Button>
                  <Button onClick={handleSearch} className="w-full button-primary">Search</Button>
                </div>
              </div>
            </Card>

            <Card className="card-elevated p-4 flex-grow">
              <h3 className="text-lg font-semibold mb-4">Problem List</h3>
              <div className="space-y-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 450px)'}}>
                {loading ? (
                  <p>Loading...</p>
                ) : filteredProblems.length > 0 ? (
                  filteredProblems.map((problem) => (
                    <div 
                      key={problem.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedProblem?.id === problem.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      onClick={() => handleProblemSelect(problem.id)}
                    >
                      <p className="font-semibold">{problem.title}</p>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                        <span>{problem.category}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No problems found. Try adjusting your search or filters.</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Main Coding Area */}
        <div className={`space-y-4 flex flex-col ${testStartedMode ? 'lg:col-span-full' : ''}`}>
          {selectedProblem ? (
            <>
              {/* Problem Description */}
              <Card className="card-elevated p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h2 className="text-2xl font-bold tracking-tight mb-2 md:mb-0">{selectedProblem.title}</h2>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={selectedProblem.difficulty === 'Hard' ? 'destructive' : 'secondary'}
                      className={{
                        'Easy': 'text-green-700 bg-green-100 border-transparent hover:bg-green-200',
                        'Medium': 'text-yellow-700 bg-yellow-100 border-transparent hover:bg-yellow-200',
                      }[selectedProblem.difficulty]}
                    >
                      {selectedProblem.difficulty}
                    </Badge>
                    <Badge variant="secondary">{selectedProblem.category}</Badge>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-muted-foreground mb-6" dangerouslySetInnerHTML={{ __html: selectedProblem.description }} />

                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">📖 Description</TabsTrigger>
                    <TabsTrigger value="examples">💡 Examples</TabsTrigger>
                    <TabsTrigger value="constraints">⚖️ Constraints</TabsTrigger>
                    <TabsTrigger value="solution">🔧 Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-4">
                    <p className="text-muted-foreground">{selectedProblem.description}</p>
                  </TabsContent>

                  <TabsContent value="examples" className="mt-4">
                    <div className="space-y-4">
                      {selectedProblem.examples?.map((example: { input: string; output: string; explanation: string; }, index: number) => (
                        <div key={index} className="bg-muted/30 p-4 rounded-lg">
                          <p><strong>Input:</strong> {example.input}</p>
                          <p><strong>Output:</strong> {example.output}</p>
                          {example.explanation && (
                            <p><strong>Explanation:</strong> {example.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="constraints" className="mt-4">
                    <ul className="space-y-2">
                      {selectedProblem.constraints?.map((constraint: string, index: number) => (
                        <li key={index} className="text-muted-foreground">• {constraint}</li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="solution" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-40 input-premium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2 flex-wrap">
                          {learningMode ? (
                            <>
                              <Button onClick={handleSubmitAndAnalyze} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Terminal className="mr-2 h-4 w-4" /> Run & Analyze
                              </Button>
                              <Button onClick={generateHint} disabled={loading} variant="outline">
                                <Lightbulb className="mr-2 h-4 w-4" /> Get Hint
                              </Button>
                            </>
                          ) : (
                            <Button onClick={handleSubmit} disabled={loading}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Submit
                            </Button>
                          )}
                          <Button onClick={runCode} disabled={loading} variant="outline">
                            <Play className="mr-2 h-4 w-4" /> Run Tests
                          </Button>
                          <Button onClick={analyzeCode} disabled={loading} variant="outline">
                            <Terminal className="mr-2 h-4 w-4" /> Analyze Code
                          </Button>
                        </div>
                      </div>

                      <Textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="font-mono text-sm min-h-64 input-premium"
                        placeholder="Write your solution here..."
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Test Results */}
              {testResults && (
                <Card className="card-elevated p-6">
                  <h3 className="text-lg font-semibold mb-4">🧪 Test Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        {testResults.testCasesPassed}/{testResults.totalTestCases}
                      </div>
                      <div className="text-sm text-muted-foreground">Test Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{testResults.executionTime}</div>
                      <div className="text-sm text-muted-foreground">Runtime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">{testResults.memoryUsage}</div>
                      <div className="text-sm text-muted-foreground">Memory</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${testResults.status === 'success' ? 'text-success' : 'text-destructive'}`}>
                        {testResults.status === 'success' ? '✅' : '❌'}
                      </div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {testResults.results?.map((result: { input: any; expected: any; actual: any; passed: boolean; }, index: number) => (
                      <div key={index} className={`p-3 rounded-lg ${result.passed ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Test Case {index + 1}</span>
                          <span className={result.passed ? 'text-success' : 'text-destructive'}>
                            {result.passed ? '✅ Passed' : '❌ Failed'}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Input: {result.input} | Expected: {result.expected} | Got: {result.actual}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Hint Display */}
              {hint && (
                <Card className="card-elevated p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    💡 AI Hint
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">{hint}</p>
                  </div>
                </Card>
              )}

              {/* AI Analysis */}
              {aiAnalysis && (
                <Card className="card-elevated p-6">
                  <h3 className="text-lg font-semibold mb-4">🤖 AI Code Analysis</h3>
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
                      <h4 className="font-semibold mb-2">📊 Analysis</h4>
                      <p className="text-sm">{aiAnalysis.feedback}</p>
                    </div>
                    {aiAnalysis.suggestions && (
                      <div className="bg-warning/10 p-4 rounded-lg border border-warning/30">
                        <h4 className="font-semibold mb-2">💡 Suggestions</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                            <li key={index}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <div className="text-lg text-muted-foreground">Select a problem to start coding</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCoding;