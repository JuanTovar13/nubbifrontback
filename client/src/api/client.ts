const BASE = "/api";

export const apiCall = async <T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem("nubbi_token");

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("nubbi_token");
      localStorage.removeItem("nubbi_user");
      window.location.href = "/";
    }
    throw new Error((data as { message?: string }).message ?? `Error ${res.status}`);
  }

  return data as T;
};
