import { z } from "zod";

export const moderationSchema = z.object({
  status: z.enum(["included", "excluded", "flagged", "pending"]),
  reasonCode: z.string().min(1).max(120),
});

export type ModerationInput = z.infer<typeof moderationSchema>;
