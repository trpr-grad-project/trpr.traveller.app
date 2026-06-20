import { z } from "zod";

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .regex(emailRegex, "Please enter a valid email");

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(phoneRegex, "Please enter a valid phone number (10-15 digits)");

export const identifierSchema = z
  .string()
  .min(1, "Email or phone is required")
  .refine(
    (val) => emailRegex.test(val) || phoneRegex.test(val.replace(/\s/g, "")),
    { message: "Please enter a valid email or phone number" },
  );

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Min 8 characters");

export const fullNameSchema = z
  .string()
  .min(1, "Full name is required")
  .min(3, "Min 3 characters");

// Form Schemas

export const loginSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    username: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordEmailSchema = z.object({
  inputValue: emailSchema,
});

export const forgotPasswordPhoneSchema = z.object({
  inputValue: phoneSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Inferred Types

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
