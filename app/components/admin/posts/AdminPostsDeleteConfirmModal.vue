<script setup lang="ts">
defineProps<{
  open: boolean;
  title?: string;
  description?: string;
}>();

const emit = defineEmits<{
  updateOpen: [value: boolean];
  confirm: [];
}>();
</script>

<template>
  <UModal
    :open="open"
    title="게시물 삭제"
    @update:open="emit('updateOpen', $event)"
  >
    <template #body>
      <div class="space-y-2">
        <p class="font-medium">{{ title || "정말 삭제하시겠습니까?" }}</p>
        <p class="text-sm text-muted">
          {{ description || "삭제 후 복구할 수 없습니다." }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          color="neutral"
          variant="soft"
          @click="emit('updateOpen', false)"
        >
          취소
        </UButton>
        <UButton color="error" @click="emit('confirm')"> 삭제 </UButton>
      </div>
    </template>
  </UModal>
</template>
