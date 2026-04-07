import { useApi } from "./useApi";

export const useMyProfile = () => {
  const { request } = useApi();

  const profile = useState<any | null>("my-profile", () => null);
  const loading = useState<boolean>("my-profile-loading", () => false);

  const fetchMyProfile = async () => {
    loading.value = true;
    try {
      const response = await request<any>("/me/profile");
      profile.value = response.data ?? response;
      return profile.value;
    } finally {
      loading.value = false;
    }
  };

  const isAdmin = computed(() => profile.value?.role === "admin");

  return {
    profile,
    loading,
    fetchMyProfile,
    isAdmin,
  };
};
