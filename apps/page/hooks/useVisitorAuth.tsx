import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface Visitor {
  id: string;
  email: string;
  email_verified: boolean;
}

interface UseVisitorAuthReturn {
  visitor: Visitor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const VisitorAuthContext = createContext<UseVisitorAuthReturn | null>(null);

export function VisitorAuthProvider({ children }: { children: ReactNode }) {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchVisitor = useCallback(async () => {
    if (hasFetched) return;

    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setVisitor(data.visitor);
        } else {
          setVisitor(null);
        }
      } else {
        setVisitor(null);
      }
    } catch (error) {
      console.error("Failed to fetch visitor:", error);
      setVisitor(null);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, [hasFetched]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setVisitor(null);
      setHasFetched(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, []);

  useEffect(() => {
    fetchVisitor();
  }, [fetchVisitor]);

  const value = {
    visitor,
    isLoading,
    isAuthenticated: !!visitor,
    logout,
  };

  return (
    <VisitorAuthContext.Provider value={value}>
      {children}
    </VisitorAuthContext.Provider>
  );
}

export function useVisitorAuth(): UseVisitorAuthReturn {
  const context = useContext(VisitorAuthContext);
  if (!context) {
    throw new Error("useVisitorAuth must be used within VisitorAuthProvider");
  }
  return context;
}
