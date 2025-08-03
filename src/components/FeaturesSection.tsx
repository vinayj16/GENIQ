import React from 'react';
import { Badge } from "@/components/ui/badge";

const FeaturesSection = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Code Analysis',
      description: 'Get instant feedback with complexity analysis, optimization suggestions, and personalized hints',
      badge: 'AI-Powered',
      badgeColor: 'bg-primary/20 text-primary border-primary/30'
    },
    {
      icon: '🏢',
      title: 'Company-Specific Preparation',
      description: 'Practice with real interview questions from top tech companies with detailed insights',
      badge: 'Premium',
      badgeColor: 'bg-warning/20 text-warning border-warning/30'
    },
    {
      icon: '👥',
      title: 'Peer Review System',
      description: 'Share solutions and get feedback from the community with voting and comment system',
      badge: 'Community',
      badgeColor: 'bg-success/20 text-success border-success/30'
    },
    {
      icon: '🎤',
      title: 'Voice Coding Interface',
      description: 'Practice coding with speech-to-text technology for accessibility and hands-free coding',
      badge: 'Innovation',
      badgeColor: 'bg-accent/20 text-accent border-accent/30'
    },
    {
      icon: '🖊️',
      title: 'Whiteboard Simulator',
      description: 'Practice system design and algorithm sketching with our advanced drawing tools',
      badge: 'Interactive',
      badgeColor: 'bg-destructive/20 text-destructive border-destructive/30'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Track your progress with detailed performance metrics and personalized recommendations',
      badge: 'Analytics',
      badgeColor: 'bg-secondary/20 text-secondary-foreground border-secondary/30'
    }
  ];

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-primary text-primary-foreground">
              ✨ Advanced Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From AI-powered code analysis to company-specific insights, GENIQ provides 
              comprehensive tools for your interview preparation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-elevated hover:card-glow group transition-all duration-300 cursor-pointer"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className={`mb-3 ${feature.badgeColor}`}>
                      {feature.badge}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="mt-16 pt-16 border-t border-border/40">
            <h3 className="text-2xl font-bold text-center mb-12">More Features Coming Soon</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '📱', name: 'Mobile App' },
                { icon: '🎯', name: 'Mock Interviews' },
                { icon: '🏆', name: 'Competitions' },
                { icon: '🌐', name: 'Global Leaderboard' },
                { icon: '📚', name: 'Study Plans' },
                { icon: '🔄', name: 'Sync Progress' },
                { icon: '💾', name: 'Offline Mode' },
                { icon: '🎨', name: 'Custom Themes' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;