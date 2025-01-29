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
} from "lucide-react";

const dummyStats = {
  totalEvents: 24,
  totalTickets: 1234,
  totalRevenue: 45600000,
  totalAttendees: 892,
  trends: {
    events: 12,
    tickets: 8,
    revenue: -5,
    attendees: 18,
  },
};

const dummyEventData = [
  { name: "Jan", revenue: 4000000, attendees: 240 },
  { name: "Feb", revenue: 3000000, attendees: 198 },
  { name: "Mar", revenue: 2000000, attendees: 150 },
  { name: "Apr", revenue: 2780000, attendees: 190 },
  { name: "May", revenue: 1890000, attendees: 140 },
  { name: "Jun", revenue: 2390000, attendees: 175 },
];

const StatCard = ({ title, value, trend, icon: Icon }) => (
  <Card>
    <CardTitle>{title}</CardTitle>
    <CardContent>
      {trend >= 0 ? (
        <ArrowUpRight className="h-4 w-4 mr-1" />
      ) : (
        <ArrowDownRight className="h-4 w-4 mr-1" />
      )}
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const [timeframe, setTimeframe] = useState("yearly");
  const [statistics, setStatistics] = useState(dummyStats);
  const [eventData, setEventData] = useState(dummyEventData);

  return (
    <div>
      <div>
        <StatCard title="Good" />
      </div>
    </div>
  );
};

export default DashboardPage;
