import { PrismaClient } from "@prisma/client";

export const searchEvents = (prisma: PrismaClient, searchParams: any) => {
  const where: any = {};

  if (searchParams.name) {
    where.name = {
      contains: searchParams.name,
      mode: "insensitive", // Case-insensitive search
    };
  }

  if (searchParams.category) {
    where.category = {
      contains: searchParams.category,
      mode: "insensitive",
    };
  }

  if (searchParams.location) {
    where.location = {
      contains: searchParams.location,
      mode: "insensitive",
    };
  }

  if (searchParams.startDate && searchParams.endDate) {
    where.startDate = {
      gte: searchParams.startDate,
      lte: searchParams.endDate,
    };
  } else if (searchParams.startDate) {
    where.startDate = {
      gte: searchParams.startDate,
    };
  } else if (searchParams.endDate) {
    where.endDate = {
      lte: searchParams.endDate,
    };
  }

  return prisma.event.findMany({
    where: where,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      startDate: true,
      category: true,
      location: true,
      slug: true,
      deletedAt: true,
    },
  });
};
