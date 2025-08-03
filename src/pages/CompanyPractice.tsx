import React, { useState, useMemo } from 'react';
import { Search, Filter, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { companies, companyFeatures, companyTiers, getAllTiers, searchCompanies, Company } from '@/lib/companies';

const CompanyPractice: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

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
    // Already on companies page, could scroll to top or show all
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCompanies = useMemo(() => {
    let result = companies;

    if (searchQuery) {
      result = searchCompanies(searchQuery);
    }

    if (selectedTier !== 'All') {
      result = result.filter(company => company.tier === selectedTier);
    }

    if (selectedDifficulty !== 'All') {
      result = result.filter(company => company.difficulty === selectedDifficulty);
    }

    return result;
  }, [searchQuery, selectedTier, selectedDifficulty]);

  const featuredCompanies = companies.slice(0, 4);
  const tiers = getAllTiers();

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'aiPowered': return '🤖';
      case 'companySpecific': return '🏢';
      case 'peerReview': return '👥';
      case 'voiceCoding': return '🎤';
      case 'whiteboard': return '🖊️';
      case 'analytics': return '📊';
      default: return '✨';
    }
  };

  const CompanyCard: React.FC<{ company: Company; featured?: boolean }> = ({ company, featured = false }) => (
    <div className={`bg-card rounded-xl border hover:shadow-lg transition-all duration-300 card-elevated ${featured ? 'transform hover:scale-105 card-glow' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${company.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
              {company.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{company.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${companyTiers[company.tier]?.color} text-white`}>
                  {company.tier}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  company.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                  company.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
                  'bg-destructive/20 text-destructive'
                }`}>
                  {company.difficulty}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{company.avgSalary}</div>
            <div className="text-sm text-muted-foreground">Avg Salary</div>
          </div>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">{company.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {company.focus.map((focus, index) => (
            <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {focus}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold">{company.problems}</div>
            <div className="text-xs text-muted-foreground">Problems</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">{company.successRate}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{company.interviewProcess.rounds}</div>
            <div className="text-xs text-muted-foreground">Rounds</div>
          </div>
        </div>

        {company.features && (
          <div className="flex flex-wrap gap-1 mb-4">
            {Object.entries(company.features).map(([feature, enabled]) => 
              enabled && (
                <span key={feature} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full flex items-center">
                  <span className="mr-1">{getFeatureIcon(feature)}</span>
                  {feature === 'aiPowered' && 'AI'}
                  {feature === 'voiceCoding' && 'Voice'}
                  {feature === 'whiteboard' && 'Whiteboard'}
                  {feature === 'peerReview' && 'Community'}
                  {feature === 'analytics' && 'Analytics'}
                </span>
              )
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <button 
            className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 btn-premium"
            onClick={() => practiceCompany(company.name)}
          >
            <Play className="w-4 h-4" />
            <span>Practice {company.name}</span>
          </button>
          <button 
            className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => viewCompanyInsights(company.name)}
          >
            View Insights
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🎯 Start Practicing Now
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Master interviews at top tech companies with AI-powered preparation
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
              {Object.entries(companyFeatures).map(([key, feature]) => (
                <div key={key} className="bg-background/10 backdrop-blur-sm rounded-lg p-4 text-center border border-background/20">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="text-sm font-medium">{feature.title.split(' ')[0]}</div>
                  <div className="text-xs opacity-80 mt-1">{feature.title.split(' ').slice(1).join(' ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl border p-6 mb-8 card-elevated">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies, technologies, or interview topics..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Tier</label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  >
                    <option value="All">All Tiers</option>
                    {tiers.map(tier => (
                      <option key={tier} value={tier}>{tier}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Featured Companies */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCompanies.map(company => (
              <CompanyCard key={company.id} company={company} featured />
            ))}
          </div>
        </div>

        {/* All Companies */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              All Companies ({filteredCompanies.length})
            </h2>
            <div className="text-sm text-muted-foreground">
              500+ Companies Available
            </div>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
        </div>

        {/* Additional Companies Preview */}
        <div className="mt-12 bg-gradient-to-r from-muted/50 to-primary/10 rounded-xl p-8 text-center card-elevated">
          <h3 className="text-2xl font-bold mb-4">500+ Companies Available</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {['Meta', 'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'Spotify', 'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'NVIDIA', 'Snap', 'TikTok'].map(name => (
              <span key={name} className="px-3 py-1 bg-card text-foreground rounded-full text-sm font-medium border">
                {name}
              </span>
            ))}
          </div>
          <button 
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold btn-hero"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              toast.success('Showing all companies! 🌟');
            }}
          >
            🌟 Explore All Companies
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyPractice;