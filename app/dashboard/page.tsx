
"use client";

import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Mail,
  Pause,
  Settings2,
  Tag,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function DashboardPage() {
  return (
    <main className="min-h-screen">
       
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}
         
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">

              Newsletter
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Newsletter dashboard
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Manage your newsletter preferences, delivery schedule, and
                subscription.
              </p>
            </div>
          </div>

          <Button asChild className="w-full sm:w-auto">
            <Link href="/select">
              <Settings2 className="mr-2 size-4" aria-hidden="true" />
              Update preferences
            </Link>
          </Button>
        </header>

        {/* Newsletter Status */}
        <section
          aria-labelledby="newsletter-status"
          className="mb-6"
        >
          <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"
                aria-hidden="true"
              >
                <Check className="size-4" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="newsletter-status"
                    className="text-sm font-semibold"
                  >
                    Your newsletter is active
                  </h2>

                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10"
                  >
                    Active
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your personalized newsletter is being delivered according
                  to your selected schedule.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Delivery
              </p>

              <p className="mt-1 text-sm font-medium">
                Every morning at 9:00 AM
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Preferences */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-background px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">
                    Newsletter preferences
                  </CardTitle>

                  <CardDescription className="mt-1">
                    Customize the content and frequency of your newsletter.
                  </CardDescription>
                </div>

                <div
                  className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex"
                  aria-hidden="true"
                >
                  <Mail className="size-5" />
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
                    <p className="text-sm font-medium">
                      Categories
                    </p>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Topics included in your newsletter
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:max-w-md sm:justify-end">
                  <Badge variant="secondary">Technology</Badge>
                  <Badge variant="secondary">Business</Badge>
                  <Badge variant="secondary">AI</Badge>
                  <Badge variant="secondary">Startups</Badge>
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
                      Frequency
                    </p>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      How often you receive updates
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="w-fit">
                  Daily
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
                    <p className="text-sm font-medium">
                      Email address
                    </p>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Newsletter delivery address
                    </p>
                  </div>
                </div>

                <p className="break-all text-sm font-medium sm:text-right">
                  hello@example.com
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
                      Subscription started
                    </p>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      When your newsletter was created
                    </p>
                  </div>
                </div>

                <p className="text-sm font-medium">
                  August 29, 2026
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Quick actions
                </CardTitle>

                <CardDescription>
                  Manage your newsletter and subscription.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button
                  asChild
                  variant="outline"
                  className="h-11 w-full justify-between"
                >
                  <Link href="/select">
                    <span className="flex items-center">
                      <Settings2
                        className="mr-2 size-4"
                        aria-hidden="true"
                      />
                      Edit preferences
                    </span>

                    <ChevronRight
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-11 w-full justify-between"
                >
                  <span className="flex items-center">
                    <Pause
                      className="mr-2 size-4"
                      aria-hidden="true"
                    />
                    Pause newsletter
                  </span>

                  <ChevronRight
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
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

            {/* Delivery Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Delivery schedule
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="rounded-lg bg-muted/60 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-full bg-background shadow-sm"
                      aria-hidden="true"
                    >
                      <Clock3 className="size-4 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Every day
                      </p>

                      <p className="text-sm text-muted-foreground">
                        9:00 AM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Controls */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-base">
                  Newsletter controls
                </CardTitle>

                <CardDescription>
                  Temporarily stop receiving your newsletter.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Pause
                    className="mr-2 size-4"
                    aria-hidden="true"
                  />
                  Pause newsletter
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* How It Works */}
        <section className="mt-6" aria-labelledby="how-it-works">
          <Alert className="border-primary/10 bg-primary/[0.03]">

            <AlertTitle id="how-it-works">
              How your newsletter works
            </AlertTitle>

            <AlertDescription className="mt-3">
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    Content is generated based on your selected categories.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    Newsletters are delivered according to your schedule.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    You can pause or resume your newsletter at any time.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    Preferences can be updated whenever you want.
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          Your preferences are saved automatically.
        </footer>
      </div>
    </main>
  );
}

