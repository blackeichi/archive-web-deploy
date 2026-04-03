<script setup lang="ts">
const modelValue = defineModel<string>({ default: "" });

defineProps<{
  totalCount: number;
}>();

const emit = defineEmits<{
  createRoot: [];
}>();
</script>

<template>
  <div
    class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
  >
    <div>
      <h1 class="text-2xl font-bold">카테고리 관리</h1>
      <p class="text-sm text-muted">
        전체 카테고리 {{ totalCount }}개를 관리합니다.
      </p>
    </div>

    <div class="flex w-full gap-2 md:w-auto">
      <UInput
        v-model="modelValue"
        icon="i-lucide-search"
        placeholder="카테고리 검색"
        class="w-full md:w-72"
      />
      <UButton icon="i-lucide-folder-plus" @click="emit('createRoot')">
        대분류 추가
      </UButton>
    </div>
  </div>
</template>
