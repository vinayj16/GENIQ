import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Download, Calendar, TrendingUp, Target } from 'lucide-react';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [exportLoading, setExportLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    performance: {
      week: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [72, 68, 85, 79],
      },
      year: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [65, 72, 68, 85, 79, 88, 92, 87, 90, 85, 82, 89],
      },
    },
    stats: {
      week: {
        totalProblems: 12,
        accuracy: 85,
        averageTime: 25,
        streak: 7,
        improvement: '+15%',
      },
      month: {
        totalProblems: 48,
        accuracy: 78,
        averageTime: 28,
        streak: 7,
        improvement: '+8%',
      },
      year: {
        totalProblems: 365,
        accuracy: 82,
        averageTime: 26,
        streak: 7,
        improvement: '+22%',
      },
    },
    categories: {
      labels: ['Arrays', 'Strings', 'Trees', 'Graphs', 'DP', 'Others'],
      data: [25, 20, 18, 15, 12, 10],
      colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
    },
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // TODO: Uncomment when API is ready
        // const data = await apiService.getAnalytics({ timeRange });
        // setAnalyticsData(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch analytics data');
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, [timeRange]);

  const exportReport = async () => {
    setExportLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create CSV data
      const currentStats = analyticsData.stats[timeRange as keyof typeof analyticsData.stats];
      const currentPerformance = analyticsData.performance[timeRange as keyof typeof analyticsData.performance];
      
      const csvData = [
        ['Metric', 'Value'],
        ['Time Range', timeRange.charAt(0).toUpperCase() + timeRange.slice(1)],
        ['Total Problems', currentStats.totalProblems.toString()],
        ['Accuracy', `${currentStats.accuracy}%`],
        ['Average Time', `${currentStats.averageTime} minutes`],
        ['Current Streak', `${currentStats.streak} days`],
        ['Improvement', currentStats.improvement],
        [''],
        ['Performance Data', ''],
        ...currentPerformance.labels.map((label, index) => [label, currentPerformance.data[index].toString()])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExportLoading(false);
    }
  };

  const currentPerformance = analyticsData.performance[timeRange as keyof typeof analyticsData.performance];
  const currentStats = analyticsData.stats[timeRange as keyof typeof analyticsData.stats];

  const chartData = {
    labels: currentPerformance.labels,
    datasets: [{
      label: 'Performance Score',
      data: currentPerformance.data,
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
    }],
  };

  const lineChartData = {
    labels: currentPerformance.labels,
    datasets: [{
      label: 'Progress Trend',
      data: currentPerformance.data,
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };

  const doughnutData = {
    labels: analyticsData.categories.labels,
    datasets: [{
      data: analyticsData.categories.data,
      backgroundColor: analyticsData.categories.colors,
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { 
        display: true, 
        text: `Performance - ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}` 
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
      title: { display: true, text: 'Problem Categories' },
    },
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">📈 Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  This Week
                </div>
              </SelectItem>
              <SelectItem value="month">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  This Month
                </div>
              </SelectItem>
              <SelectItem value="year">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  This Year
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="btn-premium" 
            onClick={exportReport}
            disabled={exportLoading}
          >
            {exportLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                📊 Export Report
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Total Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalProblems}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {currentStats.improvement} from last period
            </p>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.accuracy}%</div>
            <Progress value={currentStats.accuracy} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.averageTime}m</div>
            <p className="text-xs text-muted-foreground">per problem</p>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.streak} days</div>
            <p className="text-xs text-muted-foreground">🔥 Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 card-elevated">
          <div className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )}
          </div>
        </Card>
        <Card className="p-6 card-elevated">
          <div className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Line data={lineChartData} options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'Progress Trend'}}}} />
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 card-elevated">
          <div className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            )}
          </div>
        </Card>
        <Card className="p-6 card-elevated">
          <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Strong Performance</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your accuracy is {currentStats.improvement} better than last {timeRange}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Focus Areas</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Consider practicing more Dynamic Programming problems
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800 dark:text-purple-200">Consistency</span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                You've maintained a {currentStats.streak}-day streak! Keep it up!
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {item % 2 === 0 ? '✅' : '📝'}
                </div>
                <div>
                  <p className="font-medium">
                    {item % 2 === 0 ? 'Completed' : 'Started'} {['Arrays', 'DP', 'Graphs', 'Trees'][item - 1]} practice
                  </p>
                  <p className="text-sm text-muted-foreground">{item * 2}h ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Tips</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span>🔍</span>
              <span>Focus on your weak areas: <strong>Dynamic Programming</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span>⏱️</span>
              <span>Try to reduce your average solving time</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📊</span>
              <span>Your accuracy is better than 75% of users</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🎯</span>
              <span>You're on track to reach your weekly goal</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
