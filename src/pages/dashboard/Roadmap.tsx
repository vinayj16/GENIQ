import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Clock, BookOpen, Target, TrendingUp, Calendar, Star, Award, Users, Download, Share2, Filter, Search, Plus, Edit, Trash2, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/lib/api';
import { Label } from "@/components/ui/label";

const Roadmap = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [activeRoadmaps, setActiveRoadmaps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [studyTime, setStudyTime] = useState<{ [key: string]: number }>({});
  const [studyGoals, setStudyGoals] = useState<{ [key: string]: { daily: number, weekly: number } }>({});
  const [achievements, setAchievements] = useState<string[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [customRoadmap, setCustomRoadmap] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    duration: '',
    topics: [] as string[]
  });
  const [newTopic, setNewTopic] = useState('');

  const [roadmaps, setRoadmaps] = useState([
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      description: 'Master the fundamentals of computer science',
      difficulty: 'Intermediate',
      duration: '3-6 months',
      progress: 45,
      icon: '💻',
      color: 'primary',
      category: 'Programming',
      rating: 4.8,
      enrolledUsers: 15420,
      estimatedHours: 120,
      prerequisites: ['Basic Programming'],
      skills: ['Problem Solving', 'Algorithms', 'Data Structures'],
      topics: [
        { name: 'Arrays & Strings', completed: true, resources: 5, estimatedHours: 8, difficulty: 'Easy' },
        { name: 'Linked Lists', completed: true, resources: 4, estimatedHours: 6, difficulty: 'Easy' },
        { name: 'Stacks & Queues', completed: true, resources: 3, estimatedHours: 5, difficulty: 'Easy' },
        { name: 'Trees & BST', completed: false, resources: 6, estimatedHours: 12, difficulty: 'Medium' },
        { name: 'Graphs', completed: false, resources: 8, estimatedHours: 15, difficulty: 'Medium' },
        { name: 'Dynamic Programming', completed: false, resources: 10, estimatedHours: 20, difficulty: 'Hard' },
        { name: 'Greedy Algorithms', completed: false, resources: 5, estimatedHours: 8, difficulty: 'Medium' },
        { name: 'Backtracking', completed: false, resources: 4, estimatedHours: 10, difficulty: 'Hard' }
      ]
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Learn to design scalable distributed systems',
      difficulty: 'Advanced',
      duration: '4-8 months',
      progress: 20,
      icon: '🏗️',
      color: 'warning',
      category: 'Architecture',
      rating: 4.6,
      enrolledUsers: 8930,
      estimatedHours: 180,
      prerequisites: ['Backend Development', 'Database Knowledge'],
      skills: ['System Architecture', 'Scalability', 'Distributed Systems'],
      topics: [
        { name: 'Scalability Basics', completed: true, resources: 4, estimatedHours: 8, difficulty: 'Medium' },
        { name: 'Load Balancing', completed: false, resources: 3, estimatedHours: 6, difficulty: 'Medium' },
        { name: 'Databases', completed: false, resources: 6, estimatedHours: 15, difficulty: 'Medium' },
        { name: 'Caching', completed: false, resources: 4, estimatedHours: 8, difficulty: 'Medium' },
        { name: 'Microservices', completed: false, resources: 5, estimatedHours: 12, difficulty: 'Hard' },
        { name: 'Message Queues', completed: false, resources: 4, estimatedHours: 10, difficulty: 'Medium' },
        { name: 'CDN & Storage', completed: false, resources: 3, estimatedHours: 8, difficulty: 'Medium' },
        { name: 'Real-time Systems', completed: false, resources: 5, estimatedHours: 15, difficulty: 'Hard' }
      ]
    },
    {
      id: 'frontend',
      title: 'Frontend Development',
      description: 'Modern web development with React & TypeScript',
      difficulty: 'Beginner',
      duration: '2-4 months',
      progress: 70,
      icon: '🎨',
      color: 'success',
      category: 'Web Development',
      rating: 4.7,
      enrolledUsers: 22150,
      estimatedHours: 90,
      prerequisites: ['Basic HTML/CSS'],
      skills: ['React', 'TypeScript', 'Frontend Architecture'],
      topics: [
        { name: 'HTML & CSS', completed: true, resources: 3, estimatedHours: 10, difficulty: 'Easy' },
        { name: 'JavaScript ES6+', completed: true, resources: 5, estimatedHours: 15, difficulty: 'Easy' },
        { name: 'React Fundamentals', completed: true, resources: 6, estimatedHours: 20, difficulty: 'Medium' },
        { name: 'TypeScript', completed: true, resources: 4, estimatedHours: 12, difficulty: 'Medium' },
        { name: 'State Management', completed: false, resources: 4, estimatedHours: 10, difficulty: 'Medium' },
        { name: 'Testing', completed: false, resources: 3, estimatedHours: 8, difficulty: 'Medium' },
        { name: 'Performance', completed: false, resources: 4, estimatedHours: 10, difficulty: 'Hard' },
        { name: 'Deployment', completed: false, resources: 2, estimatedHours: 5, difficulty: 'Easy' }
      ]
    },
    {
      id: 'backend',
      title: 'Backend Development',
      description: 'Server-side development with Node.js',
      difficulty: 'Intermediate',
      duration: '3-5 months',
      progress: 30,
      icon: '⚙️',
      color: 'destructive',
      category: 'Web Development',
      rating: 4.5,
      enrolledUsers: 18760,
      estimatedHours: 110,
      prerequisites: ['JavaScript Fundamentals'],
      skills: ['Node.js', 'API Development', 'Database Management'],
      topics: [
        { name: 'Node.js Basics', completed: true, resources: 4, estimatedHours: 12, difficulty: 'Easy' },
        { name: 'Express.js', completed: true, resources: 5, estimatedHours: 15, difficulty: 'Medium' },
        { name: 'Database Design', completed: false, resources: 6, estimatedHours: 18, difficulty: 'Medium' },
        { name: 'Authentication', completed: false, resources: 4, estimatedHours: 10, difficulty: 'Medium' },
        { name: 'API Design', completed: false, resources: 5, estimatedHours: 12, difficulty: 'Medium' },
        { name: 'Security', completed: false, resources: 4, estimatedHours: 10, difficulty: 'Hard' },
        { name: 'Testing', completed: false, resources: 3, estimatedHours: 8, difficulty: 'Medium' },
        { name: 'DevOps Basics', completed: false, resources: 5, estimatedHours: 15, difficulty: 'Hard' }
      ]
    },
    {
      id: 'mobile-dev',
      title: 'Mobile Development',
      description: 'Build native and cross-platform mobile applications',
      difficulty: 'Intermediate',
      duration: '4-6 months',
      progress: 0,
      icon: '📱',
      color: 'primary',
      category: 'Mobile Development',
      rating: 4.4,
      enrolledUsers: 12340,
      estimatedHours: 140,
      prerequisites: ['Programming Fundamentals'],
      skills: ['React Native', 'Flutter', 'Mobile UI/UX'],
      topics: [
        { name: 'Mobile Fundamentals', completed: false, resources: 4, estimatedHours: 10, difficulty: 'Easy' },
        { name: 'React Native', completed: false, resources: 8, estimatedHours: 25, difficulty: 'Medium' },
        { name: 'Flutter & Dart', completed: false, resources: 7, estimatedHours: 20, difficulty: 'Medium' },
        { name: 'Native iOS (Swift)', completed: false, resources: 6, estimatedHours: 30, difficulty: 'Hard' },
        { name: 'Native Android (Kotlin)', completed: false, resources: 6, estimatedHours: 30, difficulty: 'Hard' },
        { name: 'Mobile UI/UX', completed: false, resources: 5, estimatedHours: 15, difficulty: 'Medium' },
        { name: 'App Store Deployment', completed: false, resources: 3, estimatedHours: 5, difficulty: 'Easy' },
        { name: 'Performance Optimization', completed: false, resources: 4, estimatedHours: 10, difficulty: 'Hard' }
      ]
    },
    {
      id: 'devops',
      title: 'DevOps & Cloud',
      description: 'Master deployment, monitoring, and cloud infrastructure',
      difficulty: 'Advanced',
      duration: '5-8 months',
      progress: 0,
      icon: '☁️',
      color: 'warning',
      category: 'Infrastructure',
      rating: 4.3,
      enrolledUsers: 9870,
      estimatedHours: 160,
      prerequisites: ['Backend Development', 'Linux Basics'],
      skills: ['Docker', 'Kubernetes', 'AWS/Azure', 'CI/CD'],
      topics: [
        { name: 'Linux & Command Line', completed: false, resources: 5, estimatedHours: 15, difficulty: 'Medium' },
        { name: 'Docker & Containerization', completed: false, resources: 6, estimatedHours: 20, difficulty: 'Medium' },
        { name: 'Kubernetes', completed: false, resources: 8, estimatedHours: 25, difficulty: 'Hard' },
        { name: 'AWS/Azure Basics', completed: false, resources: 10, estimatedHours: 30, difficulty: 'Medium' },
        { name: 'CI/CD Pipelines', completed: false, resources: 7, estimatedHours: 20, difficulty: 'Medium' },
        { name: 'Monitoring & Logging', completed: false, resources: 5, estimatedHours: 15, difficulty: 'Medium' },
        { name: 'Infrastructure as Code', completed: false, resources: 6, estimatedHours: 18, difficulty: 'Hard' },
        { name: 'Security & Compliance', completed: false, resources: 4, estimatedHours: 12, difficulty: 'Hard' }
      ]
    }
  ]);

  // Load data on component mount
  useEffect(() => {
    loadUserProgress();
    loadStudyData();
  }, []);

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from API
      const savedProgress = localStorage.getItem('roadmap-progress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCompletedTopics(new Set(progress.completedTopics || []));
        setActiveRoadmaps(new Set(progress.activeRoadmaps || []));
        setStudyTime(progress.studyTime || {});
        setAchievements(progress.achievements || []);
        setStreakCount(progress.streakCount || 0);
        setTotalStudyTime(progress.totalStudyTime || 0);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudyData = () => {
    // Initialize study goals
    const defaultGoals = {};
    roadmaps.forEach(roadmap => {
      defaultGoals[roadmap.id] = { daily: 60, weekly: 420 }; // 1 hour daily, 7 hours weekly
    });
    setStudyGoals(defaultGoals);
  };

  const saveProgress = () => {
    const progressData = {
      completedTopics: Array.from(completedTopics),
      activeRoadmaps: Array.from(activeRoadmaps),
      studyTime,
      achievements,
      streakCount,
      totalStudyTime,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('roadmap-progress', JSON.stringify(progressData));
  };

  const toggleTopicCompletion = (roadmapId: string, topicIndex: number) => {
    const topicKey = `${roadmapId}-${topicIndex}`;
    const newCompleted = new Set(completedTopics);

    if (newCompleted.has(topicKey)) {
      newCompleted.delete(topicKey);
      toast.success('Topic marked as incomplete');
    } else {
      newCompleted.add(topicKey);
      toast.success('Topic completed! 🎉');

      // Add study time and check for achievements
      const currentTime = studyTime[roadmapId] || 0;
      const newTime = currentTime + 30; // Add 30 minutes for completing a topic
      setStudyTime(prev => ({ ...prev, [roadmapId]: newTime }));
      setTotalStudyTime(prev => prev + 30);

      // Check for achievements
      checkAchievements(roadmapId, newCompleted);
    }

    setCompletedTopics(newCompleted);
    saveProgress();
  };

  const checkAchievements = (roadmapId: string, completedTopics: Set<string>) => {
    const roadmap = roadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return;

    const completedCount = roadmap.topics.filter((_, index) =>
      completedTopics.has(`${roadmapId}-${index}`)
    ).length;

    const newAchievements = [];

    if (completedCount === 1 && !achievements.includes(`first-topic-${roadmapId}`)) {
      newAchievements.push(`first-topic-${roadmapId}`);
      toast.success('🏆 Achievement unlocked: First Steps!');
    }

    if (completedCount === Math.floor(roadmap.topics.length / 2) && !achievements.includes(`halfway-${roadmapId}`)) {
      newAchievements.push(`halfway-${roadmapId}`);
      toast.success('🏆 Achievement unlocked: Halfway There!');
    }

    if (completedCount === roadmap.topics.length && !achievements.includes(`completed-${roadmapId}`)) {
      newAchievements.push(`completed-${roadmapId}`);
      toast.success('🏆 Achievement unlocked: Roadmap Master!');
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const startRoadmap = (roadmapId: string) => {
    const newActive = new Set(activeRoadmaps);
    newActive.add(roadmapId);
    setActiveRoadmaps(newActive);
    toast.success('Roadmap started! Good luck with your learning journey! 🚀');
    saveProgress();
  };

  const pauseRoadmap = (roadmapId: string) => {
    const newActive = new Set(activeRoadmaps);
    newActive.delete(roadmapId);
    setActiveRoadmaps(newActive);
    toast.info('Roadmap paused. You can resume anytime!');
    saveProgress();
  };

  const resetRoadmap = (roadmapId: string) => {
    const newCompleted = new Set(completedTopics);
    const roadmap = roadmaps.find(r => r.id === roadmapId);

    if (roadmap) {
      roadmap.topics.forEach((_, index) => {
        newCompleted.delete(`${roadmapId}-${index}`);
      });
      setCompletedTopics(newCompleted);

      // Reset study time for this roadmap
      setStudyTime(prev => ({ ...prev, [roadmapId]: 0 }));

      toast.success('Roadmap progress reset successfully!');
      saveProgress();
    }
  };

  const getTopicProgress = (roadmapId: string, topics: any[]) => {
    const completedCount = topics.filter((_, index) =>
      completedTopics.has(`${roadmapId}-${index}`)
    ).length;
    return Math.round((completedCount / topics.length) * 100);
  };

  const createCustomRoadmap = () => {
    if (!customRoadmap.title || !customRoadmap.description || customRoadmap.topics.length === 0) {
      toast.error('Please fill in all required fields and add at least one topic');
      return;
    }

    const newRoadmap = {
      id: `custom-${Date.now()}`,
      title: customRoadmap.title,
      description: customRoadmap.description,
      difficulty: customRoadmap.difficulty,
      duration: customRoadmap.duration,
      progress: 0,
      icon: '🎯',
      color: 'primary',
      category: 'Custom',
      rating: 0,
      enrolledUsers: 1,
      estimatedHours: customRoadmap.topics.length * 5,
      prerequisites: [],
      skills: [],
      topics: customRoadmap.topics.map(topic => ({
        name: topic,
        completed: false,
        resources: 3,
        estimatedHours: 5,
        difficulty: 'Medium'
      }))
    };

    setRoadmaps(prev => [...prev, newRoadmap]);
    setCustomRoadmap({ title: '', description: '', difficulty: 'Beginner', duration: '', topics: [] });
    setShowCreateDialog(false);
    toast.success('Custom roadmap created successfully! 🎉');
  };

  const addTopicToCustomRoadmap = () => {
    if (!newTopic.trim()) return;
    setCustomRoadmap(prev => ({
      ...prev,
      topics: [...prev.topics, newTopic.trim()]
    }));
    setNewTopic('');
  };

  const removeTopicFromCustomRoadmap = (index: number) => {
    setCustomRoadmap(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const exportProgress = () => {
    const progressData = {
      completedTopics: Array.from(completedTopics),
      activeRoadmaps: Array.from(activeRoadmaps),
      studyTime,
      achievements,
      streakCount,
      totalStudyTime,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'roadmap-progress.json';
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Progress exported successfully!');
  };

  const shareRoadmap = (roadmapId: string) => {
    const roadmap = roadmaps.find(r => r.id === roadmapId);
    if (roadmap) {
      const shareText = `Check out this learning roadmap: ${roadmap.title} - ${roadmap.description}`;
      if (navigator.share) {
        navigator.share({
          title: roadmap.title,
          text: shareText,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(shareText);
        toast.success('Roadmap details copied to clipboard!');
      }
    }
  };

  const resources = {
    documentation: [
      { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'docs' },
      { title: 'React Documentation', url: 'https://react.dev', type: 'docs' },
      { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs', type: 'docs' }
    ],
    videos: [
      { title: 'JavaScript Crash Course', url: 'https://youtube.com/watch?v=hdI2bqOjy3c', type: 'video' },
      { title: 'React Tutorial', url: 'https://youtube.com/watch?v=SqcY0GlETPk', type: 'video' },
      { title: 'System Design Primer', url: 'https://youtube.com/watch?v=ZgdS0EUmn70', type: 'video' }
    ],
    practice: [
      { title: 'LeetCode', url: 'https://leetcode.com', type: 'practice' },
      { title: 'HackerRank', url: 'https://hackerrank.com', type: 'practice' },
      { title: 'CodeSignal', url: 'https://codesignal.com', type: 'practice' }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/20 text-success border-success/30';
      case 'Intermediate': return 'bg-warning/20 text-warning border-warning/30';
      case 'Advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getFilteredRoadmaps = () => {
    return roadmaps.filter(roadmap => {
      const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDifficulty = filterDifficulty === 'all' || roadmap.difficulty === filterDifficulty;
      const matchesCategory = filterCategory === 'all' || roadmap.category === filterCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  };

  const getStudyStats = () => {
    const totalTopics = roadmaps.reduce((acc, roadmap) => acc + roadmap.topics.length, 0);
    const completedTopicsCount = completedTopics.size;
    const activeRoadmapsCount = activeRoadmaps.size;
    const overallProgress = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

    return {
      totalTopics,
      completedTopicsCount,
      activeRoadmapsCount,
      overallProgress,
      totalStudyHours: Math.round(totalStudyTime / 60),
      streakDays: streakCount,
      achievementsCount: achievements.length
    };
  };

  const categories = [...new Set(roadmaps.map(r => r.category))];
  const filteredRoadmaps = getFilteredRoadmaps();
  const stats = getStudyStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-glow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">🗺️ Learning Roadmaps</h1>
            <p className="text-muted-foreground">Structured learning paths to advance your career</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportProgress} variant="outline" className="btn-premium">
              <Download className="w-4 h-4 mr-2" />
              Export Progress
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="btn-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Roadmap
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Custom Roadmap</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={customRoadmap.title}
                        onChange={(e) => setCustomRoadmap(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Machine Learning Basics"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={customRoadmap.duration}
                        onChange={(e) => setCustomRoadmap(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 2-3 months"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={customRoadmap.description}
                      onChange={(e) => setCustomRoadmap(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this roadmap covers..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={customRoadmap.difficulty} onValueChange={(value) => setCustomRoadmap(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Topics *</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Add a topic..."
                        onKeyDown={(e) => e.key === 'Enter' && addTopicToCustomRoadmap()}
                      />
                      <Button type="button" onClick={addTopicToCustomRoadmap} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {customRoadmap.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {topic}
                          <button
                            onClick={() => removeTopicFromCustomRoadmap(index)}
                            className="ml-2 text-destructive hover:text-destructive/80"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={createCustomRoadmap} className="btn-hero flex-1">
                      Create Roadmap
                    </Button>
                    <Button onClick={() => setShowCreateDialog(false)} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Study Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.overallProgress}%</div>
          <div className="text-xs text-muted-foreground">Overall Progress</div>
        </Card>
        <Card className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-success">{stats.completedTopicsCount}</div>
          <div className="text-xs text-muted-foreground">Topics Completed</div>
        </Card>
        <Card className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-warning">{stats.activeRoadmapsCount}</div>
          <div className="text-xs text-muted-foreground">Active Roadmaps</div>
        </Card>
        <Card className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{stats.totalStudyHours}h</div>
          <div className="text-xs text-muted-foreground">Study Time</div>
        </Card>
        <Card className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-purple-500">{stats.streakDays}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </Card>
        <Card className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">{stats.achievementsCount}</div>
          <div className="text-xs text-muted-foreground">Achievements</div>
        </Card>
        <Card className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">{roadmaps.length}</div>
          <div className="text-xs text-muted-foreground">Total Roadmaps</div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="roadmaps">🛤️ Roadmaps</TabsTrigger>
          <TabsTrigger value="progress">📈 Progress</TabsTrigger>
          <TabsTrigger value="achievements">🏆 Achievements</TabsTrigger>
          <TabsTrigger value="resources">📚 Resources</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          {/* Search and Filter */}
          <div className="card-elevated p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent"
                />
              </div>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setFilterDifficulty('all');
                setFilterCategory('all');
              }}>
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap) => {
              const progress = getTopicProgress(roadmap.id, roadmap.topics);
              const isActive = activeRoadmaps.has(roadmap.id);
              const studyHours = Math.round((studyTime[roadmap.id] || 0) / 60);

              return (
                <Card key={roadmap.id} className="card-elevated hover:card-glow group transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{roadmap.icon}</div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => shareRoadmap(roadmap.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        {isActive && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-2 group-hover:text-gradient transition-colors">
                      {roadmap.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {roadmap.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>⭐ {roadmap.rating}</span>
                        <span>👥 {roadmap.enrolledUsers.toLocaleString()}</span>
                        <span>⏱️ {roadmap.estimatedHours}h</span>
                      </div>

                      {studyHours > 0 && (
                        <div className="text-xs text-primary">
                          📚 {studyHours}h studied
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className={getDifficultyColor(roadmap.difficulty)}>
                        {roadmap.difficulty}
                      </Badge>
                      <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/30">
                        {roadmap.category}
                      </Badge>
                      <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/30">
                        {roadmap.duration}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      {isActive ? (
                        <>
                          <Button className="btn-hero flex-1" onClick={() => setSelectedRoadmap(roadmap.id)}>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Continue
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => pauseRoadmap(roadmap.id)}>
                            <Pause className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="btn-premium flex-1"
                          onClick={() => startRoadmap(roadmap.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Learning
                        </Button>
                      )}
                      {progress > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetRoadmap(roadmap.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredRoadmaps.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No roadmaps found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => {
                setSearchTerm('');
                setFilterDifficulty('all');
                setFilterCategory('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress">
          <div className="space-y-6">
            {/* Overall Progress */}
            <Card className="card-elevated p-6">
              <h3 className="text-xl font-bold mb-4">📈 Overall Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">{stats.overallProgress}%</div>
                  <p className="text-sm text-muted-foreground">Total Completion</p>
                  <Progress value={stats.overallProgress} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stats.totalStudyHours}</div>
                  <p className="text-sm text-muted-foreground">Hours Studied</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    Average: {Math.round(stats.totalStudyHours / Math.max(stats.activeRoadmapsCount, 1))}h per roadmap
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-success mb-2">{stats.streakDays}</div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    Keep it up! 🔥
                  </div>
                </div>
              </div>
            </Card>

            {/* Individual Roadmap Progress */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">🛤️ Roadmap Progress</h3>
              {roadmaps.map((roadmap) => {
                const progress = getTopicProgress(roadmap.id, roadmap.topics);
                const completedCount = roadmap.topics.filter((_, index) =>
                  completedTopics.has(`${roadmap.id}-${index}`)
                ).length;
                const studyHours = Math.round((studyTime[roadmap.id] || 0) / 60);
                const isActive = activeRoadmaps.has(roadmap.id);

                return (
                  <Card key={roadmap.id} className="card-elevated p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{roadmap.icon}</div>
                        <div>
                          <h4 className="font-bold text-lg">{roadmap.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {completedCount}/{roadmap.topics.length} topics completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient">{progress}%</div>
                        {isActive && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 mt-1">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>📚 {studyHours}h studied</span>
                        <span>⏱️ {roadmap.estimatedHours - studyHours}h remaining</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRoadmap(roadmap.id)}
                      >
                        View Details
                      </Button>
                      {progress > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetRoadmap(roadmap.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Reset Progress
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <div className="space-y-6">
            <Card className="card-elevated p-6">
              <h3 className="text-xl font-bold mb-4">🏆 Your Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Achievement Cards */}
                {[
                  { id: 'first-steps', title: 'First Steps', description: 'Complete your first topic', icon: '🚀', unlocked: achievements.some(a => a.includes('first-topic')) },
                  { id: 'halfway-hero', title: 'Halfway Hero', description: 'Complete 50% of any roadmap', icon: '⭐', unlocked: achievements.some(a => a.includes('halfway')) },
                  { id: 'roadmap-master', title: 'Roadmap Master', description: 'Complete an entire roadmap', icon: '👑', unlocked: achievements.some(a => a.includes('completed')) },
                  { id: 'streak-warrior', title: 'Streak Warrior', description: 'Maintain a 7-day study streak', icon: '🔥', unlocked: stats.streakDays >= 7 },
                  { id: 'time-keeper', title: 'Time Keeper', description: 'Study for 50+ hours total', icon: '⏰', unlocked: stats.totalStudyHours >= 50 },
                  { id: 'multi-tasker', title: 'Multi-tasker', description: 'Have 3+ active roadmaps', icon: '🎯', unlocked: stats.activeRoadmapsCount >= 3 },
                  { id: 'knowledge-seeker', title: 'Knowledge Seeker', description: 'Complete 100+ topics', icon: '📚', unlocked: stats.completedTopicsCount >= 100 },
                  { id: 'perfectionist', title: 'Perfectionist', description: 'Achieve 100% on any roadmap', icon: '💎', unlocked: roadmaps.some(r => getTopicProgress(r.id, r.topics) === 100) },
                  { id: 'creator', title: 'Creator', description: 'Create a custom roadmap', icon: '🎨', unlocked: roadmaps.some(r => r.id.startsWith('custom-')) }
                ].map((achievement) => (
                  <Card key={achievement.id} className={`p-4 ${achievement.unlocked ? 'card-elevated bg-gradient-card' : 'opacity-50 bg-muted/30'}`}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h4 className="font-bold mb-1">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked && (
                        <Badge variant="outline" className="bg-success/20 text-success border-success/30 mt-2">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Achievement Stats */}
            <Card className="card-elevated p-6">
              <h3 className="text-xl font-bold mb-4">📊 Achievement Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{achievements.length}</div>
                  <div className="text-sm text-muted-foreground">Unlocked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">9</div>
                  <div className="text-sm text-muted-foreground">Total Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{Math.round((achievements.length / 9) * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{9 - achievements.length}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Detailed Roadmaps */}
        <TabsContent value="roadmaps">
          <div className="space-y-6">
            {filteredRoadmaps.map((roadmap) => {
              const progress = getTopicProgress(roadmap.id, roadmap.topics);
              const isActive = activeRoadmaps.has(roadmap.id);
              const studyHours = Math.round((studyTime[roadmap.id] || 0) / 60);

              return (
                <Card key={roadmap.id} className="card-elevated p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{roadmap.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold">{roadmap.title}</h3>
                        <p className="text-muted-foreground mb-2">{roadmap.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getDifficultyColor(roadmap.difficulty)}>
                            {roadmap.difficulty}
                          </Badge>
                          <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/30">
                            {roadmap.duration}
                          </Badge>
                          <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/30">
                            {roadmap.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>⭐ {roadmap.rating}</span>
                          <span>👥 {roadmap.enrolledUsers.toLocaleString()}</span>
                          <span>⏱️ {roadmap.estimatedHours}h</span>
                          {studyHours > 0 && <span>📚 {studyHours}h studied</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gradient">{progress}%</div>
                      <Progress value={progress} className="w-32 mt-2" />
                      {isActive && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 mt-2">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Prerequisites and Skills */}
                  {(roadmap.prerequisites.length > 0 || roadmap.skills.length > 0) && (
                    <div className="mb-6 space-y-3">
                      {roadmap.prerequisites.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Prerequisites:</h4>
                          <div className="flex flex-wrap gap-2">
                            {roadmap.prerequisites.map((prereq, index) => (
                              <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {roadmap.skills.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Skills you'll learn:</h4>
                          <div className="flex flex-wrap gap-2">
                            {roadmap.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Topics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {roadmap.topics.map((topic, index) => {
                      const isCompleted = completedTopics.has(`${roadmap.id}-${index}`);
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${isCompleted
                            ? 'bg-success/10 border-success/30 text-success'
                            : 'bg-muted/30 border-border hover:border-primary/30 hover:bg-muted/50'
                            }`}
                          onClick={() => toggleTopicCompletion(roadmap.id, index)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-success" />
                              ) : (
                                <Clock className="w-4 h-4 text-muted-foreground" />
                              )}
                            </span>
                            <span className="font-medium text-sm">{topic.name}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{topic.resources} resources</span>
                            <span>{topic.estimatedHours}h</span>
                          </div>
                          <Badge variant="outline" className={`mt-2 text-xs ${getDifficultyColor(topic.difficulty)}`}>
                            {topic.difficulty}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {isActive ? (
                      <>
                        <Button className="btn-hero flex-1">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Button>
                        <Button variant="outline" onClick={() => pauseRoadmap(roadmap.id)}>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="btn-premium flex-1"
                        onClick={() => startRoadmap(roadmap.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => shareRoadmap(roadmap.id)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    {progress > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => resetRoadmap(roadmap.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources">
          <div className="space-y-6">
            {/* Resource Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Documentation */}
              <Card className="card-elevated p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📖 Documentation
                </h3>
                <div className="space-y-3">
                  {resources.documentation.map((resource, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {resource.title}
                          </p>
                          <p className="text-xs text-muted-foreground">Official Documentation</p>
                        </div>
                        <span className="text-primary">→</span>
                      </a>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Video Tutorials */}
              <Card className="card-elevated p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  🎥 Video Tutorials
                </h3>
                <div className="space-y-3">
                  {resources.videos.map((resource, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {resource.title}
                          </p>
                          <p className="text-xs text-muted-foreground">YouTube Tutorial</p>
                        </div>
                        <span className="text-primary">→</span>
                      </a>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Practice Platforms */}
              <Card className="card-elevated p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  💪 Practice Platforms
                </h3>
                <div className="space-y-3">
                  {resources.practice.map((resource, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {resource.title}
                          </p>
                          <p className="text-xs text-muted-foreground">Coding Practice</p>
                        </div>
                        <span className="text-primary">→</span>
                      </a>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Books & Courses */}
              <Card className="card-elevated p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📚 Books & Courses
                </h3>
                <div className="space-y-3">
                  {[
                    { title: 'Cracking the Coding Interview', type: 'Book', rating: '4.8/5' },
                    { title: 'System Design Interview', type: 'Book', rating: '4.7/5' },
                    { title: 'CS50 Introduction to Computer Science', type: 'Course', rating: '4.9/5' },
                    { title: 'The Complete Web Developer Course', type: 'Course', rating: '4.6/5' }
                  ].map((resource, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between group">
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {resource.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{resource.type} • ⭐ {resource.rating}</p>
                        </div>
                        <span className="text-primary">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Study Tools */}
            <Card className="card-elevated p-6">
              <h3 className="text-xl font-bold mb-4">🛠️ Study Tools & Extensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Pomodoro Timer', description: 'Time management technique for focused study sessions', icon: '⏰' },
                  { name: 'Code Snippet Manager', description: 'Save and organize your code snippets', icon: '📝' },
                  { name: 'Progress Tracker', description: 'Visual progress tracking for your learning goals', icon: '📊' },
                  { name: 'Flashcard Creator', description: 'Create digital flashcards for quick reviews', icon: '🃏' },
                  { name: 'Study Group Finder', description: 'Connect with other learners in your area', icon: '👥' },
                  { name: 'Interview Simulator', description: 'Practice mock interviews with AI feedback', icon: '🎤' }
                ].map((tool, index) => (
                  <div key={index} className="p-4 bg-gradient-card rounded-lg hover:scale-105 transition-transform cursor-pointer">
                    <div className="text-2xl mb-2">{tool.icon}</div>
                    <h4 className="font-semibold mb-2">{tool.name}</h4>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Study Tips */}
            <Card className="card-elevated p-6">
              <h3 className="text-xl font-bold mb-4">💡 Study Tips & Best Practices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { tip: 'Practice Consistently', description: 'Dedicate at least 1 hour daily to coding practice', icon: '🔄' },
                  { tip: 'Focus on Understanding', description: 'Don\'t just memorize solutions, understand the concepts', icon: '🧠' },
                  { tip: 'Time Yourself', description: 'Practice under time constraints to simulate real interviews', icon: '⏱️' },
                  { tip: 'Review Mistakes', description: 'Analyze wrong answers and learn from them', icon: '🔍' },
                  { tip: 'Join Communities', description: 'Engage with other learners for motivation and help', icon: '🤝' },
                  { tip: 'Build Projects', description: 'Apply your knowledge in real-world projects', icon: '🏗️' },
                  { tip: 'Take Breaks', description: 'Regular breaks improve focus and retention', icon: '☕' },
                  { tip: 'Track Progress', description: 'Monitor your improvement to stay motivated', icon: '📈' }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-gradient-card rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{item.icon}</span>
                      <h4 className="font-semibold text-primary">{item.tip}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Learning Strategies */}
            <Card className="card-elevated p-6">
              <h3 className="text-xl font-bold mb-4">🎯 Learning Strategies</h3>
              <div className="space-y-4">
                {[
                  {
                    strategy: 'Spaced Repetition',
                    description: 'Review topics at increasing intervals to improve long-term retention',
                    steps: ['Learn new concept', 'Review after 1 day', 'Review after 3 days', 'Review after 1 week', 'Review after 2 weeks']
                  },
                  {
                    strategy: 'Active Recall',
                    description: 'Test yourself frequently instead of just re-reading material',
                    steps: ['Read/watch content', 'Close materials', 'Try to recall key points', 'Check accuracy', 'Repeat for weak areas']
                  },
                  {
                    strategy: 'Feynman Technique',
                    description: 'Explain concepts in simple terms to identify knowledge gaps',
                    steps: ['Choose a concept', 'Explain it simply', 'Identify gaps', 'Review source material', 'Simplify further']
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">{item.strategy}</h4>
                    <p className="text-muted-foreground mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.steps.map((step, stepIndex) => (
                        <Badge key={stepIndex} variant="outline" className="text-xs">
                          {stepIndex + 1}. {step}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Roadmap;