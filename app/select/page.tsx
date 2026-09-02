import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserPreferences } from "./Select";
import SelectPageClient from "./Select";
import { fetchUserPreferences } from "../dashboard/actions";

export default async function SelectPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/login");
  }
  const userPreferences = await fetchUserPreferences({ userId: user.sub });
 

  return (
    <SelectPageClient userPreferences={userPreferences as UserPreferences} />
  );
}
