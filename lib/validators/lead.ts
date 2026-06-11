import { z } from "zod";
import { businessTypes, languages } from "@/lib/db/schema";

export const leadInputSchema = z
  .object({
    business_name: z.string().trim().max(100).optional().nullable(),
    business_type: z.enum(businessTypes),
    business_type_other: z.string().trim().min(1).max(50).optional().nullable(),
    owner_name: z.string().trim().min(2).max(50),
    owner_contact: z.string().trim().min(5).max(100).regex(/^[+()0-9\s-]+$/, "owner_contact must be a phone number"),
    needs_equipment: z.boolean(),
    comment: z.string().trim().max(500).optional().nullable(),
    source: z.string().trim().max(50).optional(),
    utm_source: z.string().trim().max(100).optional().nullable(),
    utm_medium: z.string().trim().max(100).optional().nullable(),
    utm_campaign: z.string().trim().max(100).optional().nullable(),
    language: z.enum(languages),
  })
  .superRefine((data, ctx) => {
    if (data.business_type === "other") {
      if (!data.business_type_other || data.business_type_other.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["business_type_other"],
          message: "business_type_other is required when business_type is 'other'",
        });
      }
    } else if (data.business_type_other) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["business_type_other"],
        message: "business_type_other must be empty unless business_type is 'other'",
      });
    }
  });

export type LeadInput = z.infer<typeof leadInputSchema>;
