import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CRITICAL: set up listener BEFORE getSession to avoid races.
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      // Enforce "remember me": if user opted out, mirror auth token to
      // sessionStorage so it disappears when the tab closes.
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          const remember = localStorage.getItem("hskhub:remember-session") === "1";
          if (!remember) {
            const toMove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) toMove.push(k);
            }
            for (const k of toMove) {
              const v = localStorage.getItem(k);
              if (v) sessionStorage.setItem(k, v);
              localStorage.removeItem(k);
            }
          }
        } catch { /* noop */ }
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
