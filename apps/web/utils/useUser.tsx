import { Database } from "@changes-page/supabase/types";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { notifyError, notifyInfo } from "../components/core/toast.component";
import { ROUTES } from "../data/routes.data";
import { IBillingInfo } from "../data/user.interface";
import { httpGet } from "../utils/http";
import { createClient } from "./supabase/client";

const UserContext = createContext<{
  loading: boolean;
  session: Session | null;
  user: User | null;
  billingDetails: IBillingInfo;
  fetchBilling: () => void;
  signOut: () => Promise<{ error: Error | null }>;
  supabase: SupabaseClient<Database>;
}>({
  loading: true,
  session: null,
  user: null,
  billingDetails: null,
  fetchBilling: () => null,
  signOut: () => null,
  supabase: null,
});

export const UserContextProvider = ({
  children,
  initialSession = null,
}: {
  children: React.ReactNode;
  initialSession?: Session | null;
}) => {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [loading, setLoading] = useState(!initialSession);
  const [billingDetails, setBillingDetails] = useState<IBillingInfo>(null);

  const router = useRouter();

  const fetchBilling = useCallback(async () => {
    return httpGet({ url: `/api/billing` })
      .then((billingDetails) => {
        setBillingDetails(billingDetails);
        return billingDetails;
      })
      .catch((error) => {
        console.error("Failed to get billing data:", error);
        notifyError("Failed to fetch billing information");
      });
  }, []);

  const signOut = useCallback(async () => {
    await router.replace(ROUTES.HOME);
    const { error } = await supabase.auth.signOut();

    setBillingDetails(null);
    notifyInfo("Logout completed");

    return { error };
  }, [supabase, router]);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (user) {
      fetchBilling().then(() => {
        setLoading(false);
      });
      posthog.identify(user.id, {
        email: user.email,
        name: user.user_metadata?.full_name,
      });
    } else {
      setLoading(false);
    }
  }, [user, fetchBilling]);

  const value = {
    loading,
    session,
    user,
    billingDetails,
    fetchBilling,
    signOut,
    supabase,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUserData must be used within a UserContextProvider.`);
  }
  return context;
};
