import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DailyChallengeSection = () => {
  const navigate = useNavigate();

  const startChallenge = () => {
    toast.success('Starting today\'s challenge! 🚀');
    navigate('/practice/1'); // Navigate to Two Sum problem
  };

  const viewHints = () => {
    toast.info('Opening hints for today\'s challenge! 💡');
    navigate('/practice/1?hints=true');
  };

  return (
    <section className="py-20 bg-gradient-card border-y border-border/40">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-primary text-primary-foreground">
              🔥 Daily Challenge
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Today's Challenge</h2>
            <p className="text-xl text-muted-foreground">Maintain your coding streak with our daily problems</p>
          </div>

          <div className="card-glow max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Challenge Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="bg-success/20 text-success border-success/30">Easy</Badge>
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">Array</Badge>
                  <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">Two Pointers</Badge>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gradient">Two Sum</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Given an array of integers nums and an integer target, return indices of the two numbers 
                  such that they add up to target. You may assume that each input would have exactly one solution, 
                  and you may not use the same element twice.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Acceptance Rate</div>
                    <div className="text-xl font-bold text-success">49.2%</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Avg. Time</div>
                    <div className="text-xl font-bold text-primary">15 min</div>
                  </div>
                </div>

                {/* Company Tags */}
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">Frequently Asked At:</div>
                  <div className="flex flex-wrap gap-2">
                    {['Google', 'Amazon', 'Microsoft', 'Apple', 'Facebook'].map((company) => (
                      <span key={company} className="px-3 py-1 bg-gradient-card border border-border rounded-lg text-sm">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="btn-hero flex-1" onClick={startChallenge}>
                    🚀 Start Challenge
                  </Button>
                  <Button variant="outline" className="btn-premium" onClick={viewHints}>
                    💡 View Hints
                  </Button>
                </div>
              </div>

              {/* Streak Info */}
              <div className="lg:w-80">
                <div className="bg-gradient-card border border-border rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🔥</div>
                    <div className="text-3xl font-bold text-gradient">7</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Streak</span>
                      <span className="font-semibold text-primary">7 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Longest Streak</span>
                      <span className="font-semibold">21 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Solved</span>
                      <span className="font-semibold">143</span>
                    </div>
                  </div>

                  {/* Weekly Progress */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-3">This Week</div>
                    <div className="flex gap-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <div key={day} className="flex-1 text-center">
                          <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs ${
                            index < 5 ? 'bg-success text-success-foreground' : 
                            index === 5 ? 'bg-primary text-primary-foreground' : 
                            'bg-muted text-muted-foreground'
                          }`}>
                            {index < 5 ? '✓' : index === 5 ? '●' : '○'}
                          </div>
                          <div className="text-xs text-muted-foreground">{day}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyChallengeSection;