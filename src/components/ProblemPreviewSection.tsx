import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProblemPreviewSection = () => {
  const navigate = useNavigate();

  const solveProblem = (problemId: number, title: string, solved: boolean) => {
    if (solved) {
      toast.success(`Revisiting ${title}! 🔄`);
    } else {
      toast.success(`Starting ${title}! 🚀`);
    }
    navigate(`/practice/${problemId}`);
  };

  const startPracticing = () => {
    toast.success('Starting your practice journey! 🎯');
    navigate('/dashboard/coding');
  };

  const filterByDifficulty = (difficulty: string) => {
    if (difficulty === 'All') {
      toast.info('Showing all problems! 📚');
    } else {
      toast.info(`Filtering by ${difficulty} problems! 🔍`);
    }
    navigate(`/dashboard/coding?difficulty=${difficulty.toLowerCase()}`);
  };

  const filterByTopic = () => {
    toast.info('Opening topic filter! 🏷️');
    navigate('/dashboard/coding?filter=topics');
  };

  const filterByCompany = () => {
    toast.info('Opening company filter! 🏢');
    navigate('/companies');
  };

  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      acceptance: "49.2%",
      topics: ["Array", "Hash Table"],
      companies: ["Google", "Amazon", "Apple"],
      solved: true
    },
    {
      id: 2,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      acceptance: "33.8%",
      topics: ["Hash Table", "String", "Sliding Window"],
      companies: ["Amazon", "Microsoft", "Facebook"],
      solved: false
    },
    {
      id: 3,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      acceptance: "36.7%",
      topics: ["Array", "Binary Search", "Divide and Conquer"],
      companies: ["Google", "Amazon"],
      solved: false
    },
    {
      id: 4,
      title: "Valid Parentheses",
      difficulty: "Easy",
      acceptance: "40.1%",
      topics: ["String", "Stack"],
      companies: ["Microsoft", "Amazon", "Google"],
      solved: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/20 text-success border-success/30';
      case 'Medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'Hard': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-primary text-primary-foreground">
              💻 Problem Collection
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Practice with Real Interview Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Over 2000+ carefully curated problems from actual interviews at top tech companies.
              Track your progress and build confidence with every solution.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gradient-card rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Difficulty:</span>
              <div className="flex gap-2">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <Button 
                    key={diff} 
                    variant="outline" 
                    size="sm" 
                    className="btn-premium text-xs"
                    onClick={() => filterByDifficulty(diff)}
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Topics:</span>
              <Button variant="outline" size="sm" className="btn-premium text-xs" onClick={filterByTopic}>
                🏷️ Filter by Topic
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Companies:</span>
              <Button variant="outline" size="sm" className="btn-premium text-xs" onClick={filterByCompany}>
                🏢 Filter by Company
              </Button>
            </div>
          </div>

          {/* Problems List */}
          <div className="space-y-4 mb-12">
            {problems.map((problem) => (
              <div key={problem.id} className="card-elevated hover:card-glow group transition-all duration-300">
                <div className="flex items-center gap-4">
                  {/* Status Indicator */}
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      problem.solved ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {problem.solved ? '✓' : problem.id}
                    </div>
                  </div>

                  {/* Problem Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold group-hover:text-gradient transition-colors">
                        {problem.title}
                      </h3>
                      <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {problem.acceptance} acceptance
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {problem.topics.map((topic) => (
                        <span key={topic} className="px-2 py-1 bg-muted/50 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Asked at:</span>
                      {problem.companies.map((company, index) => (
                        <span key={company}>
                          {company}{index < problem.companies.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <Button 
                      className="btn-hero"
                      onClick={() => solveProblem(problem.id, problem.title, problem.solved)}
                    >
                      {problem.solved ? '🔄 Revisit' : '🚀 Solve'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-elevated text-center">
              <div className="text-3xl font-bold text-gradient mb-2">2000+</div>
              <div className="text-muted-foreground">Total Problems</div>
            </div>
            <div className="card-elevated text-center">
              <div className="text-3xl font-bold text-success mb-2">143</div>
              <div className="text-muted-foreground">Problems Solved</div>
            </div>
            <div className="card-elevated text-center">
              <div className="text-3xl font-bold text-warning mb-2">7.2%</div>
              <div className="text-muted-foreground">Completion Rate</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="btn-hero text-lg px-12 py-6" onClick={startPracticing}>
              🎯 Start Practicing Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemPreviewSection;