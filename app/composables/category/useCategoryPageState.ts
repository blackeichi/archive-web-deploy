import { ref, watch, toRaw } from "vue";
import type { DbCategory, CategoryReorderPayload } from "~/types/category";
import type { PostListItem } from "~/types/post";
import { useCategoryTree } from "~/composables/category/useCategoryTree";
import { useCategoryPosts } from "~/composables/category/useCategoryPosts";
import { useCategoryModal } from "~/composables/category/useCategoryModal";
import { useCategories } from "./useCategories";
import { usePostsByCategory } from "../post/usePosts";

export async function useCategoryPageState() {
  const toast = useToast();
  const { request } = useApi();
  const safeClone = <T>(value: T): T => structuredClone(toRaw(value));

  const { data: categories, error, refresh } = await useCategories();

  const localCategories = ref<DbCategory[]>([]);
  const selectedCategoryId = ref<string | null>(null);
  const reorderMode = ref(false);
  const isSavingOrder = ref(false);
  const reorderSnapshot = ref<DbCategory[]>([]);
  const hasPendingChanges = ref(false);
  const allPosts = ref<PostListItem[]>([]);

  const {
    data: postsData,
    refresh: refreshPosts,
    pending: postsLoading,
    error: postsError,
  } = await usePostsByCategory(selectedCategoryId);

  console.log(postsData, allPosts);

  watch(
    categories,
    (categoryList) => {
      if (reorderMode.value) return;
      localCategories.value =
        categoryList && categoryList.length > 0 ? safeClone(categoryList) : [];
      hasPendingChanges.value = false;
      reorderSnapshot.value = safeClone(localCategories.value);
    },
    { immediate: true },
  );

  watch(
    postsData,
    (postList) => {
      allPosts.value =
        postList && postList.length > 0 ? safeClone(postList) : [];
    },
    { immediate: true },
  );

  watch(error, (newError) => {
    if (!newError) return;

    toast.error("카테고리를 불러오지 못했습니다.");
    console.error("카테고리 불러오기 에러:", newError);
  });

  watch(postsError, (newError) => {
    if (!newError) return;

    toast.error("포스트를 불러오지 못했습니다.");
    console.error("포스트 불러오기 에러:", newError);
  });

  const {
    categoryTree,
    selectedCategory,
    selectedCategoryDescription,
    moveRoot,
    moveChild,
    buildReorderGroups,
    selectCategory,
  } = useCategoryTree(localCategories, allPosts, selectedCategoryId);

  const { filteredPosts, publicCount, privateCount, totalViews, handleSearch } =
    useCategoryPosts(allPosts, selectedCategory);

  const {
    modal,
    form,
    openRootCreateModal,
    openChildCreateModal,
    openEditModal,
    closeModal,
    submitCategoryForm,
  } = useCategoryModal(localCategories, categoryTree, toast, refresh);

  function computeDirtyState() {
    const currentSignature = localCategories.value
      .slice()
      .sort((a, b) => a.id - b.id)
      .map(
        (item) => `${item.id}:${item.parent_id ?? "null"}:${item.sort_order}`,
      )
      .join("|");

    const snapshotSignature = reorderSnapshot.value
      .slice()
      .sort((a, b) => a.id - b.id)
      .map(
        (item) => `${item.id}:${item.parent_id ?? "null"}:${item.sort_order}`,
      )
      .join("|");

    hasPendingChanges.value = currentSignature !== snapshotSignature;
  }

  function guardedMoveRoot(index: number, direction: "up" | "down") {
    if (!reorderMode.value || isSavingOrder.value) return;
    moveRoot(index, direction);
    computeDirtyState();
  }

  function guardedMoveChild(
    rootId: number,
    index: number,
    direction: "up" | "down",
  ) {
    if (!reorderMode.value || isSavingOrder.value) return;
    moveChild(rootId, index, direction);
    computeDirtyState();
  }

  function startReorderMode() {
    if (modal.open || isSavingOrder.value) return;
    reorderSnapshot.value = safeClone(localCategories.value);
    hasPendingChanges.value = false;
    reorderMode.value = true;
  }

  function cancelReorderMode() {
    if (isSavingOrder.value) return;
    localCategories.value = safeClone(reorderSnapshot.value);
    hasPendingChanges.value = false;
    reorderMode.value = false;
  }

  async function saveReorderChanges() {
    if (!reorderMode.value || !hasPendingChanges.value || isSavingOrder.value) {
      return;
    }

    const payload: CategoryReorderPayload = {
      groups: buildReorderGroups(),
    };

    try {
      isSavingOrder.value = true;

      await request("/categories/reorder", {
        method: "PATCH",
        body: payload,
      });

      reorderSnapshot.value = safeClone(localCategories.value);
      hasPendingChanges.value = false;
      reorderMode.value = false;
      toast.success("카테고리 순서를 저장했습니다.");
      await refresh();
    } catch (error: any) {
      console.error("카테고리 순서 저장 실패:", error);
      const message =
        error?.data?.message ||
        error?.data ||
        error?.message ||
        "카테고리 순서 저장에 실패했습니다.";
      toast.error(String(message));
    } finally {
      isSavingOrder.value = false;
    }
  }

  function guardedOpenRootCreateModal() {
    if (reorderMode.value) {
      toast.error("순서 변경 모드에서는 카테고리를 추가할 수 없습니다.");
      return;
    }

    openRootCreateModal();
  }

  function guardedOpenChildCreateModal(rootId?: number) {
    if (reorderMode.value) {
      toast.error("순서 변경 모드에서는 카테고리를 추가할 수 없습니다.");
      return;
    }

    openChildCreateModal(rootId);
  }

  function guardedOpenEditModal(category: any) {
    if (reorderMode.value) {
      toast.error("순서 변경 모드에서는 카테고리를 수정할 수 없습니다.");
      return;
    }

    openEditModal(category);
  }

  function onEditPost(post: PostListItem) {
    console.log("edit post", post);
  }

  function onDeletePost(postId: number) {
    allPosts.value = allPosts.value.map((post) =>
      post.id === postId
        ? {
            ...post,
            is_deleted: true,
          }
        : post,
    );

    toast.success("포스트를 삭제했습니다.");
  }

  return {
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
    moveRoot: guardedMoveRoot,
    moveChild: guardedMoveChild,
    startReorderMode,
    cancelReorderMode,
    saveReorderChanges,
    openRootCreateModal: guardedOpenRootCreateModal,
    openChildCreateModal: guardedOpenChildCreateModal,
    openEditModal: guardedOpenEditModal,
    closeModal,
    submitCategoryForm,
    onEditPost,
    onDeletePost,
  };
}
