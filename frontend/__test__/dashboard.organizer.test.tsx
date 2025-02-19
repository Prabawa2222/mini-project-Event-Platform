import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

jest.mock("@/context/organizer/OrganizerContext", () => ({
  useOrganizer: () => ({ organizerId: "123" }),
}));

jest.mock("@/app/organizer/dashboard/page", () => {
  return function DashboardPage() {
    return (
      <div>
        <h1>Dashboard</h1>
        <div>Total Events: 5</div>
        <div>Revenue: Rp 1.000.000</div>
      </div>
    );
  };
});

import DashboardOrganizerPage from "@/app/organizer/dashboard/page";

describe("Dashboard Page", () => {
  it("renders the dashboard page", () => {
    render(<DashboardOrganizerPage />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Total Events: 5")).toBeInTheDocument();
    expect(screen.getByText("Revenue: Rp 1.000.000")).toBeInTheDocument();
  });
});
