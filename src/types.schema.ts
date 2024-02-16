import { z } from "zod";

export const EventSchema = z.object({
  owner: z.string(),

  title: z.string(),
  description: z.string().optional(),

  start: z.date().optional(),
  end: z.date().optional(),
});
export type EventSchemaType = z.infer<typeof EventSchema>;

export const EventItemSchema = z.object({
  type: z.union([z.literal("poll"), z.literal("bill"), z.literal("list")]),
  title: z.string(),
  description: z.string().optional(),

  expiry: z.date().optional(),
});
export type EventItemSchemaType = z.infer<typeof EventItemSchema>;

export const PollSchema = EventItemSchema.extend({});
export const PollOptionSchema = z.object({
  label: z.string(),
  link: z.string().optional().default(""),
});
export const PollVoterSchema = z.object({
  userId: z.string(),
  optionId: z.string(),
});

export type PollSchemaType = z.infer<typeof PollSchema>;
export type PollOptionSchemaType = z.infer<typeof PollOptionSchema>;
export type PollVoterSchemaType = z.infer<typeof PollVoterSchema>;

export const BillPaymentDetailsSchema = z.object({
  totalOwed: z.number().transform(Number),
  currency: z.string().optional(),

  accountPayeeName: z.string(),
  sortCode: z.string().regex(/\d{2}-\d{2}-\d{2}/gm),
  accountNumber: z.string().length(8),
});
export const BillSchema = EventItemSchema.and(BillPaymentDetailsSchema);
export const BillPaymentSchema = z.object({
  userId: z.string(),
  quantity: z.number().transform(Number),
});

export type BillSchemaType = z.infer<typeof BillSchema>;
export type BillPaymentDetailsSchemaType = z.infer<
  typeof BillPaymentDetailsSchema
>;
export type BillPaymentSchemaType = z.infer<typeof BillPaymentSchema>;

export const ListSchema = EventItemSchema.extend({});
export const ListItemSchema = z.object({
  title: z.string(),
  quantity: z.number().optional(),

  status: z.union([z.literal("pending"), z.literal("done")]).default("pending"),
});

export type ListSchemaType = z.infer<typeof ListSchema>;
export type ListItemSchemaType = z.infer<typeof ListItemSchema>;
