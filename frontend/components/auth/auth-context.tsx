import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi, clearTokens, getToken, getRole, setToken } from "@/lib/auth-client";
import type { DonorProfile, RequesterProfile } from "@/types";

type Role = "donor" | "requester";

type User = DonorProfile | RequesterProfile;

interface AuthContextValue {
  role: Role | null;
  user: User | null;
  loading: boolean;
  login: (role: Role, token: string) => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const currentRole = getRole();
    const token = getToken(currentRole ?? "donor");
    if (!currentRole || !token) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      if (currentRole === "donor") {
        const profile = await authApi.getDonorMe(token);
        setUser(profile);
      } else {
        const profile = await authApi.getRequesterMe(token);
        setUser(profile);
      }
      setRole(currentRole);
    } catch {
      setUser(null);
      setRole(currentRole);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback((newRole: Role, token: string) => {
    setToken(newRole, token);
    setRole(newRole);
    setLoading(true);
    void (async () => {
      try {
        if (newRole === "donor") {
          setUser(await authApi.getDonorMe(token));
        } else {
          setUser(await authApi.getRequesterMe(token));
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setRole(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ role, user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
