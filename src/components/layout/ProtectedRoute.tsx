"use client";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


interface Props {
  role?: "ADMIN" | "SELLER" | "CUSTOMER";
  children: React.ReactNode;
}

export default function ProtectedRoute({ role, children }: Props) {
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    if (!user) router.push("/login");
    else if (role && user.role !== role) router.push("/");
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}
