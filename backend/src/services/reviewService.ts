import { PrismaClient } from "@prisma/client";

export class ReviewService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createReview(
    userId: number,
    eventId: number,
    rating: number,
    comment: string
  ) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        userId,
        eventId,
        status: "DONE",
      },
    });

    if (!transaction)
      throw new Error("You can only leave a review after attending the event.");

    const review = await this.prisma.review.create({
      data: {
        userId,
        eventId,
        rating,
        comment,
      },
    });

    return review;
  }

  async getEventReviews(eventId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    return reviews;
  }

  async getOrganizerReviews(organizerId: number) {
    const reviews = await this.prisma.event.findMany({
      where: { organizerId },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    return reviews;
  }
}
