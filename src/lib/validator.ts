import * as z from 'zod/v4';

export const emailSchema = z.object({
  email: z.email(),
});

export const slugSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(
      /^[\w.-]+$/,
      'Slug can only contain letters, numbers, hyphens (-), underscores (_), and dots (.)',
    ),
});
