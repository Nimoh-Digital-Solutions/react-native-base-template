import { z } from 'zod';

export const loginSchema = z.object({
  email_or_username: z.string().trim().min(1, 'Email or username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerBaseSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, 'Username must be at least 2 characters')
      .max(150)
      .refine((v) => !v.includes('@'), { message: 'Username cannot contain @' })
      .refine((v) => !v.includes(' '), { message: 'Username cannot contain spaces' }),
    first_name: z.string().trim().max(150),
    last_name: z.string().trim().max(150),
    email: z.string().trim().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirm: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Passwords do not match',
    path: ['password_confirm'],
  });

export type RegisterBaseInput = z.infer<typeof registerBaseSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'New password must be at least 8 characters'),
    confirm_new_password: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'Passwords do not match',
    path: ['confirm_new_password'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
