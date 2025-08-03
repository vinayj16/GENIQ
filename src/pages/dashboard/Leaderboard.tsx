import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award, Star, TrendingUp, Users, Calendar, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const Leaderboard = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all-time');
  const [globalLeaderboard, setGlobalLeaderboard] = useState([
    {
      rank: 1,
      name: "CodeNinja",
      avatar: null,
      points: 2450,
      problemsSolved: 387,
      streak: 45,
      rating: 2156,
      country: "🇺🇸 USA",
      badge: "Grandmaster"
    },
    {
      rank: 2,
      name: "AlgoMaster",
      avatar: null,
      points: 2380,
      problemsSolved: 356,
      streak: 32,
      rating: 2089,
      country: "🇮🇳 India",
      badge: "Master"
    },
    {
      rank: 3,
      name: "ByteWizard",
      avatar: null,
      points: 2290,
      problemsSolved: 298,
      streak: 28,
      rating: 1998,
      country: "🇨🇳 China",
      badge: "Master"
    },
    {
      rank: 4,
      name: "You",
      avatar: null,
      points: 1850,
      problemsSolved: 143,
      streak: 7,
      rating: 1456,
      country: "🇮🇳 India",
      badge: "Expert",
      isCurrentUser: true
    }
  ]);

  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState([
    {
      rank: 1,
      name: "FastCoder",
      avatar: null,
      points: 340,
      problemsSolved: 28,
      country: "🇰🇷 Korea"
    },
    {
      rank: 2,
      name: "QuickSolve",
      avatar: null,
      points: 315,
      problemsSolved: 25,
      country: "🇯🇵 Japan"
    },
    {
      rank: 3,
      name: "You",
      avatar: null,
      points: 280,
      problemsSolved: 21,
      country: "🇮🇳 India",
      isCurrentUser: true
    }
  ]);

  const [contestHistory, setContestHistory] = useState([
    {
      id: 1,
      name: "Weekly Contest 387",
      date: "2024-01-20",
      rank: 1247,
      participants: 15420,
      score: 12,
      problems: 4
    },
    {
      id: 2,
      name: "Biweekly Contest 123",
      date: "2024-01-13",
      rank: 892,
      participants: 12380,
      score: 18,
      problems: 4
    }
  ]);

  const refreshLeaderboard = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Shuffle rankings slightly to simulate real updates
      const shuffled = [...globalLeaderboard].map(user => ({
        ...user,
        points: user.points + Math.floor(Math.random() * 20) - 10,
        problemsSolved: user.problemsSolved + Math.floor(Math.random() * 3)
      }));
      
      setGlobalLeaderboard(shuffled);
      toast.success('Leaderboard updated!');
    } catch (error) {
      toast.error('Failed to refresh leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const joinContest = () => {
    toast.success('Contest registration opened! Check your email for details.');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold w-5 text-center">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Grandmaster': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'Master': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'Expert': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'Specialist': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Leaderboard 🏆</h1>
          <p className="text-muted-foreground">See how you rank among the community</p>
        </div>
        <div className="flex gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="country">My Country</SelectItem>
              <SelectItem value="friends">Friends</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={refreshLeaderboard}
            disabled={loading}
            className="btn-premium"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button onClick={joinContest} className="btn-hero">
            <Users className="h-4 w-4 mr-2" />
            Join Contest
          </Button>
        </div>
      </div>

      {/* Your Stats */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Your Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">1,456</div>
              <div className="text-sm text-muted-foreground">Rating</div>
              <Badge variant="outline" className={getBadgeColor('Expert')}>Expert</Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-success">#4</div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
              <div className="flex items-center justify-center gap-1 text-success text-sm">
                <TrendingUp className="h-3 w-3" />
                +12 this week
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-warning">143</div>
              <div className="text-sm text-muted-foreground">Problems Solved</div>
              <Progress value={72} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-info">7</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
              <div className="text-xs text-muted-foreground">Keep it up! 🔥</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="contests">Contests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="mt-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {globalLeaderboard.map((user) => (
                  <div 
                    key={user.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                      user.isCurrentUser 
                        ? 'bg-primary/10 border-primary/30 shadow-md' 
                        : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${user.isCurrentUser ? 'text-primary' : ''}`}>
                          {user.name}
                        </h3>
                        <span className="text-sm text-muted-foreground">{user.country}</span>
                        <Badge variant="outline" className={getBadgeColor(user.badge)}>
                          {user.badge}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Rating: <span className="font-medium">{user.rating}</span></span>
                        <span>Problems: <span className="font-medium">{user.problemsSolved}</span></span>
                        <span>Streak: <span className="font-medium">{user.streak} days</span></span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{user.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Weekly Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyLeaderboard.map((user) => (
                  <div 
                    key={user.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                      user.isCurrentUser 
                        ? 'bg-primary/10 border-primary/30 shadow-md' 
                        : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${user.isCurrentUser ? 'text-primary' : ''}`}>
                          {user.name}
                        </h3>
                        <span className="text-sm text-muted-foreground">{user.country}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Problems solved this week: <span className="font-medium">{user.problemsSolved}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{user.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contests" className="mt-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Contest History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contestHistory.map((contest) => (
                  <div key={contest.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <h3 className="font-semibold">{contest.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{contest.date}</span>
                        <span>Rank: #{contest.rank}</span>
                        <span>Participants: {contest.participants.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{contest.score}</div>
                      <div className="text-xs text-muted-foreground">{contest.problems} problems</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Button className="btn-premium">
                  <Calendar className="h-4 w-4 mr-2" />
                  Join Next Contest
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;