import { useAuth } from "./useAuth";

export const useApi = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  const request = async <T>(url: string, options: any = {}): Promise<T> => {
    const headers: Record<string, string> = {
      ...(options.headers || {}),
    };

    const token = await getAccessToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return await $fetch<T>(`${config.public.apiBaseUrl}${url}`, {
      ...options,
      headers,
    });
  };

  return {
    request,
  };
};
