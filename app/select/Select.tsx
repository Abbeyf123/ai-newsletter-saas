"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  Clock3,
  Loader2,
  Newspaper,
  RotateCcw,
  Save,
} from "lucide-react";
import { savePreferences } from "./actions";
import { CATEGORIES, FREQUENCYOPTIONS, DeliveryFrequency } from "./constants";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface UserPreferences {
  categories: string[];
  frequency: DeliveryFrequency;
  is_active?: boolean;
}

const DEFAULT_FREQUENCY: DeliveryFrequency = "weekly";

export default function SelectPageClient({
  userPreferences,
}: {
  userPreferences: UserPreferences | null;
}) {
  const preferences = {
    categories: [],
    frequency: DEFAULT_FREQUENCY,
    is_active: true,
  };
  const router = useRouter();

  const {
    frequency,
    categories: userCategoryIds,
  } = userPreferences ? userPreferences : preferences;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    userCategoryIds ?? [],
  );
  const [selectedFrequency, setSelectedFrequency] =
    useState<DeliveryFrequency>(DEFAULT_FREQUENCY);

  const [savedCategories, setSavedCategories] = useState<string[]>(
    userCategoryIds ?? [],
  );
  const [savedFrequency, setSavedFrequency] = useState<DeliveryFrequency>(
    frequency ?? DEFAULT_FREQUENCY,
  );

  const [hasExistingPreferences, setHasExistingPreferences] =
    useState(!!userPreferences);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleCategoryToggle = (categoryId: string) => {
    setSaveError(null);

    setSelectedCategories((previousCategories) =>
      previousCategories.includes(categoryId)
        ? previousCategories.filter((id) => id !== categoryId)
        : [...previousCategories, categoryId],
    );
  };

  const handleFrequencyChange = (frequency: DeliveryFrequency) => {
    setSaveError(null);
    setSelectedFrequency(frequency);
  };

  const categoriesHaveChanged =
    selectedCategories.length !== savedCategories.length ||
    selectedCategories.some(
      (categoryId) => !savedCategories.includes(categoryId),
    );

  const hasUnsavedChanges =
    categoriesHaveChanged || selectedFrequency !== savedFrequency;

  const handleDiscardChanges = () => {
    setSelectedCategories([...savedCategories]);
    setSelectedFrequency(savedFrequency);
    setSaveError(null);
  };

  const handleSavePreferences = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (selectedCategories.length === 0) {
      setSaveError("Please select at least one category before saving.");
      return;
    }

    if (!hasUnsavedChanges && hasExistingPreferences) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await savePreferences({
        categories: selectedCategories,
        frequency: selectedFrequency,
      });
      setSavedCategories([...selectedCategories]);
      setSavedFrequency(selectedFrequency);
      setHasExistingPreferences(true);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error saving preferences:", error);

      setSaveError("We couldn't save your preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
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

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Newsletter preferences</Badge>

            {hasExistingPreferences && (
              <Badge variant="outline">Editing existing preferences</Badge>
            )}
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {hasExistingPreferences
              ? "Update your newsletter preferences."
              : "Build a newsletter around what matters to you."}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Choose the topics you care about and decide how often your
            personalized newsletter should be delivered.
          </p>
        </header>

        {/* Error */}
        {saveError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Something needs your attention</AlertTitle>

            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        {/* Unsaved Changes */}
        {hasUnsavedChanges && hasExistingPreferences && (
          <Alert className="mb-6 border-amber-500/30 bg-amber-500/[0.04]">
            <AlertTitle>You have unsaved changes</AlertTitle>

            <AlertDescription>
              Save your changes before leaving this page if you want them
              applied to your newsletter.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSavePreferences}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
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
                      {CATEGORIES.map((category) => {
                        const Icon = category.icon;

                        const isSelected = selectedCategories.includes(
                          category.id,
                        );

                        /*
                         * Useful when editing:
                         * lets us know this category came from
                         * the previously saved preferences.
                         */
                        const wasPreviouslySaved = savedCategories.includes(
                          category.id,
                        );

                        return (
                          <label
                            key={category.id}
                            htmlFor={category.id}
                            className={`
                              group relative cursor-pointer
                              rounded-xl border bg-background
                              p-4 transition-all duration-200

                              hover:border-primary/40
                              hover:bg-muted/30
                              hover:shadow-sm

                              has-[:focus-visible]:ring-2
                              has-[:focus-visible]:ring-ring
                              has-[:focus-visible]:ring-offset-2

                              ${
                                isSelected
                                  ? "border-primary bg-primary/[0.04] shadow-sm"
                                  : ""
                              }

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
                              {/* Icon */}
                              <div
                                className={`
                                  flex size-10 shrink-0
                                  items-center justify-center
                                  rounded-lg transition-colors

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

                              {/* Text */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-sm font-medium">
                                        {category.name}
                                      </p>

                                      {wasPreviouslySaved &&
                                        hasExistingPreferences && (
                                          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                            Current
                                          </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                      {category.description}
                                    </p>
                                  </div>

                                  {/* Checkbox */}
                                  <div
                                    className={`
                                      flex size-5 shrink-0
                                      items-center justify-center
                                      rounded-md border
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

                  {/* Category Status */}
                  <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p
                      className="text-sm text-muted-foreground"
                      aria-live="polite"
                    >
                      {selectedCategories.length}{" "}
                      {selectedCategories.length === 1
                        ? "category"
                        : "categories"}{" "}
                      selected
                    </p>

                    {selectedCategories.length > 0 ? (
                      <Badge variant="secondary" className="w-fit">
                        <Check className="mr-1 size-3" />
                        Ready to personalize
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="w-fit text-destructive"
                      >
                        Select at least one
                      </Badge>
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
                      {FREQUENCYOPTIONS.map((frequency) => {
                        const isSelected = selectedFrequency === frequency.id;

                        const wasPreviouslySaved =
                          savedFrequency === frequency.id;

                        return (
                          <label
                            key={frequency.id}
                            htmlFor={`frequency-${frequency.id}`}
                            className={`
                                relative cursor-pointer
                                rounded-xl border bg-background
                                p-4 transition-all duration-200

                                hover:border-primary/40
                                hover:bg-muted/30
                                hover:shadow-sm

                                has-[:focus-visible]:ring-2
                                has-[:focus-visible]:ring-ring
                                has-[:focus-visible]:ring-offset-2

                                ${
                                  isSelected
                                    ? "border-primary bg-primary/[0.04] shadow-sm"
                                    : ""
                                }

                                ${
                                  isSaving
                                    ? "cursor-not-allowed opacity-70"
                                    : ""
                                }
                              `}
                          >
                            <input
                              id={`frequency-${frequency.id}`}
                              type="radio"
                              name="frequency"
                              value={frequency.id}
                              checked={isSelected}
                              onChange={() =>
                                handleFrequencyChange(frequency.id)
                              }
                              className="peer sr-only"
                            />

                            <div className="flex min-h-20 items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-medium">
                                    {frequency.name}
                                  </p>

                                  {wasPreviouslySaved &&
                                    hasExistingPreferences && (
                                      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                        Current
                                      </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                  {frequency.description}
                                </p>
                              </div>

                              {/* Radio */}
                              <div
                                className={`
                                    mt-0.5 flex size-5
                                    shrink-0 items-center
                                    justify-center rounded-full
                                    border transition-all

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
            <aside>
              <Card
                className={`
                  lg:sticky lg:top-24

                  ${hasUnsavedChanges ? "border-primary/30 shadow-sm" : ""}
                `}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">Your newsletter</CardTitle>

                      <CardDescription className="mt-1">
                        Review your preferences before saving.
                      </CardDescription>
                    </div>

                    {hasUnsavedChanges && hasExistingPreferences && (
                      <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700"
                      >
                        Unsaved
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Categories Summary */}
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Topics
                      </p>

                      <span className="text-xs text-muted-foreground">
                        {selectedCategories.length}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedCategories.length > 0 ? (
                        selectedCategories.map((categoryId) => {
                          const category = CATEGORIES.find(
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

                    <div className="mt-2 flex items-center gap-2">
                      <Clock3 className="size-4 text-muted-foreground" />

                      <p className="text-sm font-medium capitalize">
                        {selectedFrequency}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Save */}
                  <div className="space-y-2">
                    <Button
                      type="submit"
                      disabled={
                        selectedCategories.length === 0 ||
                        isSaving ||
                        (hasExistingPreferences && !hasUnsavedChanges)
                      }
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

                          {hasExistingPreferences
                            ? "Save changes"
                            : "Save preferences"}
                        </>
                      )}
                    </Button>

                    {hasUnsavedChanges && hasExistingPreferences && (
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={isSaving}
                        onClick={handleDiscardChanges}
                        className="w-full"
                      >
                        <RotateCcw className="mr-2 size-4" aria-hidden="true" />
                        Discard changes
                      </Button>
                    )}
                  </div>

                  {!hasUnsavedChanges && hasExistingPreferences && (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/[0.06] px-3 py-2 text-xs text-emerald-700">
                      <Check className="size-3.5" />
                      Preferences are up to date
                    </div>
                  )}

                  <p className="text-center text-xs leading-5 text-muted-foreground">
                    You can return here anytime to change your newsletter
                    preferences.
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
