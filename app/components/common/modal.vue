<template>
  <div
    v-if="isModalOpen"
    :class="`fixed inset-0 z-50 bg-black/40 ${centerClass}`"
    @click.self="emit('update:isModalOpen', false)"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  isModalOpen: boolean;
  isCentered?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:isModalOpen", value: boolean): void;
}>();

const centerClass = computed(() => {
  return props.isCentered ? "flex items-center justify-center" : "";
});
</script>
