import { BookOpen, FileText, TrendingUp, Users } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock stats - will be replaced with API data
  const stats = [
    {
      title: 'Total Courses',
      value: 24,
      description: 'Active courses',
      icon: BookOpen,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Total Pages',
      value: 18,
      description: 'Published pages',
      icon: FileText,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Draft Content',
      value: 6,
      description: 'Pending review',
      icon: TrendingUp,
      trend: { value: 3, isPositive: false },
    },
    {
      title: 'Total Users',
      value: 1247,
      description: 'Active learners',
      icon: Users,
      trend: { value: 18, isPositive: true },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 shadow-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button
            onClick={() => navigate('/courses/new')}
            className="h-auto flex-col items-start gap-2 p-4"
          >
            <BookOpen className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Add Course</div>
              <div className="text-xs font-normal opacity-90">Create a new course card</div>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/pages/new')}
            className="h-auto flex-col items-start gap-2 p-4"
            variant="secondary"
          >
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Add Page</div>
              <div className="text-xs font-normal opacity-90">Create a new landing page</div>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/courses')}
            className="h-auto flex-col items-start gap-2 p-4"
            variant="outline"
          >
            <TrendingUp className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">View All</div>
              <div className="text-xs font-normal">Browse all content</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 shadow-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Created', item: 'Data Science Course', time: '2 hours ago' },
            { action: 'Updated', item: 'AI & ML Landing Page', time: '5 hours ago' },
            { action: 'Published', item: 'Web Development Course', time: '1 day ago' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {activity.action} <span className="text-primary">{activity.item}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
