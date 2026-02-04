"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { login, login as loginHelper } from "@/lib/auth";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

/* -------------------- props -------------------- */
interface LoginProps {
  heading?: string;
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
  heading = "Login Form",
  buttonText = "Login",
  signupText = "Need an account?",
  signupUrl = "/signup",
  className,
}: LoginProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
      // const token = response.data?.token;
      // const user = response.data?.user;
      // 🔒 Safety check
      // if (!token || !user) {
      //   toast.error("Invalid login response");
      //   return;
      // }

      // // 🚫 Admin blocked
      // if (user.role === "ADMIN") {
      //   toast.error("Admin cannot login from here");
      //   return;
      // }

      loginHelper(token, user);
      toast.success("Login successful!");
      login(token, user);
      window.dispatchEvent(new Event("storage"));
      // if (user.role === "SELLER") {
      //   router.push("/");
      // } else {
      //   router.push("/");
      // }
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Login failed. Try again!");
      }
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
        {/* Heading only */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Please login to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : buttonText}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {signupText}{" "}
          <Link
            href={signupUrl}
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
};

export { LoginForm };
