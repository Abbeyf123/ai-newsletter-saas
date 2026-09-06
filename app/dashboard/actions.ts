"use server";
import { inngest } from "@/lib/inngest/client";
import { createClient } from "@/lib/supabase/server";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function newsletterActivation(is_active: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user?.id) {
    redirect("/auth/login");
  }

  const { error: updateError } = await supabase
    .from("user_preferences")
    .update({ is_active })
    .eq("user_id", user.id);

  if (updateError) {
    throw new Error("error updating user preferences");
  }

  if (!is_active) {
    await inngest.send({
      name: "newsletter.schedule.deleted",
      data: {
        userId: user.id,
      },
    });
  } else {
    const { data: preferences, error } = await supabase
      .from("user_preferences")
      .select("categories, frequency, email")
      .eq("user_id", user.id)
      .single();

    if (error || !preferences) {
      throw new Error("user preferences not found");
    }

    await inngest.send({
      name: "newsletter.schedule",
      data: {
        email: user.email,
        categories: preferences.categories,
        frequency: preferences.frequency,
        userId: user.id,
      },
    });
  }

  updateTag(`user-preferences-${user.id}`);
}
