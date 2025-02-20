"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DashboardData, TimeframeOption } from "@/types/analytics.organizer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizer } from "@/context/organizer/OrganizerContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  StatCard,
  EmptyState,
  UpcomingEvents,
  RecentTransactions,
  BestSellingEventCard,
} from "@/components/dashboard/analytics/analyticsEvent";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/utils/api/organizer/dashboard";

const DashboardOrganizerPage: React.FC = () => {
  const { organizerId } = useOrganizer();
  const [timeframe, setTimeframe] = useState<TimeframeOption>("monthly");

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardData", organizerId, timeframe],
    queryFn: () => fetchDashboardData(organizerId as string, timeframe),
    enabled: !!organizerId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Select
          value={timeframe}
          onValueChange={(value: TimeframeOption) => setTimeframe(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>Revenue trends for {timeframe} view</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData.revenueStats.revenueTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={dashboardData.totalEvents.toString()}
          description="Total active events"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardData.revenueStats.totalRevenue)}
          description="Overall revenue"
        />
        <StatCard
          title="Best Selling Event"
          value={dashboardData.bestSellingEvents[0]?.name || "No events"}
          description={
            dashboardData.bestSellingEvents[0]?.salesCount > 0
              ? `${dashboardData.bestSellingEvents[0].salesCount} tickets sold`
              : "No tickets sold"
          }
        />
        <StatCard
          title="Upcoming Events"
          value={dashboardData.upcomingEvents.length.toString()}
          description="Events in next 30 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Events by Category</CardTitle>
            <CardDescription>
              Distribution of events across categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {dashboardData.eventsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.eventsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="_count"
                    fill="#3b82f6"
                    name="Number of Events"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No category data available" />
            )}
          </CardContent>
        </Card>
        <BestSellingEventCard dashboardData={dashboardData} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest ticket sales and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTransactions
            transactions={dashboardData.recentTransactions}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Next scheduled events</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingEvents
            events={dashboardData.upcomingEvents}
            formatDate={formatDate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOrganizerPage;
