import Dashboard from "./Dashboard";
import { fetchUserPreferences } from "@/lib/utils/dataActions";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const email = user?.email;

  if (!user || !email) {
    redirect("/login");
  }

  const authCookies = (await cookies()).getAll();
  const userPreferences = await fetchUserPreferences({
    userId: user.sub,
    cookies: authCookies,
  });
  return <Dashboard usePreferences={userPreferences} />;
}
