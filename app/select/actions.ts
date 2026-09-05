"use server";
import { redirect } from "next/navigation";
import { DeliveryFrequency } from "./constants";
import { createClient } from "@/lib/supabase/server";
import { updateTag,  } from "next/cache";
import { inngest } from "@/lib/inngest/client";
interface Preferences {
  categories?: string[];
  frequency?: DeliveryFrequency;
}

const frequencyOptions: DeliveryFrequency[] = ["daily", "weekly", "biweekly"];
export async function savePreferences({ categories, frequency }: Preferences) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const email = user?.email;

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
      user_id: user.sub,
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
  // const {} = await inngest.send({
  //   name: "newsletter.schedule",
  //   data: {
  //     email: email,
  //     categories: categories,
  //     frequency: frequency,
  //   }
  // });
  updateTag(`user-preferences-${user.sub}`);

  return {
    sucesss: true,
    message: "Preferences saved successfully",
  };
}
