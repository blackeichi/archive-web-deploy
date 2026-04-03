<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const isMobileMenuOpen = ref(false);

// 프로필 정보 (나중에 실제 데이터로 교체)
const profile = {
  name: "관리자",
  email: "admin@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
};

// 카테고리 리스트
const categories = ref<NavigationMenuItem[]>([
  {
    label: "대시보드",
    icon: "heroicons:home",
    to: "/admin",
  },
  {
    label: "게시물 관리",
    icon: "heroicons:document-text",
    to: "/admin/posts",
  },
  {
    label: "카테고리 관리",
    icon: "heroicons:folder",
    to: "/admin/categories",
  },
  {
    label: "사용자 설정",
    icon: "heroicons:cog-6-tooth",
    to: "/admin/users",
  },
]);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 모바일 헤더 -->
    <AdminMobileHeader :profile="profile" @open-menu="toggleMobileMenu" />

    <!-- 모바일 메뉴 모달 -->
    <AdminMobileMenu
      v-model:is-open="isMobileMenuOpen"
      :categories="categories"
    />

    <div class="sm:flex">
      <!-- 데스크톱 사이드바 -->
      <AdminSidebar :profile="profile" :categories="categories" />

      <!-- 메인 콘텐츠 -->
      <main class="flex-1 p-4 sm:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
