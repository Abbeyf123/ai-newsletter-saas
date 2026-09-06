"use server";
import { redirect } from "next/navigation";
import { DeliveryFrequency } from "./constants";
import { createClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";
import { inngest } from "@/lib/inngest/client";
interface Preferences {
  categories?: string[];
  frequency?: DeliveryFrequency;
}

const frequencyOptions: DeliveryFrequency[] = ["monthly", "weekly", "biweekly"];
export async function savePreferences({ categories, frequency }: Preferences) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("user not found");
  }

  if (!user?.id || !user?.email) {
    redirect("/auth/login");
  }

  const email = user.email;

  if (!user) {
    redirect("/login");
  }

  //   check for empty categories or frequency

  if (!categories || !frequency) {
    throw new Error("Please select at least one category or a frequency");
  }

  //   check for categories
  if (categories && (categories.length === 0 || !Array.isArray(categories))) {
    throw new Error("Please select at least one category");
  }

  //   check for frequency
  if (frequency && !frequencyOptions.includes(frequency)) {
    throw new Error("Please select a valid frequency");
  }

  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      email: email,
      categories: categories,
      frequency: frequency,
      is_active: true,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error(error.message);
  }
   await inngest.send({
    name: "newsletter.schedule",
    data: {
      email: email,
      categories: categories,
      frequency: frequency,
      userId: user.id
    }
  });
  updateTag(`user-preferences-${user.id}`);

  return {
    sucesss: true,
    message: "Preferences saved successfully",
  };
}
