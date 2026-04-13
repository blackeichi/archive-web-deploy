<template>
  <div class="flex items-center justify-center border-b border-gray-200 p-6">
    <div class="flex flex-col items-center gap-3">
      <img
        :src="avatarSrc"
        alt="user avatar"
        class="h-20 w-20 rounded-full border border-gray-200 object-cover"
      />
      <div class="mb-3">
        <p class="text-sm font-semibold text-gray-800">
          {{ profile?.name || "...." }}
        </p>
        <p class="truncate text-xs text-gray-500">
          {{ profile?.email || "...." }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Profile } from "~/types/profile";

const props = defineProps<{
  profile: Profile | null;
}>();

const avatarSrc = computed(() => {
  return props.profile?.avatar_url || "https://placehold.co/160x160?text=User";
});
</script>
