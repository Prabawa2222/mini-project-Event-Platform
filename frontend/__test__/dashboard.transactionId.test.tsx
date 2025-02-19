import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TransactionsIdOrganizerPage from "@/app/organizer/dashboard/transactions/[transactionsId]/page";

//
jest.mock("next/navigation", () => ({
  useParams: () => ({ transactionsId: "123" }),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/context/organizer/OrganizerContext", () => ({
  useOrganizer: () => ({ organizerId: "123" }),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    data: {
      id: 123,
      user: { name: "John Doe" },
      event: { name: "Concert" },
      ticketType: { name: "VIP" },
      quantity: 2,
      totalPrice: 200000,
      status: "WAITING_FOR_ADMIN_CONFIRMATION",
      createdAt: "2024-02-19T10:00:00Z",
      updatedAt: "2024-02-19T10:00:00Z",
      paymentProof: "http://example.com/proof.jpg",
    },
    isLoading: false,
    error: null,
  }),
  useMutation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
}));

describe("TransactionsIdOrganizerPage", () => {
  it("renders transaction details", () => {
    render(<TransactionsIdOrganizerPage />);

    //
    expect(screen.getByText("Transaction Details")).toBeInTheDocument();

    expect(screen.getByText("Customer Information")).toBeInTheDocument();
    expect(screen.getByText("Event Information")).toBeInTheDocument();
    expect(screen.getByText("Payment Information")).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Concert")).toBeInTheDocument();
    expect(screen.getByText("VIP")).toBeInTheDocument();
  });

  it("renders action buttons when status is WAITING_FOR_ADMIN_CONFIRMATION", () => {
    render(<TransactionsIdOrganizerPage />);

    expect(screen.getByText("Approve Transaction")).toBeInTheDocument();
    expect(screen.getByText("Reject Transaction")).toBeInTheDocument();
  });

  it("renders back button", () => {
    render(<TransactionsIdOrganizerPage />);

    expect(screen.getByText("Back to Transactions")).toBeInTheDocument();
  });
});
