export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const loading = useState<boolean>("auth-loading", () => false);

  const signUp = async (payload: {
    email: string;
    password: string;
    name: string;
    avatar_url?: string | null;
  }) => {
    loading.value = true;
    try {
      const config = useRuntimeConfig();

      return await $fetch(`${config.public.apiBaseUrl}/auth/signup`, {
        method: "POST",
        body: payload,
      });
    } finally {
      loading.value = false;
    }
  };

  const signIn = async (payload: { email: string; password: string }) => {
    loading.value = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword(payload);

      if (error) throw error;
      return data;
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await navigateTo("/login");
  };

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  };

  const getAccessToken = async () => {
    const session = await getSession();
    return session?.access_token ?? null;
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getSession,
    getAccessToken,
  };
};
