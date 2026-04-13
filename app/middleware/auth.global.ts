export default defineNuxtRouteMiddleware((to) => {
  const session = useSupabaseSession();

  const isLoginPage = to.path === "/login" || to.path === "/login/";

  if (!session.value && !isLoginPage) {
    return navigateTo("/login");
  }

  if (session.value && isLoginPage) {
    return navigateTo("/");
  }
});
