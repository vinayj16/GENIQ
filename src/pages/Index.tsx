import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import DailyChallengeSection from '../components/DailyChallengeSection';
import ProblemPreviewSection from '../components/ProblemPreviewSection';
import FeaturesSection from '../components/FeaturesSection';
import CompanyInsightsSection from '../components/CompanyInsightsSection';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, BookOpen, TrendingUp, Users, Code, Star, Building, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const companyData = [
    {
      name: 'Google',
      color: 'bg-blue-500',
      difficulty: 'Hard',
      focus: ['Problem Solving', 'System Design', 'Algorithms'],
      description: 'Strong emphasis on algorithmic thinking and system design. Expect challenging technical problems.',
      problems: 298,
      successRate: 76,
      avgSalary: 180000,
      icon: '🔵'
    },
    {
      name: 'Amazon',
      color: 'bg-orange-500',
      difficulty: 'Medium',
      focus: ['Leadership', 'Behavioral', 'Coding'],
      description: 'Strong emphasis on leadership principles and behavioral questions. Technical rounds focus on practical problem-solving.',
      problems: 298,
      successRate: 76,
      avgSalary: 165000,
      icon: '🟧'
    },
    {
      name: 'Microsoft',
      color: 'bg-yellow-500',
      difficulty: 'Medium',
      focus: ['Problem Solving', 'Design', 'Collaboration'],
      description: 'Collaborative problem-solving approach. Expect questions about design decisions and technical trade-offs.',
      problems: 234,
      successRate: 82,
      avgSalary: 170000,
      icon: '🟨'
    },
    {
      name: 'Apple',
      color: 'bg-gray-500',
      difficulty: 'Hard',
      focus: ['Innovation', 'Design', 'Performance'],
      description: 'Focus on innovation and attention to detail. Technical questions often involve optimization and creative thinking.',
      problems: 187,
      successRate: 85,
      avgSalary: 190000,
      icon: '🔘'
    }
  ];

  const startPracticing = () => {
    toast.success('Starting your practice journey! 🚀');
    navigate('/dashboard/coding');
  };

  const startFreePractice = () => {
    toast.success('Welcome to free practice mode! 📚');
    navigate('/dashboard/mcqs');
  };

  const browseProblems = () => {
    navigate('/dashboard/coding');
  };

  const practiceCompany = (companyName: string) => {
    toast.success(`Starting ${companyName} practice! Good luck! 💪`);
    navigate(`/dashboard/coding?company=${companyName}`);
  };

  const viewCompanyInsights = (companyName: string) => {
    toast.info(`Viewing ${companyName} insights and interview tips! 📊`);
    navigate(`/dashboard/reviews?company=${companyName}`);
  };

  const exploreAllCompanies = () => {
    navigate('/companies');
  };

  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        
        {/* App Introduction Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gradient mb-6">Welcome to GENIQ</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your comprehensive AI-powered interview preparation platform. Master coding challenges, 
                ace technical interviews, and land your dream job with personalized learning paths and 
                real-time feedback.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-gradient-card border-border/40 hover:glow-primary transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    Targeted Practice
                  </CardTitle>
                  <CardDescription>
                    Practice problems from top tech companies with AI-powered hints and solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 500+ Coding Problems</li>
                    <li>• Company-specific Questions</li>
                    <li>• Real-time Code Analysis</li>
                    <li>• Multiple Programming Languages</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card border-border/40 hover:glow-primary transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    AI-Powered Learning
                  </CardTitle>
                  <CardDescription>
                    Get personalized feedback and recommendations powered by advanced AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Smart Code Review</li>
                    <li>• Personalized Study Plans</li>
                    <li>• Interview Simulation</li>
                    <li>• Performance Analytics</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card border-border/40 hover:glow-primary transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    Track Progress
                  </CardTitle>
                  <CardDescription>
                    Monitor your growth with detailed analytics and achievement tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Skill Progress Tracking</li>
                    <li>• Achievement Badges</li>
                    <li>• Streak Counters</li>
                    <li>• Performance Insights</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Ready to Start Your Journey?</h3>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button className="btn-hero" onClick={startPracticing}>
                  <Target className="w-4 h-4 mr-2" />
                  🎯 Start Practicing Now
                </Button>
                <Button variant="outline" className="btn-premium" onClick={startFreePractice}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  🎯 Start Free Practice
                </Button>
                <Button variant="outline" className="btn-premium" onClick={browseProblems}>
                  <Code className="w-4 h-4 mr-2" />
                  📚 Browse Problems
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gradient mb-4">Join Thousands of Successful Developers</h2>
              <p className="text-muted-foreground">Our platform has helped developers land jobs at top tech companies</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">89%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-success mb-2">$180k</div>
                <div className="text-muted-foreground">Avg Salary</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-warning mb-2">500+</div>
                <div className="text-muted-foreground">Problems</div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Insights Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gradient mb-6">Company-Specific Preparation</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get insights into interview processes at top tech companies and practice with real questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {companyData.map((company) => (
                <Card key={company.name} className="card-elevated hover:card-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{company.icon}</span>
                        <div>
                          <CardTitle className="text-xl">{company.name}</CardTitle>
                          <Badge variant="outline" className={
                            company.difficulty === 'Hard' ? 'bg-red-100 text-red-800 border-red-300' :
                            company.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            'bg-green-100 text-green-800 border-green-300'
                          }>
                            {company.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {company.focus.map((focus) => (
                        <Badge key={focus} variant="secondary" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{company.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{company.problems}</div>
                        <div className="text-xs text-muted-foreground">Problems</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-success">{company.successRate}%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-warning">${(company.avgSalary / 1000).toFixed(0)}k</div>
                        <div className="text-xs text-muted-foreground">Avg Salary</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="btn-hero flex-1" 
                        size="sm"
                        onClick={() => practiceCompany(company.name)}
                      >
                        Practice {company.name}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="btn-premium" 
                        size="sm"
                        onClick={() => viewCompanyInsights(company.name)}
                      >
                        View Insights
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                className="btn-premium" 
                onClick={exploreAllCompanies}
              >
                <Building className="w-4 h-4 mr-2" />
                🌟 Explore All Companies
              </Button>
            </div>
          </div>
        </section>
        
        <DailyChallengeSection />
        <ProblemPreviewSection />
        <FeaturesSection />
        <CompanyInsightsSection />
      </main>
      <Footer />
      
      {/* Floating Action Button */}
      <Link to="/dashboard" className="fixed bottom-8 right-8 z-50">
        <Button className="btn-hero rounded-full w-16 h-16 shadow-2xl glow-primary animate-glow hover:scale-110 transition-transform">
          🤖
        </Button>
      </Link>
    </div>
  );
};

export default Index;
