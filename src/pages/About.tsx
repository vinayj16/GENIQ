import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useNavigationHelpers } from '@/utils/navigationHelpers';

const About = () => {
  const navigate = useNavigate();
  const nav = useNavigationHelpers(navigate);

  return (
    <div className="min-h-screen">
      <main className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gradient mb-6">About Geniq</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Revolutionizing interview preparation with AI-powered learning
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={nav.goToDashboard} className="btn-hero">
                  Get Started Free
                </Button>
                <Button onClick={nav.goToCompanies} variant="outline" className="btn-premium">
                  Explore Companies
                </Button>
              </div>
            </div>

            <div className="space-y-12">
              {/* Mission */}
              <div className="card-glow">
                <h2 className="text-3xl font-bold mb-4">🎯 Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Geniq is dedicated to democratizing access to high-quality interview preparation. 
                  We believe that every developer deserves the tools and guidance needed to succeed 
                  in their dream job interviews, regardless of their background or experience level.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-elevated">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-xl font-bold mb-3">AI-Powered Learning</h3>
                  <p className="text-muted-foreground">
                    Our advanced AI analyzes your code, provides personalized feedback, 
                    and adapts to your learning style for maximum effectiveness.
                  </p>
                </div>
                <div className="card-elevated">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="text-xl font-bold mb-3">Real Interview Data</h3>
                  <p className="text-muted-foreground">
                    Practice with actual questions from top tech companies, 
                    backed by insights from successful candidates.
                  </p>
                </div>
                <div className="card-elevated">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-3">Community Driven</h3>
                  <p className="text-muted-foreground">
                    Learn from peers, share solutions, and get feedback from 
                    experienced developers in our supportive community.
                  </p>
                </div>
                <div className="card-elevated">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-bold mb-3">Data-Driven Insights</h3>
                  <p className="text-muted-foreground">
                    Track your progress with detailed analytics and get 
                    personalized recommendations for improvement.
                  </p>
                </div>
              </div>

              {/* Team */}
              <div className="card-elevated">
                <h2 className="text-3xl font-bold mb-6 text-center">👨‍💻 Our Team</h2>
                <p className="text-lg text-muted-foreground text-center leading-relaxed">
                  GENIQ is built by a team of passionate engineers, educators, and interview experts 
                  who have worked at top tech companies including Google, Amazon, Microsoft, and Meta. 
                  We combine our industry experience with cutting-edge technology to create the most 
                  effective interview preparation platform available.
                </p>
              </div>

              {/* Contact */}
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Have questions or feedback? We'd love to hear from you!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:hello@geniq.dev" className="btn-hero inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold">
                    📧 Contact Us
                  </a>
                  <a href="#" className="btn-premium inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold">
                    💬 Join Community
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;