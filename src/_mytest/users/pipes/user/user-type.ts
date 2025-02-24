import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string(),
});

export type createUserDto = z.infer<typeof createUserSchema>;
