import { LucideIcon } from "lucide-react";

export interface CategoryCount {
  _count: number;
  category: string;
}

export interface BestSellingEvent {
  name: string;
  salesCount: number;
}

export interface UpcomingEvent {
  name: string;
  startDate: string;
  availableSeats: number;
  _count: {
    transactions: number;
  };
}

export interface DashboardStatistics {
  totalEvents: number;
  eventsByCategory: CategoryCount[];
  totalRevenue: number;
  bestSellingEvents: BestSellingEvent[];
  upcomingEvents: UpcomingEvent[];
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export interface EmptyStateProps {
  message: string;
}

export interface CategoryDataPoint {
  name: string;
  events: number;
}

export type TimeframeOption = "daily" | "weekly" | "monthly";
