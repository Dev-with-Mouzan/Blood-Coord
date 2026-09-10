// auth helpers — browser only, must not be imported in server modules

import type {
  DonorProfile,
  DonorSignup,
  RequesterProfile,
  RequesterSignup,
  TokenResponse,
} from "@/types";

const DONOR_TOKEN_KEY = "bc_donor_token";
const REQUESTER_TOKEN_KEY = "bc_requester_token";
const ROLE_KEY = "bc_role";

type Role = "donor" | "requester";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getToken(role: Role = "donor"): string | null {
  if (!isBrowser()) return null;
  const key = role === "donor" ? DONOR_TOKEN_KEY : REQUESTER_TOKEN_KEY;
  return window.localStorage.getItem(key);
}

export function setToken(role: Role, token: string): void {
  if (!isBrowser()) return;
  const key = role === "donor" ? DONOR_TOKEN_KEY : REQUESTER_TOKEN_KEY;
  window.localStorage.setItem(key, token);
  window.localStorage.setItem(ROLE_KEY, role);
}

export function clearTokens(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(DONOR_TOKEN_KEY);
  window.localStorage.removeItem(REQUESTER_TOKEN_KEY);
  window.localStorage.removeItem(ROLE_KEY);
}

export function getRole(): Role | null {
  if (!isBrowser()) return null;
  return (window.localStorage.getItem(ROLE_KEY) as Role) || null;
}

export function isAuthenticated(role: Role = "donor"): boolean {
  return Boolean(getToken(role));
}

export const authApi = {
  async signupDonor(data: DonorSignup): Promise<DonorProfile> {
    return window.fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }).then(asJson<DonorProfile>);
  },

  async loginDonor(phoneNumber: string, password: string): Promise<string> {
    const body = new URLSearchParams();
    body.append("username", phoneNumber);
    body.append("password", password);
    const token = await windowFetchAuth<TokenResponse>("/api/v1/auth/login", body);
    return token.access_token;
  },

  async getDonorMe(token?: string | null): Promise<DonorProfile> {
    return windowFetchAuth<DonorProfile>("/api/v1/donors/me", undefined, token ?? getToken("donor"), "GET");
  },

  async signupRequester(data: RequesterSignup): Promise<RequesterProfile> {
    return window.fetch("/api/v1/requester-auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }).then(asJson<RequesterProfile>);
  },

  async loginRequester(phoneNumber: string, password: string): Promise<string> {
    const body = new URLSearchParams();
    body.append("username", phoneNumber);
    body.append("password", password);
    const token = await windowFetchAuth<TokenResponse>("/api/v1/requester-auth/login", body);
    return token.access_token;
  },

  async getRequesterMe(token?: string | null): Promise<RequesterProfile> {
    return windowFetchAuth<RequesterProfile>("/api/v1/requesters/me", undefined, token ?? getToken("requester"), "GET");
  },
};

function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function windowFetchAuth<T>(
  path: string,
  body: URLSearchParams | undefined,
  token?: string | null,
  method: "POST" | "GET" = "POST"
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  let fetchBody: BodyInit | undefined;
  let contentType: string | undefined;

  if (body !== undefined) {
    fetchBody = body;
    contentType = "application/x-www-form-urlencoded";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  const res = await window.fetch(path, {
    method,
    headers,
    body: fetchBody,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

