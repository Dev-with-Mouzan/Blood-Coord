import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { BloodRequest, BloodRequestCreate } from "@/types";

const URGENCY_LEVELS = ["CRITICAL", "URGENT", "NORMAL"] as const;

async function findToken(): Promise<string | null> {
  const role = typeof window !== "undefined" ? window.localStorage.getItem("bc_role") : null;
  return getToken(role === "requester" ? "requester" : "requester");
}

export const requestsApi = {
  async create(data: BloodRequestCreate): Promise<BloodRequest> {
    return api.post<BloodRequest>("/requests", data, await findToken());
  },

  async listMine(): Promise<BloodRequest[]> {
    return api.get<BloodRequest[]>("/requests/me", await findToken());
  },
};

export { URGENCY_LEVELS };

