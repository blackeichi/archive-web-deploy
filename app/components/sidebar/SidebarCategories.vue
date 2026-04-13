<template>
  <nav class="flex-1 overflow-y-auto p-4">
    <div class="mb-4">
      <NuxtLink
        to="/"
        class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        @click="emit('navigate')"
      >
        🏠 홈
      </NuxtLink>
    </div>

    <div class="mb-4">
      <NuxtLink
        to="/posts/new"
        class="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        @click="emit('navigate')"
      >
        ✏️ 글쓰기
      </NuxtLink>
    </div>

    <div v-if="isAdmin" class="mb-4">
      <NuxtLink
        to="/settings"
        class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        @click="emit('navigate')"
      >
        ⚙️ 관리자 설정
      </NuxtLink>
    </div>

    <div v-if="loading" class="px-3 py-2 text-sm text-gray-400">
      카테고리 불러오는 중...
    </div>

    <div v-else-if="error" class="px-3 py-2 text-sm text-red-500">
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <div v-for="root in categorieTrees" :key="root.id">
        <NuxtLink
          :to="`/categories/${root.slug}`"
          class="mb-2 block rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
          @click="emit('navigate')"
        >
          {{ root.name }}
        </NuxtLink>

        <div v-if="root.children?.length" class="space-y-1 pl-3">
          <NuxtLink
            v-for="child in root.children"
            :key="child.id"
            :to="`/categories/${child.slug}`"
            class="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            @click="emit('navigate')"
          >
            {{ child.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { CategoryTreeItem } from "~/types/category";

defineProps<{
  categorieTrees: CategoryTreeItem[];
  loading: boolean;
  error: string;
  isAdmin: boolean;
}>();
const emit = defineEmits<{
  navigate: [];
}>();
</script>
