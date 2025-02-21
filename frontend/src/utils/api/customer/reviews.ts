import { Review } from "@/types/review";

export const reviewService = {
  async createReview(
    userId: number,
    eventId: number,
    rating: number,
    comment: string
  ): Promise<Review> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/review/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, eventId, rating, comment }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit review");
    }

    return response.json();
  },

  async getEventReviews(eventId: number): Promise<Review[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/review/event/${eventId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch event reviews");
    }

    return response.json();
  },

  async getOrganizerReviews(organizerId: number): Promise<Review[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/review/organizer/${organizerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch organizer reviews");
    }

    return response.json();
  },
};
