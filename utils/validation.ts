import { z } from "zod";

const emailRegex = /^\S+@\S+\.\S+$/;

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .regex(emailRegex, "Please enter a valid email");

export const identifierSchema = z
  .string()
  .min(1, "Email is required")
  .regex(emailRegex, "Please enter a valid email");

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Min 8 characters");

// Form Schemas

export const loginSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
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

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  phone: z.string().min(1, "Phone number is required"),
  dob: z.string().min(1, "Date of birth is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const contactSupportSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
});

export const reportProblemSchema = z.object({
  issueType: z.string().min(1, "Please select an issue type"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
});

export const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  bio: z.string().optional(),
});

// Inferred Types

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ContactSupportFormData = z.infer<typeof contactSupportSchema>;
export type ReportProblemFormData = z.infer<typeof reportProblemSchema>;
export type EditProfileFormData = z.infer<typeof editProfileSchema>;
