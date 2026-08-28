"use client";
import { createClient } from "@/lib/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const [user, SetUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      SetUser(session?.user ?? null);
      setLoading(false);
    });

    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
       SetUser(session?.user ?? null);
      setLoading(false);
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  const AuthcontextValue: AuthContextType = {
    user,
    session,
    loading,
    signOut,
  };
  return <AuthContext value={AuthcontextValue}>{children}</AuthContext>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if(context === undefined){
    throw new Error ('Auth must be withing a provider')
  }
  return context;
};
