"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock3,
  Loader2,
  Newspaper,
  Save,
} from "lucide-react";
import { frequencyOptions, categories } from "./constants";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SelectPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("weekly");

//   const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    setIsSaving(true);

    try {
      // Backend/API logic will be added here later.

      await new Promise((resolve) => setTimeout(resolve, 800));

      alert("Your newsletter preferences have been saved!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Back Navigation */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-3 mb-6 text-muted-foreground"
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Back to dashboard
          </Link>
        </Button>

        {/* Page Header */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4">
            Newsletter preferences
          </Badge>

          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Build a newsletter around what matters to you.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Choose the topics you care about and decide how often you want your
            personalized newsletter delivered.
          </p>
        </header>

        <form onSubmit={handleSavePreferences}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* Main Form */}
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Choose your interests
                      </CardTitle>

                      <CardDescription className="mt-1">
                        Select one or more topics you&apos;d like included in
                        your newsletter.
                      </CardDescription>
                    </div>

                    <div
                      className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex"
                      aria-hidden="true"
                    >
                      <Newspaper className="size-5" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                  <fieldset disabled={isSaving}>
                    <legend className="sr-only">Newsletter categories</legend>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategories.includes(
                          category.id,
                        );

                        return (
                          <label
                            key={category.id}
                            htmlFor={category.id}
                            className={`
                              group relative cursor-pointer rounded-xl border
                              bg-background p-4 transition-all

                              hover:border-primary/40
                              hover:bg-muted/30

                              ${
                                isSelected
                                  ? "border-primary bg-primary/[0.04]"
                                  : ""
                              }

                              has-[:focus-visible]:ring-2
                              has-[:focus-visible]:ring-ring
                              has-[:focus-visible]:ring-offset-2

                              ${isSaving ? "cursor-not-allowed opacity-70" : ""}
                            `}
                          >
                            <input
                              id={category.id}
                              type="checkbox"
                              name="categories"
                              value={category.id}
                              checked={isSelected}
                              onChange={() => handleCategoryToggle(category.id)}
                              className="peer sr-only"
                            />

                            <div className="flex items-start gap-3">
                              {/* Category Icon */}
                              <div
                                className={`
                                  flex size-10 shrink-0 items-center
                                  justify-center rounded-lg
                                  transition-colors

                                  ${
                                    isSelected
                                      ? "bg-primary/10 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  }
                                `}
                                aria-hidden="true"
                              >
                                <Icon className="size-5" />
                              </div>

                              {/* Category Content */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-medium">
                                      {category.name}
                                    </p>

                                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                      {category.description}
                                    </p>
                                  </div>

                                  {/* Checkbox */}
                                  <div
                                    className={`
                                      flex size-5 shrink-0 items-center
                                      justify-center rounded-md border
                                      transition-all

                                      ${
                                        isSelected
                                          ? "border-primary bg-primary text-primary-foreground"
                                          : "border-input bg-background text-transparent"
                                      }
                                    `}
                                    aria-hidden="true"
                                  >
                                    <Check className="size-3.5" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Selection Count */}
                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      {selectedCategories.length}{" "}
                      {selectedCategories.length === 1
                        ? "category"
                        : "categories"}{" "}
                      selected
                    </p>

                    {selectedCategories.length > 0 && (
                      <Badge variant="secondary">Ready to personalize</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Frequency */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Delivery frequency
                      </CardTitle>

                      <CardDescription className="mt-1">
                        Decide how often you&apos;d like to receive your
                        newsletter.
                      </CardDescription>
                    </div>

                    <div
                      className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex"
                      aria-hidden="true"
                    >
                      <Clock3 className="size-5" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                  <fieldset disabled={isSaving}>
                    <legend className="sr-only">
                      Newsletter delivery frequency
                    </legend>

                    <div className="grid gap-3 md:grid-cols-3">
                      {frequencyOptions.map((frequency) => {
                        const isSelected = selectedFrequency === frequency.id;

                        return (
                          <label
                            key={frequency.id}
                            htmlFor={`frequency-${frequency.id}`}
                            className={`
                              relative cursor-pointer rounded-xl border
                              bg-background p-4 transition-all

                              hover:border-primary/40
                              hover:bg-muted/30

                              ${
                                isSelected
                                  ? "border-primary bg-primary/[0.04]"
                                  : ""
                              }

                              has-[:focus-visible]:ring-2
                              has-[:focus-visible]:ring-ring
                              has-[:focus-visible]:ring-offset-2

                              ${isSaving ? "cursor-not-allowed opacity-70" : ""}
                            `}
                          >
                            <input
                              id={`frequency-${frequency.id}`}
                              type="radio"
                              name="frequency"
                              value={frequency.id}
                              checked={isSelected}
                              onChange={() =>
                                setSelectedFrequency(frequency.id)
                              }
                              className="peer sr-only"
                            />

                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium">
                                  {frequency.name}
                                </p>

                                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                  {frequency.description}
                                </p>
                              </div>

                              {/* Radio Indicator */}
                              <div
                                className={`
                                  mt-0.5 flex size-5 shrink-0 items-center
                                  justify-center rounded-full border
                                  transition-all

                                  ${
                                    isSelected
                                      ? "border-primary"
                                      : "border-input"
                                  }
                                `}
                                aria-hidden="true"
                              >
                                {isSelected && (
                                  <div className="size-2.5 rounded-full bg-primary" />
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Summary */}
              <Card className="lg:sticky lg:top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Your newsletter</CardTitle>

                  <CardDescription>
                    Review your preferences before saving.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Categories Summary */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Topics
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedCategories.length > 0 ? (
                        selectedCategories.map((categoryId) => {
                          const category = categories.find(
                            (item) => item.id === categoryId,
                          );

                          return (
                            <Badge key={categoryId} variant="secondary">
                              {category?.name}
                            </Badge>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No categories selected
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Frequency Summary */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Frequency
                    </p>

                    <p className="mt-2 text-sm font-medium capitalize">
                      {selectedFrequency}
                    </p>
                  </div>

                  <Separator />

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={selectedCategories.length === 0 || isSaving}
                    className="h-11 w-full"
                  >
                    {isSaving ? (
                      <>
                        <Loader2
                          className="mr-2 size-4 animate-spin"
                          aria-hidden="true"
                        />
                        Saving preferences...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 size-4" aria-hidden="true" />
                        Save preferences
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs leading-5 text-muted-foreground">
                    You can change these preferences anytime.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}
