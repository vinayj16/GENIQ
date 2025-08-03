import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Play, BookOpen, Users, TrendingUp, Clock, Award, Star, CheckCircle, AlertCircle, Info, Lightbulb, Target, BarChart3, MessageSquare, Mic, PenTool } from 'lucide-react';
import { getCompanyById, companyFeatures } from '@/lib/companies';

const CompanyProfile: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  const company = companyId ? getCompanyById(companyId) : null;

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-2xl font-bold mb-2">Company Not Found</h2>
          <p className="text-muted-foreground">The company you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'problems', label: 'Problems', icon: BookOpen },
    { id: 'interview', label: 'Interview Process', icon: Users },
    { id: 'tips', label: 'Preparation Tips', icon: Lightbulb },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const mockProblems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', frequency: 'Very High', lastAsked: '2024-01-15' },
    { id: 2, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', frequency: 'High', lastAsked: '2024-01-10' },
    { id: 3, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', frequency: 'Medium', lastAsked: '2024-01-05' },
    { id: 4, title: 'Valid Parentheses', difficulty: 'Easy', frequency: 'High', lastAsked: '2024-01-12' },
    { id: 5, title: 'Merge Two Sorted Lists', difficulty: 'Easy', frequency: 'Medium', lastAsked: '2024-01-08' }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Company Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 text-center border">
          <div className="text-3xl font-bold text-primary">{company.problems}</div>
          <div className="text-sm text-muted-foreground mt-1">Total Problems</div>
        </div>
        <div className="bg-card rounded-lg p-6 text-center border">
          <div className="text-3xl font-bold text-success">{company.successRate}%</div>
          <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
        </div>
        <div className="bg-card rounded-lg p-6 text-center border">
          <div className="text-3xl font-bold text-secondary">{company.avgSalary}</div>
          <div className="text-sm text-muted-foreground mt-1">Average Salary</div>
        </div>
        <div className="bg-card rounded-lg p-6 text-center border">
          <div className="text-3xl font-bold text-accent">{company.interviewProcess.duration}</div>
          <div className="text-sm text-muted-foreground mt-1">Process Duration</div>
        </div>
      </div>

      {/* Key Focus Areas */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-xl font-bold mb-4">Key Focus Areas</h3>
        <div className="flex flex-wrap gap-3">
          {company.focus.map((focus, index) => (
            <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">
              {focus}
            </span>
          ))}
        </div>
      </div>

      {/* Key Topics */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-xl font-bold mb-4">Important Topics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {company.keyTopics.map((topic, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">{topic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Features */}
      {company.features && (
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-xl font-bold mb-4">Available Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(company.features).map(([feature, enabled]) => {
              const featureInfo = companyFeatures[feature as keyof typeof companyFeatures];
              if (!enabled || !featureInfo) return null;
              
              return (
                <div key={feature} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
                  <div className="text-2xl">{featureInfo.icon}</div>
                  <div>
                    <div className="font-semibold">{featureInfo.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{featureInfo.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderProblems = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Frequently Asked Problems</h3>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Practice All
          </button>
        </div>
        
        <div className="space-y-4">
          {mockProblems.map((problem) => (
            <div key={problem.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  problem.difficulty === 'Easy' ? 'bg-success' :
                  problem.difficulty === 'Medium' ? 'bg-warning' : 'bg-destructive'
                }`}></div>
                <div>
                  <div className="font-semibold">{problem.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {problem.difficulty} • Asked {problem.frequency.toLowerCase()} • Last seen: {problem.lastAsked}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  problem.frequency === 'Very High' ? 'bg-destructive/20 text-destructive' :
                  problem.frequency === 'High' ? 'bg-warning/20 text-warning' :
                  'bg-success/20 text-success'
                }`}>
                  {problem.frequency}
                </span>
                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInterviewProcess = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Interview Process Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{company.interviewProcess.rounds}</div>
            <div className="text-sm text-gray-600 mt-1">Total Rounds</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{company.interviewProcess.duration}</div>
            <div className="text-sm text-gray-600 mt-1">Process Duration</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{company.successRate}%</div>
            <div className="text-sm text-gray-600 mt-1">Success Rate</div>
          </div>
        </div>

        <div className="space-y-4">
          {company.interviewProcess.stages.map((stage, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{stage}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {index === 0 && "Initial screening with recruiter to discuss background and role fit"}
                  {index === 1 && "Technical assessment focusing on coding and problem-solving skills"}
                  {index === 2 && "In-depth technical interview with coding challenges"}
                  {index === 3 && "System design and architecture discussion"}
                  {index === 4 && "Behavioral interview and culture fit assessment"}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {index < 2 ? '30-45 min' : index < 4 ? '60-90 min' : '45-60 min'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTips = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Preparation Tips</h3>
        
        <div className="space-y-4">
          {company.tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-gray-900">{tip}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recommended Study Plan</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 border-l-4 border-blue-500 bg-blue-50">
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-900">Week 1-2: Foundation</div>
              <div className="text-sm text-gray-600 mt-1">Master basic data structures and algorithms</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 border-l-4 border-green-500 bg-green-50">
            <Target className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-900">Week 3-4: Company-Specific Practice</div>
              <div className="text-sm text-gray-600 mt-1">Focus on {company.name}-specific problems and patterns</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 border-l-4 border-purple-500 bg-purple-50">
            <Target className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-900">Week 5-6: System Design & Mock Interviews</div>
              <div className="text-sm text-gray-600 mt-1">Practice system design and conduct mock interviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Problems Solved</div>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">0%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">0h</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Mock Interviews</div>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Progress Tracking</h3>
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Start practicing to see your progress analytics</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${company.color} text-white py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Companies</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center text-3xl font-bold">
                {company.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
                <p className="text-xl text-white/90 mb-4">{company.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {company.tier}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {company.difficulty}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{(company.successRate / 20).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Start Practicing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'problems' && renderProblems()}
        {activeTab === 'interview' && renderInterviewProcess()}
        {activeTab === 'tips' && renderTips()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default CompanyProfile;