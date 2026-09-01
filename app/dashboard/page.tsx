import Dashboard from "./Dashboard";
import {fetchUserPreferences} from "./actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default async function DashboardPage() {
 const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const email = user?.email;

  if (!user ) {
    redirect("/login");
  }

  const userPreferences = await fetchUserPreferences({userId: user.sub})
  return <Dashboard usePreferences={userPreferences}/>;
}
