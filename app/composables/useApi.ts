export const useApi = () => {
  const config = useRuntimeConfig();
  const session = useSupabaseSession();

  const request = async <T>(url: string, options: any = {}): Promise<T> => {
    const headers: Record<string, string> = {
      ...(options.headers || {}),
    };

    const token = session.value?.access_token;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return await $fetch<T>(`${config.public.apiBaseUrl}${url}`, {
      ...options,
      headers,
    });
  };
  return { request };
};
