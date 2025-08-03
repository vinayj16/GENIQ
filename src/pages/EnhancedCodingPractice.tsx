import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Play, Mic, PenTool, MessageSquare, Clock, CheckCircle, AlertCircle, Lightbulb, Code } from 'lucide-react';
import VoiceCodingInterface from '@/components/VoiceCodingInterface';
import WhiteboardSimulator from '@/components/WhiteboardSimulator';
import PeerReviewSystem from '@/components/PeerReviewSystem';
import { getCompanyById } from '@/lib/companies';
import { apiService } from '@/lib/api';

interface TestCase {
  input: any;
  expected: any;
  passed?: boolean;
}

interface ProblemData {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
  testCases: TestCase[];
  codeTemplate: {
    javascript: string;
    python: string;
    java: string;
    cpp?: string;
  };
  hints: string[];
  solution: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    explanation: string;
  };
}

const EnhancedCodingPractice: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('company');
  
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [company, setCompany] = useState(companyId ? getCompanyById(companyId) : null);
  const [activeTab, setActiveTab] = useState<'code' | 'voice' | 'whiteboard' | 'reviews'>('code');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (problemId) {
      loadProblem(parseInt(problemId));
    }
  }, [problemId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadProblem = async (id: number) => {
    try {
      // Mock problem data - replace with actual API call
      const mockProblem: ProblemData = {
        id: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          },
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]',
            explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
          }
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
        ],
        codeTemplate: {
          javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
          python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
          java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`
        },
        hints: [
          "Think about what you need to find for each number to make the target sum.",
          "Can you use a hash table to store numbers you've seen before?",
          "For each number, calculate what its complement should be to reach the target.",
          "The key insight is to store each number with its index as you iterate through the array."
        ],
        solution: {
          approach: "Hash Table (One Pass)",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          explanation: "We iterate through the array once, and for each element, we calculate its complement (target - current element). We check if this complement exists in our hash table. If it does, we found our answer. If not, we add the current element and its index to the hash table."
        }
      };

      setProblem(mockProblem);
      setCode(mockProblem.codeTemplate[language as keyof typeof mockProblem.codeTemplate] || '');
      setIsTimerRunning(true);
    } catch (error) {
      console.error('Failed to load problem:', error);
    }
  };

  const runTests = async () => {
    if (!problem) return;
    
    setIsRunning(true);
    
    try {
      // Mock test execution - replace with actual code execution
      const results = problem.testCases.map(testCase => ({
        ...testCase,
        passed: Math.random() > 0.3 // Mock random pass/fail
      }));
      
      setTestResults(results);
      
      // If using company-specific features
      if (companyId) {
        await apiService.submitCompanySolution('mock-session', code, language);
      }
    } catch (error) {
      console.error('Failed to run tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getNextHint = () => {
    if (problem && currentHint < problem.hints.length - 1) {
      setCurrentHint(prev => prev + 1);
    }
  };

  const tabs = [
    { id: 'code', label: 'Code Editor', icon: Code },
    { id: 'voice', label: 'Voice Coding', icon: Mic },
    { id: 'whiteboard', label: 'Whiteboard', icon: PenTool },
    { id: 'reviews', label: 'Peer Reviews', icon: MessageSquare }
  ];

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {company && (
                  <div className={`w-8 h-8 ${company.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                    {company.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{problem.title}</h1>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                    {company && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {company.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(sessionTime)}</span>
              </div>
              
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Hints ({currentHint + 1}/{problem.hints.length})</span>
              </button>
              
              <button
                onClick={runTests}
                disabled={isRunning}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Tests</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Problem Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{problem.description}</p>
              </div>
            </div>

            {/* Examples */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="font-medium text-gray-900 mb-2">Example {index + 1}:</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Input:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{example.input}</code></div>
                      <div><strong>Output:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{example.output}</code></div>
                      <div><strong>Explanation:</strong> {example.explanation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Constraints</h3>
              <ul className="space-y-2">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{constraint}</code>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hints */}
            {showHints && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-yellow-900">Hint {currentHint + 1}</h3>
                  <button
                    onClick={getNextHint}
                    disabled={currentHint >= problem.hints.length - 1}
                    className="text-sm text-yellow-700 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Hint →
                  </button>
                </div>
                <p className="text-yellow-800">{problem.hints[currentHint]}</p>
              </div>
            )}
          </div>

          {/* Right Panel - Coding Interface */}
          <div className="space-y-6">
            {activeTab === 'code' && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                        setCode(problem.codeTemplate[e.target.value as keyof typeof problem.codeTemplate] || '');
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      {problem.codeTemplate.cpp && <option value="cpp">C++</option>}
                    </select>
                  </div>
                </div>
                
                <div className="p-4">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 font-mono text-sm border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Write your solution here..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <VoiceCodingInterface
                onCodeChange={setCode}
                language={language}
                initialCode={code}
              />
            )}

            {activeTab === 'whiteboard' && (
              <WhiteboardSimulator
                problemType="algorithm"
                collaborative={!!company?.features?.peerReview}
              />
            )}

            {activeTab === 'reviews' && (
              <PeerReviewSystem
                solutionId={`${problemId}-${Date.now()}`}
                showSubmissionForm={true}
              />
            )}

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm font-medium">Test Case {index + 1}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Input: {JSON.stringify(result.input)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span>Passed: {testResults.filter(r => r.passed).length}/{testResults.length}</span>
                    <span>Time: {formatTime(sessionTime)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCodingPractice;