<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

interface Profile {
  name: string;
  email: string;
  avatar: string;
}

interface Props {
  profile: Profile;
  categories: NavigationMenuItem[];
}

defineProps<Props>();
</script>

<template>
  <aside
    class="hidden sm:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 h-screen overflow-y-auto"
  >
    <div class="p-6">
      <!-- 프로필 섹션 -->
      <div class="mb-6 pb-6 border-b border-gray-200">
        <AdminProfileCard
          :name="profile.name"
          :email="profile.email"
          :avatar="profile.avatar"
          size="lg"
        />
      </div>

      <!-- 카테고리 리스트 -->
      <UNavigationMenu orientation="vertical" :items="categories" />
    </div>
  </aside>
</template>
