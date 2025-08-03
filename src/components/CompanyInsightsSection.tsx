import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CompanyInsightsSection = () => {
  const navigate = useNavigate();

  const practiceCompany = (companyName: string) => {
    toast.success(`Starting ${companyName} practice! Good luck! 💪`);
    navigate(`/companies/${companyName.toLowerCase()}`);
  };

  const viewCompanyInsights = (companyName: string) => {
    toast.info(`Viewing ${companyName} insights and interview tips! 📊`);
    navigate(`/companies/${companyName.toLowerCase()}`);
  };

  const exploreAllCompanies = () => {
    toast.success('Exploring all companies! 🌟');
    navigate('/companies');
  };

  const companies = [
    {
      name: 'Google',
      logo: '🟦',
      difficulty: 'Hard',
      problems: 342,
      focusAreas: ['Algorithms', 'System Design', 'Data Structures'],
      successRate: '89%',
      avgSalary: '$180k',
      description: 'Focus on algorithmic thinking and system design. Expect 4-5 rounds including coding, system design, and behavioral.'
    },
    {
      name: 'Amazon',
      logo: '🟧',
      difficulty: 'Medium',
      problems: 298,
      focusAreas: ['Leadership', 'Behavioral', 'Coding'],
      successRate: '76%',
      avgSalary: '$165k',
      description: 'Strong emphasis on leadership principles and behavioral questions. Technical rounds focus on practical problem-solving.'
    },
    {
      name: 'Microsoft',
      logo: '🟨',
      difficulty: 'Medium',
      problems: 234,
      focusAreas: ['Problem Solving', 'Design', 'Collaboration'],
      successRate: '82%',
      avgSalary: '$170k',
      description: 'Collaborative problem-solving approach. Expect questions about design decisions and technical trade-offs.'
    },
    {
      name: 'Apple',
      logo: '🔘',
      difficulty: 'Hard',
      problems: 187,
      focusAreas: ['Innovation', 'Design', 'Performance'],
      successRate: '85%',
      avgSalary: '$190k',
      description: 'Focus on innovation and attention to detail. Technical questions often involve optimization and creative thinking.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-card border-y border-border/40">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-primary text-primary-foreground">
              🏢 Company Insights
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Master Company-Specific Interviews</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get detailed insights into interview processes, common questions, and preparation strategies 
              for top tech companies worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {companies.map((company, index) => (
              <div key={index} className="card-glow hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl">{company.logo}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{company.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`${
                          company.difficulty === 'Hard' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                          'bg-warning/20 text-warning border-warning/30'
                        }`}
                      >
                        {company.difficulty}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {company.focusAreas.map((area, idx) => (
                        <span key={idx} className="px-2 py-1 bg-muted/50 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {company.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{company.problems}</div>
                    <div className="text-xs text-muted-foreground">Problems</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success">{company.successRate}</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-warning">{company.avgSalary}</div>
                    <div className="text-xs text-muted-foreground">Avg Salary</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="btn-hero flex-1 text-sm"
                    onClick={() => practiceCompany(company.name)}
                  >
                    Practice {company.name}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="btn-premium text-sm"
                    onClick={() => viewCompanyInsights(company.name)}
                  >
                    View Insights
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* All Companies Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">500+ Companies Available</h3>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                'Meta', 'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'Spotify',
                'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'NVIDIA', 'Snap', 'TikTok'
              ].map((company, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-gradient-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                >
                  {company}
                </span>
              ))}
            </div>
            <Button className="btn-hero" onClick={exploreAllCompanies}>
              🌟 Explore All Companies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyInsightsSection;