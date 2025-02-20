import { DashboardData, TimeframeOption } from "@/types/analytics.organizer";
import { getSession } from "next-auth/react";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const session = await getSession();

  if (!session?.user?.accessToken) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

// Then use it in your API calls:
export const fetchDashboardData = async (
  organizerId: string,
  timeframe: TimeframeOption
): Promise<DashboardData> => {
  return fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API}/api/analytics/organizer/${organizerId}?timeframe=${timeframe}`
  );
};
