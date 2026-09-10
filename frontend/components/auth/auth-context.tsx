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

const MOCK_DONOR: DonorProfile = {
  public_id: "donor-001",
  name: "Sarah Mitchell",
  age: 29,
  gender: "female",
  blood_group: "O+",
  address: "123 Health Avenue, Downtown Medical District",
  weight: 62,
  health_status: "Excellent — no conditions",
  last_donation_date: "2025-11-15",
  available_to_donate: true,
  eligible_status: true,
};

const MOCK_REQUESTER: RequesterProfile = {
  public_id: "req-001",
  name: "James Cooper",
  address: "456 Memorial Drive, Central Hospital Area",
};

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
      if (currentRole === "donor") {
        setUser(MOCK_DONOR);
      } else {
        setUser(MOCK_REQUESTER);
      }
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
    void (async () => {
      try {
        if (newRole === "donor") {
          setUser(await authApi.getDonorMe(token));
        } else {
          setUser(await authApi.getRequesterMe(token));
        }
      } catch {
        setUser(null);
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
