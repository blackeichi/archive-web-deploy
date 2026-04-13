import type { Profile } from "~/types/profile";
import { useApi } from "./useApi";
import { computed } from "vue";

export function useMyProfile() {
  const { request } = useApi();

  const { data, pending, error, refresh } = useAsyncData<Profile | null>(
    "myProfile",
    () => request<Profile | null>("/profile"),
    {
      default: () => null,
    },
  );

  const isAdmin = computed(() => data.value?.role === "admin");

  return {
    profile: data,
    loading: pending,
    error,
    fetchMyProfile: refresh,
    isAdmin,
  };
}
