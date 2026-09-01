"use client";

import { useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";

import {
  CalendarDays,
  Check,
  ChevronRight,
  CirclePause,
  Clock3,
  CreditCard,
  Loader2,
  Mail,
  Play,
  Settings2,
  Sparkles,
  Tag,
} from "lucide-react";

import { useAuthContext } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UserPreferences {
  categories: string[];
  frequency: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export default function DashboardPage({
  usePreferences,
}: {
  usePreferences: UserPreferences | null;
}) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(
    usePreferences,
  );
  const [loading, setIsLoading] = useState(false);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // const router = useRouter();
  const { user } = useAuthContext();

  const handleDeactivateNewsletter = async () => {
    if (!user || !preferences) return;

    setIsUpdatingStatus(true);

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to pause newsletter");
      }

      setPreferences((previous) =>
        previous
          ? {
              ...previous,
              is_active: false,
            }
          : null,
      );
    } catch (error) {
      console.error("Error deactivating newsletter:", error);
      alert("Failed to pause newsletter. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleActivateNewsletter = async () => {
    if (!user || !preferences) return;

    setIsUpdatingStatus(true);

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resume newsletter");
      }

      setPreferences((previous) =>
        previous
          ? {
              ...previous,
              is_active: true,
            }
          : null,
      );
    } catch (error) {
      console.error("Error activating newsletter:", error);
      alert("Failed to resume newsletter. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
              Newsletter
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Newsletter dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Review your current newsletter preferences and manage your
              delivery status.
            </p>
          </div>

          <Button asChild className="w-full sm:w-auto">
            <Link href="/select">
              <Settings2 className="mr-2 size-4" aria-hidden="true" />
              Update preferences
            </Link>
          </Button>
        </header>

        {preferences ? (
          <>
            {/* Status */}
            <section className="mb-6" aria-labelledby="newsletter-status">
              <div
                className={`
                  flex flex-col gap-4 rounded-xl border p-4
                  shadow-sm sm:flex-row sm:items-center
                  sm:justify-between sm:p-5

                  ${
                    preferences.is_active
                      ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                      : "border-amber-500/20 bg-amber-500/[0.03]"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                      mt-0.5 flex size-10 shrink-0 items-center
                      justify-center rounded-full

                      ${
                        preferences.is_active
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }
                    `}
                    aria-hidden="true"
                  >
                    {preferences.is_active ? (
                      <Check className="size-5" />
                    ) : (
                      <CirclePause className="size-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        id="newsletter-status"
                        className="text-sm font-semibold sm:text-base"
                      >
                        {preferences.is_active
                          ? "Your newsletter is active"
                          : "Your newsletter is paused"}
                      </h2>

                      <Badge
                        variant="secondary"
                        className={
                          preferences.is_active
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10"
                            : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10"
                        }
                      >
                        {preferences.is_active ? "Active" : "Paused"}
                      </Badge>
                    </div>

                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                      {preferences.is_active
                        ? "Your personalized newsletter will continue to be delivered according to your current schedule."
                        : "Newsletter delivery is currently stopped. Resume it whenever you're ready."}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant={preferences.is_active ? "outline" : "default"}
                  disabled={isUpdatingStatus}
                  onClick={
                    preferences.is_active
                      ? handleDeactivateNewsletter
                      : handleActivateNewsletter
                  }
                  className="w-full sm:w-auto"
                >
                  {isUpdatingStatus ? (
                    <>
                      <Loader2
                        className="mr-2 size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Updating...
                    </>
                  ) : preferences.is_active ? (
                    <>
                      <CirclePause className="mr-2 size-4" aria-hidden="true" />
                      Pause newsletter
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 size-4" aria-hidden="true" />
                      Resume newsletter
                    </>
                  )}
                </Button>
              </div>
            </section>

            {/* Main Dashboard */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
              {/* Current Preferences */}
              <Card className="overflow-hidden">
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Current preferences
                      </CardTitle>

                      <CardDescription className="mt-1">
                        These settings are currently being used to personalize
                        your newsletter.
                      </CardDescription>
                    </div>

                    <div
                      className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex"
                      aria-hidden="true"
                    >
                      <Settings2 className="size-5" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Categories */}
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                    <div className="flex gap-3">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted"
                        aria-hidden="true"
                      >
                        <Tag className="size-4 text-muted-foreground" />
                      </div>

                      <div>
                        <p className="text-sm font-medium">Categories</p>

                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Topics included in your newsletter
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:max-w-md sm:justify-end">
                      {preferences.categories.length > 0 ? (
                        preferences.categories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="capitalize"
                          >
                            {category}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No categories selected
                        </span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Frequency */}
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex gap-3">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted"
                        aria-hidden="true"
                      >
                        <Clock3 className="size-4 text-muted-foreground" />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Delivery frequency
                        </p>

                        <p className="mt-0.5 text-sm text-muted-foreground">
                          How often your newsletter is delivered
                        </p>
                      </div>
                    </div>

                    <Badge variant="outline" className="w-fit capitalize">
                      {preferences.frequency}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Email */}
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex gap-3">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted"
                        aria-hidden="true"
                      >
                        <Mail className="size-4 text-muted-foreground" />
                      </div>

                      <div>
                        <p className="text-sm font-medium">Email address</p>

                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Where your newsletter is delivered
                        </p>
                      </div>
                    </div>

                    <p className="break-all text-sm font-medium sm:max-w-xs sm:text-right">
                      {preferences.email}
                    </p>
                  </div>

                  <Separator />

                  {/* Created */}
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex gap-3">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted"
                        aria-hidden="true"
                      >
                        <CalendarDays className="size-4 text-muted-foreground" />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Preferences created
                        </p>

                        <p className="mt-0.5 text-sm text-muted-foreground">
                          When you first configured your newsletter
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-medium">
                      {new Date(preferences.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick actions</CardTitle>

                    <CardDescription>
                      Make changes to your newsletter setup.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <Button asChild className="h-11 w-full justify-between">
                      <Link href="/select">
                        <span className="flex items-center">
                          <Settings2
                            className="mr-2 size-4"
                            aria-hidden="true"
                          />
                          Update preferences
                        </span>

                        <ChevronRight
                          className="size-4 opacity-70"
                          aria-hidden="true"
                        />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="h-11 w-full justify-between"
                    >
                      <Link href="/subscribe">
                        <span className="flex items-center">
                          <CreditCard
                            className="mr-2 size-4"
                            aria-hidden="true"
                          />
                          Manage subscription
                        </span>

                        <ChevronRight
                          className="size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Delivery Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Delivery</CardTitle>

                    <CardDescription>
                      Your current newsletter schedule.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="rounded-xl border bg-muted/40 p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm"
                          aria-hidden="true"
                        >
                          <Clock3 className="size-4 text-primary" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold capitalize">
                            {preferences.frequency}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Delivered at 9:00 AM
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      Change your delivery frequency from the preferences page.
                    </p>
                  </CardContent>
                </Card>

                {/* Status Control */}
                <Card
                  className={
                    preferences.is_active
                      ? "border-border"
                      : "border-amber-500/30"
                  }
                >
                  <CardHeader>
                    <CardTitle className="text-base">
                      Newsletter status
                    </CardTitle>

                    <CardDescription>
                      {preferences.is_active
                        ? "Pause delivery without changing your preferences."
                        : "Resume delivery using your saved preferences."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUpdatingStatus}
                      onClick={
                        preferences.is_active
                          ? handleDeactivateNewsletter
                          : handleActivateNewsletter
                      }
                      className={
                        preferences.is_active
                          ? "w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          : "w-full"
                      }
                    >
                      {isUpdatingStatus ? (
                        <>
                          <Loader2
                            className="mr-2 size-4 animate-spin"
                            aria-hidden="true"
                          />
                          Updating...
                        </>
                      ) : preferences.is_active ? (
                        <>
                          <CirclePause
                            className="mr-2 size-4"
                            aria-hidden="true"
                          />
                          Pause newsletter
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 size-4" aria-hidden="true" />
                          Resume newsletter
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </aside>
            </div>

            {/* How It Works */}
            <section className="mt-6" aria-labelledby="how-it-works">
              <Alert className="border-primary/10 bg-primary/[0.03]">
                <Sparkles className="size-4 text-primary" aria-hidden="true" />

                <AlertTitle id="how-it-works">
                  How your newsletter works
                </AlertTitle>

                <AlertDescription className="mt-3">
                  <ul className="grid gap-3 text-sm sm:grid-cols-2">
                    <li className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <span>
                        Content is generated from your saved categories.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <span>
                        Newsletters are delivered according to your selected
                        frequency.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <span>
                        Pausing stops delivery without deleting your
                        preferences.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <span>
                        Categories and frequency can be changed from Update
                        Preferences.
                      </span>
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </section>
          </>
        ) : (
          /* No Preferences */
          <Card className="mx-auto max-w-xl">
            <CardContent className="flex flex-col items-center px-6 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="size-5" aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                Set up your newsletter
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Choose your interests and preferred delivery frequency to start
                receiving personalized newsletters.
              </p>

              <Button asChild className="mt-6">
                <Link href="/select">
                  <Settings2 className="mr-2 size-4" aria-hidden="true" />
                  Choose preferences
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
