import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  type: z.enum(["job", "freelance", "other"]),
  message: z.string().min(20),
});

export type ContactInput = z.infer<typeof contactSchema>;
