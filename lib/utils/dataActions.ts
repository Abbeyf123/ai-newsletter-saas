"use server";
import { createServerClient } from "@supabase/ssr";
import { cacheLife, cacheTag } from "next/cache";

type AuthCookie = {
  name: string;
  value: string;
};

export const fetchUserPreferences = async ({
  userId,
  cookies,
}: {
  userId: string;
  cookies: AuthCookie[];
}) => {
  "use cache";
  cacheLife("days");
  cacheTag("user-preferences", `user-preferences-${userId}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookies,
        setAll: () => {},
      },
    },
  );

  const { data: userPreferences, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return userPreferences[0] || null;
};
