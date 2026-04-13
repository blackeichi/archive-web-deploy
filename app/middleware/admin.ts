import { useMyProfile } from "~/composables/useMyProfile";

export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo("/login");
  }

  const { profile, fetchMyProfile, isAdmin } = useMyProfile();

  if (!profile.value) {
    await fetchMyProfile();
  }

  if (!isAdmin.value) {
    return navigateTo("/");
  }
});
