import { z } from "zod";

export const EventSchema = z.object({
  type: z.union([z.literal("poll"), z.literal("bill"), z.literal("list")]),
  title: z.string(),
  description: z.string().optional(),
});
export type EventSchemaType = z.infer<typeof EventSchema>;

export const PollSchema = EventSchema.extend({});
export const PollOptionSchema = z.object({
  label: z.string(),
  link: z.string().optional(),
});
export const PollVoterSchema = z.object({
  userId: z.string(),
});

export type PollSchemaType = z.infer<typeof PollSchema>;
export type PollOptionSchemaType = z.infer<typeof PollOptionSchema>;
export type PollVoterSchemaType = z.infer<typeof PollVoterSchema>;

export const BillSchema = EventSchema.extend({
  totalOwed: z.number(),
  currency: z.string(),
});
export const BillPaymentSchema = z.object({
  quantity: z.number(),
});

export type BillSchemaType = z.infer<typeof BillSchema>;
export type BillPaymentSchemaType = z.infer<typeof BillPaymentSchema>;

export const ListSchema = EventSchema.extend({});
export const ListItemSchema = z.object({
  title: z.string(),
  quantity: z.number().optional(),

  status: z.union([z.literal("pending"), z.literal("done")]),
});

export type ListSchemaType = z.infer<typeof ListSchema>;
export type ListItemSchemaType = z.infer<typeof ListItemSchema>;
