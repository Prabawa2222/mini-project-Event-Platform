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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Calendar,
  ChevronDown,
  Ticket,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  CategoryDataPoint,
  DashboardStatistics,
  EmptyStateProps,
  StatCardProps,
  TimeframeOption,
} from "@/types/analytics.organizer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
}) => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="p-2 bg-primary/10 rounded-lg">
        {/* <Icon className="h-5 w-5 text-primary" /> */}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </CardContent>
  </Card>
);

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
    <AlertCircle className="h-8 w-8 mb-2" />
    <p>{message}</p>
  </div>
);

const DashboardOrganizerPage = () => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("monthly");
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    totalEvents: 0,
    eventsByCategory: [],
    totalRevenue: 0,
    bestSellingEvents: [],
    upcomingEvents: [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.BASE_URL}/api/analytics/organizer/1`
        );
        const data: DashboardStatistics = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const categoryData: CategoryDataPoint[] = statistics.eventsByCategory.map(
    (cat) => ({
      name: cat.category,
      events: cat._count,
    })
  );

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={statistics.totalEvents}
          icon={Calendar}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(statistics.totalRevenue)}
          icon={DollarSign}
        />
        <StatCard
          title="Best Selling Event"
          value={statistics.bestSellingEvents[0]?.name || "No events yet"}
          description={
            statistics.bestSellingEvents[0]?.salesCount > 0
              ? `${statistics.bestSellingEvents[0].salesCount} tickets sold`
              : "No tickets sold yet"
          }
          icon={Ticket}
        />
        <StatCard
          title="Upcoming Events"
          value={statistics.upcomingEvents.length}
          description="Events in the next 30 days"
          icon={TrendingUp}
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
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="events"
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

        <Card>
          <CardHeader>
            <CardTitle>Best Selling Events</CardTitle>
            <CardDescription>Events by ticket sales</CardDescription>
          </CardHeader>
          <CardContent>
            {statistics.bestSellingEvents.length > 0 ? (
              <div className="space-y-4">
                {statistics.bestSellingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <span className="font-medium">{event.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {event.salesCount} tickets
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No sales data available" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Next scheduled events</CardDescription>
        </CardHeader>
        <CardContent>
          {statistics.upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {statistics.upcomingEvents.map((event, index) => (
                <div
                  key={index}
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
                    <div className="text-sm text-muted-foreground">
                      Tickets Sold
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No upcoming events" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOrganizerPage;
