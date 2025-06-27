import * as z from 'zod/v4';

export const emailSchema = z.object({
  email: z.email(),
});
