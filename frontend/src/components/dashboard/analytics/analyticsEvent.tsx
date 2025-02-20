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

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
}) => (
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

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
    <p>{message}</p>
  </div>
);

export const BestSellingEventCard: React.FC<{
  dashboardData: DashboardData;
}> = ({ dashboardData }) => {
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

export const RecentTransactions: React.FC<{
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

export const UpcomingEvents: React.FC<{
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
