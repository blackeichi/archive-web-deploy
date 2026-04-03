<script setup lang="ts">
import type { PostStatus } from "~/types/post";

const searchModel = defineModel<string>("search", { default: "" });
const statusModel = defineModel<PostStatus | "all">("status", {
  default: "all",
});
const categoryModel = defineModel<number | "all">("category", {
  default: "all",
});

defineProps<{
  totalCount: number;
  statusOptions: { label: string; value: PostStatus | "all" }[];
  categoryOptions: { label: string; value: number | "all" }[];
}>();
</script>

<template>
  <div class="flex flex-col gap-4 rounded-2xl border border-default p-4">
    <div
      class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold">게시물 관리</h1>
        <p class="text-sm text-muted">전체 게시물 {{ totalCount }}개</p>
      </div>

      <UButton icon="i-lucide-square-pen" to="/admin/posts/create">
        게시물 추가
      </UButton>
    </div>

    <div class="grid gap-3 md:grid-cols-3">
      <UInput
        v-model="searchModel"
        icon="i-lucide-search"
        placeholder="제목, 슬러그, 요약 검색"
      />

      <USelect v-model="statusModel" :items="statusOptions" />

      <USelect v-model="categoryModel" :items="categoryOptions" />
    </div>
  </div>
</template>
