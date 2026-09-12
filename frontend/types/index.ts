export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type UrgencyLevel = "CRITICAL" | "URGENT" | "NORMAL";

export type BloodRequestStatus = "PENDING" | "MATCHING" | "FULFILLED" | "CLOSED";

export interface DonorSignup {
  name: string;
  age: number;
  gender: string;
  blood_group: BloodGroup;
  phone_number: string;
  address: string;
  password: string;
  weight?: number;
  health_status?: string;
  last_donation_date?: string | null;
}

export interface DonorProfile {
  public_id: string;
  name: string;
  age: number;
  gender: string;
  blood_group: BloodGroup;
  address: string;
  weight?: number | null;
  health_status?: string | null;
  last_donation_date?: string | null;
  available_to_donate: boolean;
  eligible_status: boolean;
}

export interface RequesterSignup {
  name: string;
  phone_number: string;
  address: string;
  password: string;
}

export interface RequesterProfile {
  public_id: string;
  name: string;
  address: string;
}

export interface BloodRequestCreate {
  blood_type: BloodGroup;
  address: string;
  hospital: string;
  units_needed: number;
  urgency: UrgencyLevel;
  patient_context?: string;
}

export interface BloodRequest {
  public_id: string;
  requester_public_id: string;
  blood_type: BloodGroup;
  address: string;
  hospital: string;
  units_needed: number;
  urgency: UrgencyLevel;
  patient_context?: string | null;
  status: BloodRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  blood_request_id?: number | null;
  is_read: boolean;
  created_at: string;
}

export type DonorRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface DonorRequest {
  id: number;
  public_id: string;
  blood_request_public_id: string;
  requester_public_id: string;
  donor_public_id: string;
  blood_type: string;
  hospital: string;
  address: string;
  units_needed: number;
  urgency: string;
  status: DonorRequestStatus;
  requester_name: string;
  created_at: string;
}
