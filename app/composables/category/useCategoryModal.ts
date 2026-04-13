import type { Ref } from "vue";
import type {
  DbCategory,
  CategoryForm,
  CategoryTreeItem,
} from "~/types/category";

export function useCategoryModal(
  localCategories: Ref<DbCategory[]>,
  categoryTree: Ref<CategoryTreeItem[]>,
  toast: ReturnType<typeof useToast>,
  refresh: () => Promise<void>,
) {
  const modal = reactive({
    open: false,
    mode: "create" as "create" | "edit",
    submitting: false,
  });

  const form = reactive<CategoryForm>({
    type: "root",
    parent_id: null,
    name: "",
    description: "",
    is_guest_room: false,
  });

  const { request } = useApi();

  function openRootCreateModal() {
    modal.open = true;
    modal.mode = "create";

    Object.assign(form, {
      id: undefined,
      type: "root",
      parent_id: null,
      name: "",
      description: "",
      is_guest_room: false,
    });
  }

  function openChildCreateModal(rootId?: number) {
    modal.open = true;
    modal.mode = "create";

    Object.assign(form, {
      id: undefined,
      type: "child",
      parent_id: rootId ?? categoryTree.value[0]?.id ?? null,
      name: "",
      description: "",
      is_guest_room: false,
    });
  }

  function openEditModal(category: CategoryTreeItem) {
    modal.open = true;
    modal.mode = "edit";

    Object.assign(form, {
      id: category.id,
      type: category.type,
      parent_id: category.parent_id,
      name: category.name,
      description: category.description ?? "",
      is_guest_room: category.is_guest_room,
    });
  }

  function closeModal() {
    if (modal.submitting) return;
    modal.open = false;
  }

  function getNextSortOrder() {
    const siblings = localCategories.value.filter((item) =>
      form.type === "root"
        ? item.type === "root"
        : item.parent_id === form.parent_id,
    );

    if (siblings.length === 0) return 1;
    return Math.max(...siblings.map((item) => item.sort_order)) + 1;
  }

  function normalizeDescription(value: string) {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

  async function submitCategoryForm() {
    const trimmedName = form.name.trim();
    const trimmedDescription = normalizeDescription(form.description);

    if (!trimmedName) {
      toast.error("카테고리 이름을 입력해주세요.");
      return;
    }

    if (form.type === "child" && form.parent_id === null) {
      toast.error("소분류는 상위 대분류를 선택해야 합니다.");
      return;
    }

    const slug = slugify(trimmedName);

    try {
      modal.submitting = true;

      if (modal.mode === "create") {
        const payload = {
          parent_id: form.type === "root" ? null : form.parent_id,
          type: form.type,
          name: trimmedName,
          slug,
          description: trimmedDescription,
          sort_order: getNextSortOrder(),
          is_guest_room: form.is_guest_room,
        };

        await request<DbCategory>("/categories", {
          method: "POST",
          body: payload,
        });

        toast.success("카테고리를 추가했습니다.");
      } else {
        if (!form.id) {
          toast.error("수정할 카테고리 ID가 없습니다.");
          return;
        }

        const target = localCategories.value.find(
          (item) => item.id === form.id,
        );

        if (!target) {
          toast.error("수정할 카테고리를 찾지 못했습니다.");
          return;
        }

        const payload = {
          parent_id: form.type === "root" ? null : form.parent_id,
          type: form.type,
          name: trimmedName,
          slug,
          description: trimmedDescription,
          is_guest_room: form.is_guest_room,
        };

        await request<DbCategory>(`/categories/${form.id}`, {
          method: "PATCH",
          body: payload,
        });

        toast.success("카테고리를 수정했습니다.");
      }
    } catch (error: any) {
      console.error("카테고리 저장 실패:", error);

      const message =
        error?.data ||
        error?.data?.message ||
        error?.message ||
        "카테고리 저장에 실패했습니다.";

      toast.error(String(message));
    } finally {
      refresh();
      modal.submitting = false;
      closeModal();
    }
  }

  return {
    modal,
    form,
    openRootCreateModal,
    openChildCreateModal,
    openEditModal,
    closeModal,
    submitCategoryForm,
  };
}
