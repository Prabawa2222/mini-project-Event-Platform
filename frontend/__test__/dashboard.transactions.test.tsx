import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TransactionsOrganizerPage from "@/app/organizer/dashboard/transactions/page";

jest.mock("@/context/organizer/OrganizerContext", () => ({
  useOrganizer: () => ({ organizerId: "123" }),
}));

const mockTransactions = [
  {
    id: 1,
    user: { name: "John Doe" },
    event: { name: "Concert" },
    ticketType: { name: "VIP" },
    quantity: 2,
    totalPrice: 200000,
    status: "PENDING",
  },
];

jest.mock("@tanstack/react-query", () => ({
  useQuery: ({ queryKey }: any) => {
    if (queryKey[0] === "transactionsSummary") {
      return {
        data: {
          overallSummary: {
            totalRevenue: 1000000,
            totalTransactions: 10,
            totalTicketsSold: 20,
          },
        },
        isLoading: false,
      };
    }
    if (queryKey[0] === "pendingTransactions") {
      return {
        data: {
          data: mockTransactions,
        },
        isLoading: false,
      };
    }

    return {
      data: mockTransactions,
      isLoading: false,
    };
  },
}));

describe("TransactionsOrganizerPage", () => {
  it("renders the main elements", () => {
    render(<TransactionsOrganizerPage />);

    expect(screen.getByText("Transactions Management")).toBeInTheDocument();

    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Total Transactions")).toBeInTheDocument();

    expect(
      screen.getByRole("tab", { name: /all transactions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /pending approval/i })
    ).toBeInTheDocument();
  });
});
