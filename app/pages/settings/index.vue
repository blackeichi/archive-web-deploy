<script setup lang="ts">
import CategoryModal from "~/components/category/CategoryModal.vue";
import CategoryPostTable from "~/components/category/CategoryPostTable.vue";
import CategoryTreePanel from "~/components/category/CategoryTreePanel.vue";
import { useCategoryPageState } from "~/composables/category/useCategoryPageState";

definePageMeta({
  middleware: ["admin"],
  layout: "default",
});

const {
  categoryTree,
  selectedCategory,
  selectedCategoryId,
  selectedCategoryDescription,
  filteredPosts,
  publicCount,
  privateCount,
  totalViews,
  modal,
  form,
  reorderMode,
  hasPendingChanges,
  isSavingOrder,
  selectCategory,
  handleSearch,
  moveRoot,
  moveChild,
  startReorderMode,
  cancelReorderMode,
  saveReorderChanges,
  openRootCreateModal,
  openChildCreateModal,
  openEditModal,
  closeModal,
  submitCategoryForm,
  onEditPost,
  onDeletePost,
} = await useCategoryPageState();
</script>

<template>
  <div class="bg-gray-50">
    <div
      class="mx-auto grid w-full grid-cols-1 gap-6 px-6 py-6 2xl:grid-cols-2"
    >
      <CategoryTreePanel
        :category-tree="categoryTree"
        :selected-category-id="selectedCategoryId"
        :reorder-mode="reorderMode"
        :has-pending-changes="hasPendingChanges"
        :is-saving-order="isSavingOrder"
        @select="selectCategory"
        @move-root="moveRoot"
        @move-child="moveChild"
        @start-reorder="startReorderMode"
        @cancel-reorder="cancelReorderMode"
        @save-reorder="saveReorderChanges"
        @create-root="openRootCreateModal"
        @create-child="openChildCreateModal"
        @edit="openEditModal"
      />

      <CategoryPostTable
        :selected-category="selectedCategory"
        :selected-category-description="selectedCategoryDescription"
        :filtered-posts="filteredPosts"
        :public-count="publicCount"
        :private-count="privateCount"
        :total-views="totalViews"
        @handle-search="handleSearch"
        @edit-post="onEditPost"
        @delete-post="onDeletePost"
      />
    </div>

    <CategoryModal
      :open="modal.open"
      :mode="modal.mode"
      :form="form"
      :category-tree="categoryTree"
      @close="closeModal"
      @submit="submitCategoryForm"
    />
  </div>
</template>
