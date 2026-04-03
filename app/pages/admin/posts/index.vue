<script setup lang="ts">
import type { PostItem } from "~/types/post";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "게시물 관리",
});

const {
  search,
  selectedStatus,
  selectedCategoryId,
  statusOptions,
  categoryOptions,
  filteredPosts,
  deletePost,
  togglePinned,
  changeStatus,
} = usePosts();

const deleteModalOpen = ref(false);
const deleteTarget = ref<{ id: number; title: string } | null>(null);

const openDelete = (post: PostItem) => {
  deleteTarget.value = {
    id: post.id,
    title: post.title,
  };
  deleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (!deleteTarget.value) return;
  deletePost(deleteTarget.value.id);
  deleteTarget.value = null;
  deleteModalOpen.value = false;
};
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
    <AdminPostsToolbar
      v-model:search="search"
      v-model:status="selectedStatus"
      v-model:category="selectedCategoryId"
      :total-count="filteredPosts.length"
      :status-options="statusOptions"
      :category-options="categoryOptions"
    />

    <AdminPostsTable
      :items="filteredPosts"
      @remove="openDelete"
      @toggle-pinned="(post) => togglePinned(post.id)"
      @change-status="(post, status) => changeStatus(post.id, status)"
    />

    <AdminPostsDeleteConfirmModal
      :open="deleteModalOpen"
      :title="`'${deleteTarget?.title || ''}' 게시물을 삭제할까요?`"
      description="실서비스에서는 연결된 댓글, 첨부파일, 검색 인덱스 정리도 함께 고려해야 합니다."
      @update-open="deleteModalOpen = $event"
      @confirm="confirmDelete"
    />
  </div>
</template>
