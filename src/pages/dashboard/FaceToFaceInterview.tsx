import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Video, VideoOff, Mic, MicOff, Camera, Settings, Play, Pause, RotateCcw, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

interface Question {
  id: number;
  question: string;
  type: 'technical' | 'behavioral' | 'situational';
  tips: string;
  expectedDuration: number;
  answered?: boolean;
  rating?: number;
  notes?: string;
}

interface InterviewResult {
  id: number;
  date: string;
  company: string;
  role: string;
  duration: number;
  questionsAnswered: number;
  totalQuestions: number;
  overallRating: number;
  feedback: string;
  questions: Question[];
}

const FaceToFaceInterview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [interviewSettings, setInterviewSettings] = useState({
    company: '',
    role: '',
    experience: 'mid',
    duration: 30
  });
  const [loading, setLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [interviewNotes, setInterviewNotes] = useState('');
  const [currentQuestionRating, setCurrentQuestionRating] = useState(0);
  const [interviewResult, setInterviewResult] = useState<InterviewResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (interviewStarted) {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [interviewStarted]);

  const generateMockQuestions = (company: string, role: string, experience: string): Question[] => {
    const questionBank = {
      technical: [
        {
          question: "Explain the difference between var, let, and const in JavaScript.",
          tips: "Focus on scope, hoisting, and mutability differences.",
          expectedDuration: 3
        },
        {
          question: "How would you optimize a slow database query?",
          tips: "Discuss indexing, query optimization, and database design.",
          expectedDuration: 4
        },
        {
          question: "Explain the concept of microservices architecture.",
          tips: "Cover benefits, challenges, and when to use microservices.",
          expectedDuration: 5
        },
        {
          question: "What is the time complexity of common sorting algorithms?",
          tips: "Compare bubble sort, merge sort, and quick sort.",
          expectedDuration: 3
        }
      ],
      behavioral: [
        {
          question: "Tell me about a time when you had to work with a difficult team member.",
          tips: "Use the STAR method: Situation, Task, Action, Result.",
          expectedDuration: 4
        },
        {
          question: "Describe a challenging project you worked on and how you overcame obstacles.",
          tips: "Focus on problem-solving skills and persistence.",
          expectedDuration: 5
        },
        {
          question: "How do you handle tight deadlines and pressure?",
          tips: "Provide specific examples and strategies you use.",
          expectedDuration: 3
        },
        {
          question: "Tell me about a time you had to learn a new technology quickly.",
          tips: "Highlight your learning process and adaptability.",
          expectedDuration: 4
        }
      ],
      situational: [
        {
          question: "How would you handle a situation where you disagree with your manager's technical decision?",
          tips: "Show respect while presenting your viewpoint professionally.",
          expectedDuration: 3
        },
        {
          question: "What would you do if you discovered a critical bug in production?",
          tips: "Discuss immediate response, communication, and prevention.",
          expectedDuration: 4
        },
        {
          question: "How would you approach mentoring a junior developer?",
          tips: "Focus on patience, teaching methods, and knowledge sharing.",
          expectedDuration: 4
        }
      ]
    };

    const selectedQuestions: Question[] = [];
    const questionTypes = ['technical', 'behavioral', 'situational'] as const;
    
    // Select questions based on experience level and duration
    const questionsPerType = Math.ceil(interviewSettings.duration / 15); // Roughly 15 min per type
    
    questionTypes.forEach((type, typeIndex) => {
      const typeQuestions = questionBank[type];
      for (let i = 0; i < Math.min(questionsPerType, typeQuestions.length); i++) {
        const question = typeQuestions[i];
        selectedQuestions.push({
          id: typeIndex * 10 + i,
          question: `${question.question}`,
          type,
          tips: question.tips,
          expectedDuration: question.expectedDuration,
          answered: false,
          rating: 0,
          notes: ''
        });
      }
    });

    return selectedQuestions.slice(0, Math.min(8, selectedQuestions.length)); // Max 8 questions
  };

  const startInterview = async () => {
    if (!interviewSettings.company || !interviewSettings.role) {
      toast.error('Please fill in company and role details');
      return;
    }

    try {
      setLoading(true);
      
      // Generate mock questions
      const generatedQuestions = generateMockQuestions(
        interviewSettings.company,
        interviewSettings.role,
        interviewSettings.experience
      );
      
      setQuestions(generatedQuestions);
      setInterviewStarted(true);
      setCurrentQuestion(0);
      setQuestionStartTime(Date.now());
      setTimeElapsed(0);
      toast.success('Interview started! Good luck!');
    } catch (error) {
      toast.error('Failed to generate interview questions');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    // Mark current question as answered and save rating
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      answered: true,
      rating: currentQuestionRating,
      notes: interviewNotes
    };
    setQuestions(updatedQuestions);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
      setCurrentQuestionRating(0);
      setInterviewNotes('');
    } else {
      completeInterview(updatedQuestions);
    }
  };

  const completeInterview = (finalQuestions: Question[]) => {
    const questionsAnswered = finalQuestions.filter(q => q.answered).length;
    const averageRating = finalQuestions.reduce((sum, q) => sum + (q.rating || 0), 0) / finalQuestions.length;
    
    const result: InterviewResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      company: interviewSettings.company,
      role: interviewSettings.role,
      duration: timeElapsed,
      questionsAnswered,
      totalQuestions: finalQuestions.length,
      overallRating: Math.round(averageRating * 20), // Convert to percentage
      feedback: generateFeedback(averageRating, questionsAnswered, finalQuestions.length),
      questions: finalQuestions
    };

    setInterviewResult(result);
    setInterviewStarted(false);
    setInterviewCompleted(true);

    // Save to localStorage
    const previousResults = JSON.parse(localStorage.getItem('interviewResults') || '[]');
    localStorage.setItem('interviewResults', JSON.stringify([...previousResults, result]));

    toast.success('Interview completed! Check your results.');
  };

  const generateFeedback = (averageRating: number, answered: number, total: number): string => {
    const completionRate = (answered / total) * 100;
    const ratingPercentage = averageRating * 20;

    if (ratingPercentage >= 80 && completionRate >= 90) {
      return "Excellent performance! You demonstrated strong technical knowledge and communication skills. Keep up the great work!";
    } else if (ratingPercentage >= 60 && completionRate >= 70) {
      return "Good performance overall. Focus on providing more detailed examples and improving your explanation clarity.";
    } else if (ratingPercentage >= 40 && completionRate >= 50) {
      return "Decent effort, but there's room for improvement. Practice more behavioral questions and work on your technical explanations.";
    } else {
      return "This interview highlighted areas for improvement. Consider practicing more mock interviews and reviewing fundamental concepts.";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewCompleted(false);
    setCurrentQuestion(0);
    setTimeElapsed(0);
    setQuestions([]);
    setInterviewResult(null);
    setCurrentQuestionRating(0);
    setInterviewNotes('');
    setInterviewSettings({
      company: '',
      role: '',
      experience: 'mid',
      duration: 30
    });
  };

  // Results Component
  const InterviewResults = () => {
    if (!interviewResult) return null;

    return (
      <div className="space-y-6">
        {/* Score Summary */}
        <Card className="card-glow p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">Interview Completed!</h2>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{interviewResult.overallRating}%</div>
            <p className="text-blue-700 dark:text-blue-300">
              {interviewResult.company} - {interviewResult.role}
            </p>
            <div className="flex justify-center gap-4 mt-4 text-sm text-blue-600 dark:text-blue-400">
              <span>⏱️ Duration: {formatTime(interviewResult.duration)}</span>
              <span>📊 Questions: {interviewResult.questionsAnswered}/{interviewResult.totalQuestions}</span>
              <span>⭐ Rating: {interviewResult.overallRating}%</span>
            </div>
          </div>
        </Card>

        {/* Feedback */}
        <Card className="card-elevated p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Interview Feedback
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200">{interviewResult.feedback}</p>
          </div>
        </Card>

        {/* Question Breakdown */}
        <Card className="card-elevated p-6">
          <h3 className="text-xl font-semibold mb-4">Question Performance</h3>
          <div className="space-y-4">
            {interviewResult.questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={
                        question.type === 'technical' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        question.type === 'behavioral' ? 'bg-green-100 text-green-800 border-green-300' :
                        'bg-purple-100 text-purple-800 border-purple-300'
                      }>
                        {question.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                    </div>
                    <p className="font-medium text-sm">{question.question}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (question.rating || 0) 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {question.notes && (
                  <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                    <strong>Notes:</strong> {question.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Analysis */}
        <Card className="card-elevated p-6">
          <h3 className="text-xl font-semibold mb-4">Performance Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['technical', 'behavioral', 'situational'].map(type => {
              const typeQuestions = interviewResult.questions.filter(q => q.type === type);
              const avgRating = typeQuestions.length > 0 
                ? typeQuestions.reduce((sum, q) => sum + (q.rating || 0), 0) / typeQuestions.length 
                : 0;
              const percentage = Math.round(avgRating * 20);

              return (
                <div key={type} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{type}</span>
                    <Badge variant="outline">
                      {typeQuestions.length} questions
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        type === 'technical' ? 'bg-blue-500' : 
                        type === 'behavioral' ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{percentage}% performance</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={resetInterview} className="btn-hero">
            🔄 New Interview
          </Button>
          <Button 
            onClick={() => {
              setInterviewCompleted(false);
              setInterviewResult(null);
            }}
            variant="outline"
            className="btn-premium"
          >
            📊 View History
          </Button>
          <Button 
            onClick={() => {
              const csvData = [
                ['Question', 'Type', 'Rating', 'Notes'],
                ...interviewResult.questions.map(q => [
                  q.question,
                  q.type,
                  q.rating?.toString() || '0',
                  q.notes || ''
                ])
              ];
              const csvContent = csvData.map(row => row.join(',')).join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `interview-results-${interviewResult.company}-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              toast.success('Results exported successfully!');
            }}
            variant="outline"
            className="btn-premium"
          >
            📥 Export Results
          </Button>
        </div>
      </div>
    );
  };

  if (interviewCompleted && interviewResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Interview Results 📊</h1>
            <p className="text-muted-foreground">Your mock interview performance analysis</p>
          </div>
        </div>
        <InterviewResults />
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Face-to-Face Interview 🎥</h1>
            <p className="text-muted-foreground">Practice with AI-powered mock interviews</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="btn-premium">
              📊 View History
            </Button>
            <Button className="btn-hero">
              🎯 Quick Interview
            </Button>
          </div>
        </div>

        {!interviewStarted ? (
          /* Interview Setup */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Setup Form */}
            <div className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Interview Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input
                      placeholder="e.g., Google, Microsoft, Amazon"
                      value={interviewSettings.company}
                      onChange={(e) => setInterviewSettings({...interviewSettings, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <Input
                      placeholder="e.g., Software Engineer, Product Manager"
                      value={interviewSettings.role}
                      onChange={(e) => setInterviewSettings({...interviewSettings, role: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <Select value={interviewSettings.experience} onValueChange={(value) => setInterviewSettings({...interviewSettings, experience: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                        <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                    <Select value={interviewSettings.duration.toString()} onValueChange={(value) => setInterviewSettings({...interviewSettings, duration: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="btn-hero w-full"
                    onClick={startInterview}
                    disabled={loading}
                  >
                    {loading ? 'Generating Questions...' : '🚀 Start Interview'}
                  </Button>
                </CardContent>
              </Card>

              {/* Camera Test */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Camera & Audio Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setVideoEnabled(!videoEnabled)}
                      className={videoEnabled ? "btn-premium" : "bg-destructive/20 text-destructive"}
                    >
                      {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className={audioEnabled ? "btn-premium" : "bg-destructive/20 text-destructive"}
                    >
                      {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" className="btn-premium">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interview Tips */}
            <div className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Interview Tips 💡</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                      <div>
                        <p className="text-sm font-medium">Maintain Eye Contact</p>
                        <p className="text-xs text-muted-foreground">Look directly at the camera, not the screen</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">2</div>
                      <div>
                        <p className="text-sm font-medium">Use the STAR Method</p>
                        <p className="text-xs text-muted-foreground">Situation, Task, Action, Result for behavioral questions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">3</div>
                      <div>
                        <p className="text-sm font-medium">Think Out Loud</p>
                        <p className="text-xs text-muted-foreground">Explain your thought process for technical questions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">4</div>
                      <div>
                        <p className="text-sm font-medium">Ask Clarifying Questions</p>
                        <p className="text-xs text-muted-foreground">Don't hesitate to ask for clarification</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Previous Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Google - SWE</span>
                        <Badge variant="outline" className="bg-success/20 text-success border-success/30">85%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Completed 2 days ago</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Amazon - SDE</span>
                        <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">78%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Completed 1 week ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Interview In Progress */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Area */}
            <div className="lg:col-span-2">
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Live Interview</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {interviewSettings.company} - {interviewSettings.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        Time: {formatTime(timeElapsed)}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setVideoEnabled(!videoEnabled)}
                          className={videoEnabled ? "btn-premium" : "bg-destructive/20 text-destructive"}
                        >
                          {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setAudioEnabled(!audioEnabled)}
                          className={audioEnabled ? "btn-premium" : "bg-destructive/20 text-destructive"}
                        >
                          {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg aspect-video flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Your video feed</p>
                      <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mt-2 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Question {currentQuestion + 1} of {questions.length}</span>
                      <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
                    </div>
                    <Progress value={((currentQuestion + 1) / questions.length) * 100} />
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="btn-premium"
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      {isRecording ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isRecording ? 'Pause Recording' : 'Start Recording'}
                    </Button>
                    <Button variant="outline" className="btn-premium">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart Question
                    </Button>
                    <Button className="btn-hero" onClick={nextQuestion}>
                      Next Question →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question Panel */}
            <div className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Current Question</CardTitle>
                </CardHeader>
                <CardContent>
                  {questions[currentQuestion] && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={
                          questions[currentQuestion].type === 'technical' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' :
                          questions[currentQuestion].type === 'behavioral' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                          'bg-purple-500/20 text-purple-500 border-purple-500/30'
                        }>
                          {questions[currentQuestion].type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ~{questions[currentQuestion].expectedDuration} min
                        </span>
                      </div>
                      <h3 className="text-lg font-medium">
                        {questions[currentQuestion].question}
                      </h3>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          💡 <strong>Tip:</strong> {questions[currentQuestion].tips}
                        </p>
                      </div>
                      
                      {/* Self-Rating */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Rate your answer:</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setCurrentQuestionRating(star)}
                              className="p-1"
                            >
                              <Star 
                                className={`w-6 h-6 ${
                                  star <= currentQuestionRating 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300 hover:text-yellow-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Interview Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Take notes during the interview..."
                    rows={6}
                    className="resize-none"
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
  );
};

export default FaceToFaceInterview;