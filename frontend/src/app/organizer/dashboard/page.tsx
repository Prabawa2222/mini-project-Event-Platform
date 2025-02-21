"use client";

import React, { useState, useEffect } from "react";
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
import {
  DashboardData,
  EmptyStateProps,
  StatCardProps,
  TimeframeOption,
  Transaction,
  Event, // Add Event type import
} from "@/types/analytics.organizer";
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

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      )}
    </CardContent>
  </Card>
);

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
    <p>{message}</p>
  </div>
);

const BestSellingEventCard: React.FC<{ dashboardData: DashboardData }> = ({
  dashboardData,
}) => {
  const bestEvent = dashboardData.bestSellingEvents[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Best Selling Event</CardTitle>
      </CardHeader>
      <CardContent>
        <StatCard
          title="Best Selling Event"
          value={bestEvent?.name ?? "No events"}
          description={
            bestEvent && bestEvent.salesCount > 0
              ? `${bestEvent.salesCount} tickets sold`
              : "No tickets sold"
          }
        />
      </CardContent>
    </Card>
  );
};

const RecentTransactions: React.FC<{
  transactions: Transaction[];
  formatDate: (date: string) => string;
  formatCurrency: (value: number) => string;
}> = ({ transactions, formatDate, formatCurrency }) => {
  if (transactions.length === 0) {
    return <EmptyState message="No recent transactions" />;
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex justify-between items-center p-4 border rounded-lg"
        >
          <div>
            <div className="font-medium">{transaction.event.name}</div>
            <div className="text-sm text-muted-foreground">
              {transaction.user.name} • {formatDate(transaction.createdAt)}
            </div>
          </div>
          <div>
            <div className="font-medium">
              {formatCurrency(transaction.totalPrice)}
            </div>
            <div
              className={`text-sm ${
                transaction.status === "DONE"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {transaction.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const UpcomingEvents: React.FC<{
  events: Event[];
  formatDate: (date: string) => string;
}> = ({ events, formatDate }) => {
  if (events.length === 0) {
    return <EmptyState message="No upcoming events" />;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between border-b last:border-0 pb-4"
        >
          <div>
            <div className="font-medium">{event.name}</div>
            <div className="text-sm text-muted-foreground">
              {formatDate(event.startDate)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {event._count.transactions} / {event.availableSeats}
            </div>
            <div className="text-sm text-muted-foreground">Tickets Sold</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DashboardOrganizerPage: React.FC = () => {
  const { organizerId } = useOrganizer();
  const [timeframe, setTimeframe] = useState<TimeframeOption>("monthly");
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalEvents: 0,
    eventsByCategory: [],
    revenueStats: {
      totalRevenue: 0,
      revenueTimeSeries: [],
    },
    bestSellingEvents: [],
    upcomingEvents: [],
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/analytics/organizer/${organizerId}?timeframe=${timeframe}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error: any) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [organizerId, timeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
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
