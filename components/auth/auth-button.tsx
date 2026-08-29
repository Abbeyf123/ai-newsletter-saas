"use client";

import Link from "next/link";
import { User } from "lucide-react";

import { Button } from "../ui/button";
import { LogoutButton } from "./logout-button";
import { useAuthContext } from "@/context/AuthContext";

export function AuthButton() {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link href="/auth/login">Sign in</Link>
        </Button>

        <Button asChild size="sm">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 rounded-lg bg-muted/60 px-3 py-1.5 sm:flex">
        <div className="flex size-7 items-center justify-center rounded-full bg-background">
          <User className="size-3.5 text-muted-foreground" aria-hidden="true" />
        </div>

        <span className="max-w-40 truncate text-sm font-medium">
          {user.email?.split('@')[0].toString()}
        </span>
      </div>

      <LogoutButton />
    </div>
  );
}
