<script setup lang="ts">
import type { CategoryItem } from "~/types/category";

defineProps<{
  item: CategoryItem;
  isChild?: boolean;
}>();

const emit = defineEmits<{
  edit: [];
  remove: [];
  toggle: [];
  addChild: [];
}>();
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-xl border border-default p-4 md:flex-row md:items-center md:justify-between"
    :class="{ 'bg-muted/30': isChild }"
  >
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <UBadge :color="isChild ? 'neutral' : 'primary'" variant="subtle">
          {{ isChild ? "소분류" : "대분류" }}
        </UBadge>

        <span class="truncate font-medium">{{ item.name }}</span>

        <UBadge color="neutral" variant="outline"> /{{ item.slug }} </UBadge>
      </div>

      <p class="mt-1 text-sm text-muted">
        {{ item.description || "설명이 없습니다." }}
      </p>

      <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>정렬순서: {{ item.order }}</span>
        <span>상태: {{ item.visible ? "노출" : "숨김" }}</span>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted">노출</span>
        <USwitch
          :model-value="item.visible"
          @update:model-value="emit('toggle')"
        />
      </div>

      <UButton
        v-if="!isChild"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        @click="emit('addChild')"
      >
        소분류 추가
      </UButton>

      <UButton
        color="neutral"
        variant="soft"
        icon="i-lucide-pencil"
        @click="emit('edit')"
      >
        수정
      </UButton>

      <UButton
        color="error"
        variant="soft"
        icon="i-lucide-trash-2"
        @click="emit('remove')"
      >
        삭제
      </UButton>
    </div>
  </div>
</template>
