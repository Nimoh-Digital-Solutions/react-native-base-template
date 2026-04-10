import { z } from 'zod';

export const loginUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string().optional(),
  first_name: z.string(),
  last_name: z.string(),
  email_verified: z.boolean().optional(),
});

export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  token_type: z.string(),
  expires_in: z.number(),
  user: loginUserSchema,
});

export type LoginResponseFromSchema = z.infer<typeof loginResponseSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string().optional(),
  email_verified: z.boolean().optional(),
  role: z.enum(['user', 'admin']).nullable(),
  avatar: z.string().optional(),
});

export type UserFromSchema = z.infer<typeof userSchema>;

export const registerResponseSchema = z.object({
  message: z.string(),
  user_id: z.string(),
  email: z.string(),
});

export type RegisterResponseFromSchema = z.infer<typeof registerResponseSchema>;

export const tokenRefreshResponseSchema = z.object({
  access: z.string(),
  refresh: z.string().optional(),
});

export type TokenRefreshResponseFromSchema = z.infer<typeof tokenRefreshResponseSchema>;
