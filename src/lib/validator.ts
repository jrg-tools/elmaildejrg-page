import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email obligatorio')
    .email('Email inválido')
    .max(254, 'Email demasiado largo'),
});
