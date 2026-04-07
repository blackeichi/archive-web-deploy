import { useMyProfile } from "~/composables/useMyProfile";

export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo("/login");
  }

  const { profile, fetchMyProfile } = useMyProfile();

  if (!profile.value) {
    await fetchMyProfile();
  }

  if (profile.value?.role !== "admin") {
    return navigateTo("/");
  }
});
