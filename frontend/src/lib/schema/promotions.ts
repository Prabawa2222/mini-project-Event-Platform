import * as z from "zod";

export const promotionSchema = z
  .object({
    discount: z
      .number()
      .min(0, "Discount must be 0 or greater")
      .max(100, "Discount cannot exceed 100%"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    maxUses: z.number().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "Promotion end date must be after start date",
      path: ["endDate"],
    }
  );

export type PromotionFormValues = z.infer<typeof promotionSchema>;
