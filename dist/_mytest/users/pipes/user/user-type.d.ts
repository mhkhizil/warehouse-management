import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name?: string;
    email?: string;
    age?: number;
}, {
    name?: string;
    email?: string;
    age?: number;
}>;
export type createUserDto = z.infer<typeof createUserSchema>;
