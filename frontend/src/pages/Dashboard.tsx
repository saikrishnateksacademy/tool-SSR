import { BookOpen, FileText, TrendingUp, Users } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { statsAPI } from "@/api";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 shadow-card">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="space-y-2 mt-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <Card className="p-6 shadow-card">
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </Card>

      {/* Recent Activity Skeleton */}
      <Card className="p-6 shadow-card">
        <Skeleton className="h-7 w-36 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await statsAPI.getDashboard();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache retention (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch on tab switch
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = [
    {
      title: "Total Courses",
      value: statsData?.courses.total || 0,
      description: "Active courses",
      icon: BookOpen,
      trend: { value: 0, isPositive: true }, // Trends require historical data, keeping 0 for now
    },
    {
      title: "Total Pages",
      value: statsData?.pages.total || 0,
      description: "Published pages",
      icon: FileText,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Draft Courses",
      value: statsData?.courses.draft || 0,
      description: "Pending review",
      icon: TrendingUp,
      trend: { value: 0, isPositive: false },
    },
    {
      title: "Published Pages",
      value: statsData?.pages.published || 0,
      description: "Live pages",
      icon: Users, // Using Users icon for now, maybe change later
      trend: { value: 0, isPositive: true },
    },
  ];

  // Merge and sort recent activity
  const recentActivity = [
    ...(statsData?.recentCourses.map((c) => ({
      type: "Course",
      title: c.programTitle,
      date: c.createdAt,
      status: c.meta.status,
    })) || []),
    ...(statsData?.recentPages.map((p) => ({
      type: "Page",
      title: p.title,
      date: p.createdAt,
      status: p.status,
    })) || []),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button
            onClick={() => navigate("/courses/new")}
            className="h-auto flex-col items-start gap-2 p-4"
          >
            <BookOpen className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Add Course</div>
              <div className="text-xs font-normal opacity-90">
                Create a new course card
              </div>
            </div>
          </Button>
          <Button
            onClick={() => navigate("/pages/new")}
            className="h-auto flex-col items-start gap-2 p-4"
            variant="secondary"
          >
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Add Page</div>
              <div className="text-xs font-normal opacity-90">
                Create a new landing page
              </div>
            </div>
          </Button>
          <Button
            onClick={() => navigate("/courses")}
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
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {activity.type}{" "}
                    <span className="text-primary">{activity.title}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.date), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                  {activity.status}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No recent activity.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
