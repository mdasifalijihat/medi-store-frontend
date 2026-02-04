"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api"; 
import { login as loginHelper } from "@/lib/auth";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface LoginProps {
  heading?: string;
  logo: {
    url: string;
    src: string;
    alt: string;
    title?: string;
    className?: string;
  };
  buttonText?: string;
  signupText?: string;
  signupUrl?: string;
  className?: string;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = ({
  heading = "Login",
  
  buttonText = "Login",
  signupText = "Need an account?",
  signupUrl = "/signup",
  className,
}: LoginProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;

      loginHelper(token, user); 
      toast.success("Login successful!"); 
    } catch (err: any) {
      // Backend error handling
      const msg = err.response?.data?.message || "Login failed. Try again!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("h-screen bg-muted", className)}>
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start">          
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border border-muted bg-background px-6 py-8 shadow-md"
          >
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}

            <Input
              type="email"
              placeholder="Email"
              className="text-sm"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}

            <Input
              type="password"
              placeholder="Password"
              className="text-sm"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : buttonText}
            </Button>
          </form>

          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{signupText}</p>
            <Link
              href={signupUrl}
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { LoginForm };
