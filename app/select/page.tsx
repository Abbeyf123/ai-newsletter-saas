import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserPreferences } from "./Select";
import SelectPageClient from "./Select";
import { fetchUserPreferences } from "@/lib/utils/dataActions";
import { fetchArticles } from "@/lib/utils/news";

export default async function SelectPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/login");
  }
  const authCookies = (await cookies()).getAll();
  const userPreferences = await fetchUserPreferences({
    userId: user.sub,
    cookies: authCookies,
  });

  const article = await fetchArticles(["sport", "business"]);
  console.log(article);

  return (
    <SelectPageClient userPreferences={userPreferences as UserPreferences} />
  );
}
