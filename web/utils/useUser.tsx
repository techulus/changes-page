import { Session, SupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { notifyError, notifyInfo } from "../components/core/toast.component";
import { ROUTES } from "../data/routes.data";
import { IBillingInfo, IUser } from "../data/user.interface";
import { Database } from "../types/supabase";
import { httpGet } from "./helpers";

const UserContext = createContext<{
  loading: boolean;
  session: Session | null;
  user: User | null;
  billingDetails: IBillingInfo;
  fetchBilling: () => void;
  fetchUser: () => Promise<IUser>;
  signOut: () => Promise<{ error: Error | null }>;
  supabase: SupabaseClient<Database>;
}>({
  loading: true,
  session: null,
  user: null,
  billingDetails: null,
  fetchBilling: () => null,
  fetchUser: () => null,
  signOut: () => null,
  supabase: null,
});

export const UserContextProvider = (props: any) => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState<IBillingInfo>(null);

  const fetchBilling = useCallback(async () => {
    return httpGet({ url: `/api/billing` })
      .then((billingDetails) => {
        billingDetails.hasActiveSubscription = ["trialing", "active"].includes(
          billingDetails?.subscription?.status
        );

        // testing
        // billingDetails.hasActiveSubscription = false;

        setBillingDetails(billingDetails);

        return billingDetails;
      })
      .catch((error) => {
        console.error("Failed to get billing data:", error);
        notifyError("Failed to fetch billing information");
      });
  }, []);

  useEffect(() => {
    if (user) {
      fetchBilling().then(() => {
        setLoading(false);
      });
    }
  }, [user, fetchBilling]);

  const value = {
    loading,
    session,
    user,

    billingDetails,
    fetchBilling,

    signOut: async () => {
      await router.replace(ROUTES.HOME);
      await supabase.auth.signOut();

      setBillingDetails(null);

      notifyInfo("Logout completed");
    },

    supabase,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
