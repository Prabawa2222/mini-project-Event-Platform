export interface Event {
  id: string;
  name: string;
  startDate: string;
  availableSeats: number;
  _count: {
    transactions: number;
  };
}

export interface Transaction {
  id: string;
  totalPrice: number;
  status: "PENDING" | "DONE";
  createdAt: string;
  event: {
    name: string;
  };
  user: {
    name: string;
  };
}

export interface BestSellingEvent {
  id: string;
  name: string;
  salesCount: number;
}

export interface CategoryDataPoint {
  category: string;
  _count: number;
}

export interface RevenueTimeSeries {
  period: string;
  amount: number;
}

export interface RevenueStats {
  totalRevenue: number;
  revenueTimeSeries: RevenueTimeSeries[];
}

export interface DashboardData {
  totalEvents: number;
  eventsByCategory: CategoryDataPoint[];
  revenueStats: RevenueStats;
  bestSellingEvents: BestSellingEvent[];
  upcomingEvents: Event[];
  recentTransactions: Transaction[];
}

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export interface EmptyStateProps {
  message: string;
}

export type TimeframeOption = "daily" | "weekly" | "monthly";
