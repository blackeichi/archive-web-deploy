<script setup lang="ts">
interface Profile {
  name: string;
  email: string;
  avatar: string;
}

interface Props {
  profile: Profile;
}

defineProps<Props>();

const emit = defineEmits<{
  openMenu: [];
}>();
</script>

<template>
  <header class="sm:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- 왼쪽: 메뉴 아이콘 -->
      <UButton
        icon="heroicons:bars-3"
        size="lg"
        variant="ghost"
        color="gray"
        @click="emit('openMenu')"
      />

      <!-- 오른쪽: 프로필 -->
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">{{ profile.name }}</span>
        <UAvatar :src="profile.avatar" :alt="profile.name" size="sm" />
      </div>
    </div>
  </header>
</template>
