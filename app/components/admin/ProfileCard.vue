<script setup lang="ts">
interface Props {
  name: string;
  email: string;
  avatar: string;
  size?: "sm" | "lg";
}

withDefaults(defineProps<Props>(), {
  size: "lg",
});
</script>

<template>
  <div class="flex items-center gap-3">
    <UAvatar :src="avatar" :alt="name" :size="size" />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-gray-900 truncate">
        {{ name }}
      </p>
      <p class="text-xs text-gray-500 truncate">{{ email }}</p>
    </div>
  </div>
</template>
