import { z } from "zod";

// Order = order of the pills in the form. Labels: contact.form.types.<value>.
export const CONTACT_TYPES = ["website", "dashboard", "erp", "automation", "other"] as const;

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().trim().min(1).max(120),
  type: z.enum(CONTACT_TYPES),
  message: z.string().min(20),
});

export type ContactInput = z.infer<typeof contactSchema>;
