import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Logo from '@/components/ui/logo';

const HeroSection = () => {
  const navigate = useNavigate();

  const startFreePractice = () => {
    toast.success('Welcome to free practice mode! 📚');
    navigate('/dashboard/mcqs');
  };

  const browseProblems = () => {
    toast.success('Exploring coding problems! 🚀');
    navigate('/dashboard/coding');
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_50%)] opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-accent/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-success/25 rounded-full animate-float" style={{animationDelay: '2s'}}></div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-card border border-primary/30 mb-8 animate-glow">
            <span className="text-sm font-medium text-primary">🚀 AI-Powered Interview Prep</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master Your{' '}
            <span className="text-gradient">Technical</span>
            <br />
            Interview Journey
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Advance your career with AI-powered coding practice, company-specific insights, 
            and comprehensive interview preparation tools designed for modern developers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button className="btn-hero text-lg px-12 py-6" onClick={startFreePractice}>
              🎯 Start Free Practice
            </Button>
            <Button variant="outline" className="btn-premium text-lg px-12 py-6" onClick={browseProblems}>
              📚 Browse Problems
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card-elevated text-center hover:card-glow transition-all duration-300">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2 text-gradient">AI Code Review</h3>
              <p className="text-muted-foreground">Get instant feedback on your coding solutions with complexity analysis</p>
            </div>
            <div className="card-elevated text-center hover:card-glow transition-all duration-300">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold mb-2 text-gradient">Company Insights</h3>
              <p className="text-muted-foreground">Practice with real questions from Google, Amazon, Microsoft & more</p>
            </div>
            <div className="card-elevated text-center hover:card-glow transition-all duration-300">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2 text-gradient">Progress Analytics</h3>
              <p className="text-muted-foreground">Track your learning journey with detailed performance metrics</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 pt-16 border-t border-border/40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">2000+</div>
                <div className="text-sm text-muted-foreground">Coding Problems</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">500+</div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">10K+</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;