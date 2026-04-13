<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 모바일 헤더 -->
    <header
      class="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden"
    >
      <button
        type="button"
        class="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        @click="isMenuOpen = true"
      >
        ☰
      </button>

      <div class="flex items-center gap-3">
        <span class="max-w-[140px] truncate text-sm text-gray-700">
          {{ profile?.email || user?.email || "...." }}
        </span>

        <button
          type="button"
          class="rounded-full"
          @click="isLogoutModalOpen = true"
        >
          <img
            :src="avatarSrc"
            alt="user avatar"
            class="h-9 w-9 rounded-full border border-gray-200 object-cover"
          />
        </button>
      </div>
    </header>

    <div class="flex flex-col md:min-h-screen md:flex-row">
      <!-- 데스크탑 사이드바 -->
      <aside
        class="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-gray-200 bg-white md:flex md:flex-col"
      >
        <SidebarProfile :profile="profile" />
        <SidebarCategories
          :categorieTrees="categorieTrees"
          :loading="loading"
          :error="errorMessage"
          :is-admin="isAdmin"
        />
        <SidebarFooter :user="user" @sign-out="signOut" />
      </aside>

      <main class="flex-1 pt-16 md:ml-72 md:pt-0">
        <slot />
      </main>
    </div>

    <!-- 모바일 메뉴 모달 -->
    <CommonModal
      :is-modal-open="isMenuOpen"
      @update:is-modal-open="isMenuOpen = $event"
    >
      <div
        class="h-full w-72 bg-white shadow-xl overflow-hidden flex flex-col transition-all"
      >
        <div
          class="flex items-center justify-between border-b border-gray-200 px-4 py-3 shrink-0"
        >
          <h2 class="text-sm font-semibold text-gray-800">메뉴</h2>
          <button
            type="button"
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            @click="isMenuOpen = false"
          >
            ✕
          </button>
        </div>

        <SidebarCategories
          :categorieTrees="categorieTrees"
          :loading="loading"
          :error="errorMessage"
          :is-admin="isAdmin"
          @navigate="isMenuOpen = false"
        />
      </div>
    </CommonModal>

    <!-- 로그아웃 확인 모달 -->
    <CommonModal
      :is-modal-open="isLogoutModalOpen"
      @update:is-modal-open="isLogoutModalOpen = $event"
      is-centered
    >
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-gray-900">로그아웃</h2>
        <p class="mt-2 text-sm text-gray-600">로그아웃하시겠습니까?</p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            @click="isLogoutModalOpen = false"
          >
            취소
          </button>
          <button
            type="button"
            class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            @click="handleSignOut"
          >
            로그아웃
          </button>
        </div>
      </div>
    </CommonModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useMyProfile } from "~/composables/useMyProfile";
import SidebarProfile from "~/components/sidebar/SidebarProfile.vue";
import SidebarCategories from "~/components/sidebar/SidebarCategories.vue";
import SidebarFooter from "~/components/sidebar/SidebarFooter.vue";
import { useCategorieTrees } from "~/composables/category/useCategories";

const user = useSupabaseUser();
const { signOut } = useAuth();
const { isAdmin, profile, error: profileError } = useMyProfile();
const { categorieTrees, loading, error } = useCategorieTrees();
const toast = useToast();
const isMenuOpen = ref(false);
const isLogoutModalOpen = ref(false);

const avatarSrc = computed(() => {
  return profile.value?.avatar_url || "https://placehold.co/160x160?text=User";
});
async function handleSignOut() {
  isLogoutModalOpen.value = false;
  await signOut();
}
const errorMessage = computed(() => {
  if (!error.value?.data) return "";
  return (error.value.data as string) || "카테고리를 불러오지 못했습니다.";
});

watch(error, (newError) => {
  if (!newError?.data) return;
  toast.error("카테고리를 불러오지 못했습니다.");
  console.error("카테고리 불러오기 에러:", newError.data);
});
watch(profileError, (newError) => {
  if (!newError?.data) return;
  toast.error("프로필을 불러오지 못했습니다.");
  console.error("프로필 불러오기 에러:", newError.data);
});
</script>
