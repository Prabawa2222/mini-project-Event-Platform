import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EventDetailsPage from "@/app/organizer/dashboard/events/[slug]/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ slug: "test-event" }),
  useRouter: () => ({ push: jest.fn() }),
}));

const mockEvent = {
  slug: "test-event",
  name: "Test Concert",
  description: "A great concert event",
  imageUrl: "/test-image.jpg",
  startDate: "2024-03-01T19:00:00Z",
  endDate: "2024-03-01T23:00:00Z",
  location: "Test Venue",
  category: "Music",
  ticketTypes: [
    {
      id: 1,
      name: "VIP",
      price: 100,
      quantity: 50,
      description: "VIP access",
    },
  ],
  promotions: [
    {
      id: 1,
      code: "PROMO10",
      discount: 10,
      startDate: "2024-02-01T00:00:00Z",
      endDate: "2024-03-01T00:00:00Z",
      currentUses: 5,
      maxUses: 100,
    },
  ],
  reviews: [],
};

jest.mock("@tanstack/react-query", () => ({
  useQuery: ({ queryKey }: any) => {
    if (queryKey[0] === "event") {
      return {
        data: mockEvent,
        isLoading: false,
      };
    }
    if (queryKey[0] === "eventAttendees") {
      return {
        data: {
          total: 10,
          data: [],
        },
      };
    }
    return {
      data: null,
      isLoading: false,
    };
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("Event Details Page", () => {
  it("should render event details correctly", () => {
    render(<EventDetailsPage />);

    expect(screen.getByText("Test Concert")).toBeInTheDocument();
    expect(screen.getByText("Test Venue")).toBeInTheDocument();
    expect(screen.getByText("Music")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /edit event/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to events/i })
    ).toBeInTheDocument();
  });
});
