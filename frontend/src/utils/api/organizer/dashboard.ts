import { DashboardData, TimeframeOption } from "@/types/analytics.organizer";
import { getSession } from "next-auth/react";

export const fetchDashboardData = async (
  organizerId: string,
  timeframe: TimeframeOption
): Promise<DashboardData> => {
  const session = await getSession();

  if (!session?.user?.accessToken) {
    throw new Error("No authentication token available");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/api/analytics/organizer/${organizerId}?timeframe=${timeframe}`,
    {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return response.json();
};
