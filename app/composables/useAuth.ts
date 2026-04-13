export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const session = useSupabaseSession();
  const loading = useState<boolean>("auth-loading", () => false);

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

  const getAccessToken = () => {
    return session.value?.access_token ?? null;
  };

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    getAccessToken,
  };
};
