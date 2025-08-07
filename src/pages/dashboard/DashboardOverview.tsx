import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  Users, 
  Code, 
  Zap, 
  Target, 
  BookOpen, 
  Brain, 
  Activity 
} from 'lucide-react';
import { useDashboardStats, useActivities } from '@/hooks/useApi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


// Helper component for stat cards
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color 
}) => {
  // All icons are properly imported from lucide-react

  return (
    <Card className="p-4 text-center bg-background/50">
      <div className={`text-2xl font-bold ${color} flex items-center justify-center gap-2`}>
        <Icon className="w-5 h-5" />
        {value}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{title}</div>
    </Card>
  );
};

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [challengeLoading, setChallengeLoading] = useState(false);

  // Icons are properly imported from lucide-react

  // Daily challenge types
  const challengeTypes = [
    {
      id: 'coding',
      title: 'Coding Challenge',
      description: 'Solve algorithmic problems',
      icon: Code,
      color: 'text-blue-500',
      route: '/dashboard/coding'
    },
    {
      id: 'mcq',
      title: 'MCQ Challenge',
      description: 'Test your knowledge',
      icon: BookOpen,
      color: 'text-green-500',
      route: '/dashboard/mcqs'
    },
    {
      id: 'mock',
      title: 'Mock Interview',
      description: 'Practice interviews',
      icon: Brain,
      color: 'text-purple-500',
      route: '/dashboard/face-to-face'
    }
  ];

  const startDailyChallenge = async () => {
    setChallengeLoading(true);
    try {
      // Simulate challenge selection logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Randomly select a challenge type or use logic based on user progress
      const randomChallenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
      
      toast.success(`Starting ${randomChallenge.title}!`);
      navigate(randomChallenge.route);
    } catch (error) {
      toast.error('Failed to start challenge. Please try again.');
    } finally {
      setChallengeLoading(false);
    }
  };



  // Fetch dashboard stats (only if API key is set)
  const { 
    data: stats, 
    isLoading: isLoadingStats, 
    error: statsError,
    refetch: refetchStats
  } = useDashboardStats({
    onError: (err) => {
      console.error('Failed to fetch dashboard stats:', err);
    }
  });

  // Fetch recent activities (only if API key is set)
  const { 
    data: activities = [], 
    isLoading: isLoadingActivities, 
    error: activitiesError,
    refetch: refetchActivities
  } = useActivities({
    onError: (err) => {
      console.error('Failed to fetch activities:', err);
    }
  });

  const isLoading = isLoadingStats || isLoadingActivities;
  const error = statsError || activitiesError;

  // Default values
  const defaultStats = {
    problemsSolved: 0,
    dayStreak: 0,
    successRate: 0,
    companiesCount: 0
  };

  const displayStats = stats || defaultStats;
  const userName = 'there'; // Default username

  // Format activity time
  const formatActivityTime = (timeString: string) => {
    try {
      return formatDistanceToNow(new Date(timeString), { addSuffix: true });
    } catch (e) {
      return timeString;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard data. Please try again later.
          <br />
          <small>Error: {error.message}</small>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="p-6 bg-gradient-to-r from-background/80 to-background/50 backdrop-blur-sm border border-border/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your interview preparation journey?
            </p>
          </div>
          <Button 
            className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white"
            onClick={startDailyChallenge}
            disabled={challengeLoading}
          >
            {challengeLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Starting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" /> Start Daily Challenge
              </>
            )}
          </Button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard 
            title="Problems Solved" 
            value={displayStats.problemsSolved || 0} 
            icon={Code} 
            color="text-green-500" 
          />
          <StatCard 
            title="Day Streak" 
            value={displayStats.dayStreak || 0} 
            icon={Clock} 
            color="text-yellow-500" 
          />
          <StatCard 
            title="Success Rate" 
            value={`${displayStats.successRate || 0}%`} 
            icon={CheckCircle} 
            color="text-blue-500" 
          />
          <StatCard 
            title="Companies" 
            value={displayStats.companiesCount || 0} 
            icon={Users} 
            color="text-purple-500" 
          />
        </div>
      </Card>

      {/* Quick Challenge Options */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Quick Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challengeTypes.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => navigate(challenge.route)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <challenge.icon className={`w-6 h-6 ${challenge.color}`} />
                  <h3 className="font-semibold">{challenge.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                <Button size="sm" variant="outline" className="w-full">
                  Start Challenge
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      <Code className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.status === 'completed' ? 'Completed' : 'In Progress'} • {formatActivityTime(activity.time)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">System Design Mock Interview</h4>
                    <p className="text-sm text-muted-foreground">
                      Scheduled for {new Date(Date.now() + 86400000).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30">
                    Upcoming
                  </Badge>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Data Structures Practice</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() + 2 * 86400000).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30">
                    Study Session
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
