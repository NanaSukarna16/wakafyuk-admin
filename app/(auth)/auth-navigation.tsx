"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function AuthNavigation() {
  const pathname = usePathname();
  const isRegister = pathname?.includes("register");

  return isRegister ? (
    <Link
      href="/"
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "absolute right-4 top-4 md:right-8 md:top-8"
      )}
    >
      Login
    </Link>
  ) : (
    <Link
      href="/register"
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "absolute right-4 top-4 md:right-8 md:top-8"
      )}
    >
      Register
    </Link>
  );
}
