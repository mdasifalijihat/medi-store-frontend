import { User } from "../../types";
import { z } from "zod";

export const login = (token: string, user: User) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// export const getUser = (): User | null => {
//   const user = localStorage.getItem("user");
//   return user ? (JSON.parse(user) as User) : null;
// };

// export const getToken = (): string | null => localStorage.getItem("token");

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  if (!user || user === "undefined") return null;

  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6),
    role: z.enum(["CUSTOMER", "SELLER"], {
      message: "Role is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
