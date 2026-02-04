"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { SignupFormData, signupSchema } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface SignupProps {
  heading?: string;
  buttonText?: string;
  signupText?: string;
  className?: string;
}

const SignupForm = ({
  heading = "Create an account",
  buttonText = "Create Account",
  signupText = "Already have an account?",
  className,
}: SignupProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      toast.success("Signup successful! Please login.");
      router.push("/login");
    } catch {
      toast.error("Signup failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={cn(
        "flex min-h-screen items-center justify-center bg-muted px-4",
        className,
      )}
    >
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-lg">
        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">{heading}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the details to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Full name" {...register("name")} />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email address"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <select
              {...register("role")}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select role</option>
              <option value="CUSTOMER">Customer</option>
              <option value="SELLER">Seller</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : buttonText}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {signupText}{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export { SignupForm };
