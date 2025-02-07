import * as z from "zod";
import { ticketSchema } from "./ticket";
import { promotionSchema } from "./promotions";

export const createEventSchema = z
  .object({
    organizerId: z.number(),
    name: z.string().min(1, "Event name is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    location: z.string().min(1, "Location is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    category: z.enum(
      [
        "MUSIC",
        "SPORTS",
        "TECHNOLOGY",
        "BUSINESS",
        "EDUCATION",
        "ENTERTAINMENT",
        "GENERAL",
        "OTHER",
      ],
      {
        required_error: "Please select a category",
      }
    ),
    ticketTypes: z
      .array(ticketSchema)
      .min(1, "At least one ticket type is required"),
    promotions: z.array(promotionSchema).optional(),
    image: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
