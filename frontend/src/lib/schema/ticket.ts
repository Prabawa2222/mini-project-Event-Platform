import * as z from "zod";

export const ticketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  description: z.string().optional(),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
