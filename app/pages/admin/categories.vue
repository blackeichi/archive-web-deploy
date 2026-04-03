<script setup lang="ts">
import type {
  CategoryForm,
  CategoryGroup,
  CategoryItem,
} from "~/types/category";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "카테고리 관리",
});

const {
  groups,
  search,
  filteredGroups,
  parentOptions,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleVisibility,
  toForm,
} = useCategories();

const formModalOpen = ref(false);
const formMode = ref<"create" | "edit">("create");

const deleteModalOpen = ref(false);
const deleteTarget = ref<{ id: number; name: string } | null>(null);

const emptyForm = (): CategoryForm => ({
  parentId: null,
  name: "",
  slug: "",
  description: "",
  visible: true,
  order: 1,
});

const currentForm = ref<CategoryForm>(emptyForm());

const totalCount = computed(() => {
  return groups.value.reduce(
    (acc, group) => acc + 1 + group.children.length,
    0,
  );
});

const openCreateRoot = () => {
  formMode.value = "create";
  currentForm.value = emptyForm();
  formModalOpen.value = true;
};

const openCreateChild = (group: CategoryGroup) => {
  formMode.value = "create";
  currentForm.value = {
    ...emptyForm(),
    parentId: group.id,
    order: group.children.length + 1,
  };
  formModalOpen.value = true;
};

const openEditGroup = (group: CategoryGroup) => {
  formMode.value = "edit";
  currentForm.value = toForm(group, null);
  formModalOpen.value = true;
};

const openEditChild = (child: CategoryItem, parentId: number) => {
  formMode.value = "edit";
  currentForm.value = toForm(child, parentId);
  formModalOpen.value = true;
};

const submitForm = (form: CategoryForm) => {
  if (formMode.value === "create") {
    createCategory(form);
    return;
  }

  updateCategory(form);
};

const openDelete = (item: CategoryGroup | CategoryItem) => {
  deleteTarget.value = {
    id: item.id,
    name: item.name,
  };
  deleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (!deleteTarget.value) return;
  deleteCategory(deleteTarget.value.id);
  deleteModalOpen.value = false;
  deleteTarget.value = null;
};
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
    <AdminCategoriesToolbar
      v-model="search"
      :total-count="totalCount"
      @create-root="openCreateRoot"
    />

    <div class="grid gap-4">
      <AdminCategoriesGroupCard
        v-for="group in filteredGroups"
        :key="group.id"
        :group="group"
        @edit-group="openEditGroup"
        @delete-group="openDelete"
        @toggle-group="toggleVisibility($event.id)"
        @add-child="openCreateChild"
        @edit-child="openEditChild"
        @delete-child="openDelete"
        @toggle-child="toggleVisibility($event[0].id)"
      />
    </div>

    <div
      v-if="filteredGroups.length === 0"
      class="rounded-2xl border border-dashed border-default p-10 text-center"
    >
      <UIcon
        name="i-lucide-folder-search"
        class="mx-auto mb-3 size-10 text-muted"
      />
      <p class="font-medium">검색 결과가 없습니다.</p>
      <p class="text-sm text-muted">
        다른 검색어를 입력하거나 새 카테고리를 추가해보세요.
      </p>
    </div>

    <AdminCategoriesFormModal
      :open="formModalOpen"
      :mode="formMode"
      :form="currentForm"
      :parent-options="parentOptions"
      @update-open="formModalOpen = $event"
      @submit="submitForm"
    />

    <AdminCategoriesDeleteConfirmModal
      :open="deleteModalOpen"
      :title="`'${deleteTarget?.name || ''}' 카테고리를 삭제할까요?`"
      description="하위 항목이나 연결된 글이 있다면 실제 서비스에서는 추가 검증이 필요합니다."
      @update-open="deleteModalOpen = $event"
      @confirm="confirmDelete"
    />
  </div>
</template>
