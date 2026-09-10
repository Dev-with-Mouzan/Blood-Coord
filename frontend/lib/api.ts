// fetch wrapper to FastAPI

const API_V1 = "/api/v1";

export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

type Options = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

function isFormEncoded(body: unknown): body is URLSearchParams {
  return body instanceof URLSearchParams;
}

export async function apiRequest<T>(
  path: string,
  { body, token, headers, ...rest }: Options = {}
): Promise<T> {
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  let fetchBody: BodyInit | undefined;
  if (body !== undefined) {
    if (isFormEncoded(body)) {
      // Form-encoded body (e.g. OAuth2 login) keeps its own content type
      fetchBody = body;
      finalHeaders["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      finalHeaders["Content-Type"] = "application/json";
      fetchBody = JSON.stringify(body);
    }
  }
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_V1}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: fetchBody,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string };
      if (data?.detail) message = data.detail;
    } catch {
      // fall back to generic message
    }
    throw new ApiRequestError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) =>
    apiRequest<T>(path, { method: "GET", token }),

  post: <T>(path: string, body?: unknown, token?: string | null) =>
    apiRequest<T>(path, { method: "POST", body, token }),

  patch: <T>(path: string, body?: unknown, token?: string | null) =>
    apiRequest<T>(path, { method: "PATCH", body, token }),

  delete: <T>(path: string, token?: string | null) =>
    apiRequest<T>(path, { method: "DELETE", token }),
};
