import { DashboardData, TimeframeOption } from "@/types/analytics.organizer";

export const fetchDashboardData = async (
  organizerId: string,
  timeframe: TimeframeOption
): Promise<DashboardData> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/analytics/organizer/${organizerId}?timeframe=${timeframe}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return response.json();
};
