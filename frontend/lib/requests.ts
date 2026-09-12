import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import type { BloodRequest, BloodRequestCreate, DonorRequest } from "@/types";

async function findToken(): Promise<string | null> {
  const role = typeof window !== "undefined" ? window.localStorage.getItem("bc_role") : null;
  return getToken(role === "requester" ? "requester" : "donor");
}

export interface DonorInfo {
  public_id: string;
  name: string;
  blood_group: string;
  address: string;
  eligible_status: boolean;
  available_to_donate: boolean;
}

export interface AvailableDonorsResponse {
  exact_match: DonorInfo[];
  compatible: DonorInfo[];
  request_blood_type: string;
}

export const requestsApi = {
  async create(data: BloodRequestCreate): Promise<BloodRequest> {
    return api.post<BloodRequest>("/requests", data, await findToken());
  },

  async listMine(): Promise<BloodRequest[]> {
    return api.get<BloodRequest[]>("/requests/me", await findToken());
  },

  async getAvailableDonors(requestPublicId: string): Promise<AvailableDonorsResponse> {
    return api.get<AvailableDonorsResponse>(`/requests/${requestPublicId}/available-donors`, await findToken());
  },

  async notifyDonors(requestPublicId: string, donorPublicIds: string[]): Promise<{ notified: number }> {
    return api.post<{ notified: number }>(
      `/requests/${requestPublicId}/notify-donors`,
      { donor_public_ids: donorPublicIds },
      await findToken()
    );
  },

  async sendRequest(bloodRequestPublicId: string, donorPublicId: string): Promise<DonorRequest> {
    const params = new URLSearchParams({
      blood_request_public_id: bloodRequestPublicId,
      donor_public_id: donorPublicId,
    });
    return api.post<DonorRequest>(`/donor-requests?${params.toString()}`, {}, await findToken());
  },

  async listIncoming(): Promise<DonorRequest[]> {
    return api.get<DonorRequest[]>("/donor-requests/incoming", await findToken());
  },

  async listAccepted(): Promise<DonorRequest[]> {
    return api.get<DonorRequest[]>("/donor-requests/accepted", await findToken());
  },

  async listConnections(): Promise<DonorRequest[]> {
    return api.get<DonorRequest[]>("/donor-requests/connections", await findToken());
  },

  async acceptRequest(donorRequestPublicId: string): Promise<DonorRequest> {
    return api.patch<DonorRequest>(`/donor-requests/${donorRequestPublicId}/accept`, {}, await findToken());
  },

  async rejectRequest(donorRequestPublicId: string): Promise<DonorRequest> {
    return api.patch<DonorRequest>(`/donor-requests/${donorRequestPublicId}/reject`, {}, await findToken());
  },
};
