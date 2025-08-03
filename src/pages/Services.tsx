import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useNavigationHelpers } from '@/utils/navigationHelpers';

const Services = () => {
  const navigate = useNavigate();
  const nav = useNavigationHelpers(navigate);

  const handleServiceClick = (serviceTitle: string) => {
    switch (serviceTitle) {
      case 'Coding Practice':
        nav.goToCoding();
        break;
      case 'MCQ Tests':
        nav.goToMCQs();
        break;
      case 'Mock Interviews':
        nav.goToInterviews();
        break;
      case 'Resume Builder':
        nav.goToResume();
        break;
      case 'Company Insights':
        nav.goToCompanies();
        break;
      case 'Learning Roadmaps':
        navigate('/dashboard/roadmap');
        break;
      default:
        nav.goToDashboard();
    }
  };

  const services = [
    {
      icon: '💻',
      title: 'Coding Practice',
      description: 'Solve 2000+ problems with AI-powered feedback and hints',
      features: ['Algorithm Problems', 'Data Structure Questions', 'Real Interview Problems', 'Multiple Languages'],
      price: 'Free'
    },
    {
      icon: '📝',
      title: 'MCQ Tests',
      description: 'Test your knowledge with company-specific questions',
      features: ['Topic-wise Tests', 'Company Filters', 'Detailed Explanations', 'Progress Tracking'],
      price: 'Free'
    },
    {
      icon: '🎤',
      title: 'Mock Interviews',
      description: 'Practice with AI-powered mock interview sessions',
      features: ['Technical Interviews', 'Behavioral Questions', 'Real-time Feedback', 'Recording & Analysis'],
      price: '$19/month'
    },
    {
      icon: '📄',
      title: 'Resume Builder',
      description: 'Create professional resumes with AI assistance',
      features: ['ATS Optimization', 'Industry Templates', 'Real-time Suggestions', 'Export Options'],
      price: '$9/month'
    },
    {
      icon: '🏢',
      title: 'Company Insights',
      description: 'Get detailed information about interview processes',
      features: ['Interview Experiences', 'Salary Information', 'Company Culture', 'Preparation Tips'],
      price: 'Free'
    },
    {
      icon: '🗺️',
      title: 'Learning Roadmaps',
      description: 'Structured learning paths for different roles',
      features: ['Role-based Paths', 'Skill Assessment', 'Progress Tracking', 'Curated Resources'],
      price: 'Free'
    }
  ];

  return (
    <div className="min-h-screen">
      <main className="py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gradient mb-6">Our Services</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive interview preparation tools designed to help you succeed 
                in landing your dream job at top tech companies.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {services.map((service, index) => (
                <div key={index} className="card-elevated hover:card-glow group transition-all duration-300">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-success">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient mb-4">{service.price}</div>
                    <Button 
                      className="btn-hero w-full"
                      onClick={() => handleServiceClick(service.title)}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Plans */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gradient mb-6">Choose Your Plan</h2>
              <p className="text-xl text-muted-foreground">Start free and upgrade as you grow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="card-elevated text-center">
                <h3 className="text-2xl font-bold mb-4">Free</h3>
                <div className="text-4xl font-bold text-gradient mb-6">$0</div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Access to 500 coding problems
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Basic MCQ tests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Community access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Basic progress tracking
                  </li>
                </ul>
                <Button className="btn-premium w-full">
                  Get Started
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="card-glow text-center relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <div className="text-4xl font-bold text-gradient mb-6">$19<span className="text-lg">/month</span></div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Access to all 2000+ problems
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    AI-powered code analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Mock interviews
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Company-specific insights
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Advanced analytics
                  </li>
                </ul>
                <Button className="btn-hero w-full">
                  Upgrade to Pro
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="card-elevated text-center">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <div className="text-4xl font-bold text-gradient mb-6">Custom</div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Team management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Custom branding
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    API access
                  </li>
                </ul>
                <Button className="btn-premium w-full">
                  Contact Sales
                </Button>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16 card-glow">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of developers who have successfully landed their dream jobs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-hero text-lg px-12 py-6">
                  🚀 Start Free Trial
                </Button>
                <Button variant="outline" className="btn-premium text-lg px-12 py-6">
                  📞 Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;