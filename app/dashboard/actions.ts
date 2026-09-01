"use server";
import { createClient } from "@/lib/supabase/server";
// import { cacheLife, cacheTag } from "next/cache";

export const fetchUserPreferences = async ({ userId }: { userId: string }) => {
  // "use cache";
  // cacheLife('days')
  // cacheTag('user-preferences')
  const supabase = await createClient();
  const { data: userPreferences, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  return (
    userPreferences[0] || null
  );
};
