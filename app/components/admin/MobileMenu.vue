<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

interface Props {
  isOpen: boolean;
  categories: NavigationMenuItem[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
}>();
</script>

<template>
  <USlideover
    :open="props.isOpen"
    @update:open="emit('update:isOpen', $event)"
    side="left"
    close-icon="i-lucide-x"
  >
    <template #body>
      <div class="flex h-full flex-col p-6 sm:hidden">
        <UNavigationMenu orientation="vertical" :items="props.categories" />
      </div>
    </template>
  </USlideover>
</template>
