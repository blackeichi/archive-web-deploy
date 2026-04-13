import type { Ref } from "vue";
import type {
  DbCategory,
  CategoryTreeItem,
  CategoryReorderGroup,
} from "~/types/category";
import type { PostListItem } from "~/types/post";

export function useCategoryTree(
  localCategories: Ref<DbCategory[]>,
  allPosts: Ref<PostListItem[]>,
  selectedCategoryId: Ref<string | null>,
) {
  function countDirectPosts(categoryId: number) {
    return allPosts.value.filter(
      (post) => !post.is_deleted && post.category_id === categoryId,
    ).length;
  }

  const categoryTree = computed<CategoryTreeItem[]>(() => {
    const roots = localCategories.value
      .filter((category) => category.type === "root")
      .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);

    return roots.map((root) => {
      const children: CategoryTreeItem[] = localCategories.value
        .filter((category) => category.parent_id === root.id)
        .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
        .map((child) => {
          const directPostCount = countDirectPosts(child.id);

          return {
            ...child,
            children: [],
            directPostCount,
            totalPostCount: directPostCount,
          };
        });

      const directPostCount = countDirectPosts(root.id);
      const totalPostCount =
        directPostCount +
        children.reduce((sum, child) => sum + child.directPostCount, 0);

      return {
        ...root,
        children,
        directPostCount,
        totalPostCount,
      };
    });
  });

  const selectedCategory = computed<CategoryTreeItem | null>(() => {
    const roots = categoryTree.value;

    for (const root of roots) {
      if (root.id === Number(selectedCategoryId.value)) return root;

      const child = root.children.find(
        (item) => String(item.id) === selectedCategoryId.value,
      );

      if (child) return child;
    }

    return roots[0] ?? null;
  });

  const selectedCategoryDescription = computed(() => {
    if (!selectedCategory.value) {
      return "왼쪽 카테고리 목록에서 항목을 선택하세요.";
    }

    if (selectedCategory.value.type === "root") {
      return "대분류 선택 시 해당 대분류에 직접 속한 포스트와 하위 소분류 포스트를 함께 표시합니다.";
    }

    return "소분류 선택 시 해당 소분류에 직접 속한 포스트만 표시합니다.";
  });

  function sortCategories(items: DbCategory[]) {
    return [...items].sort(
      (a, b) => a.sort_order - b.sort_order || a.id - b.id,
    );
  }

  function reassignSortOrder(items: DbCategory[]) {
    items.forEach((item, index) => {
      item.sort_order = index + 1;
    });
  }

  function moveRoot(index: number, direction: "up" | "down") {
    const roots = sortCategories(
      localCategories.value.filter((item) => item.type === "root"),
    );

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (!roots[index] || !roots[targetIndex]) return;

    [roots[index], roots[targetIndex]] = [roots[targetIndex], roots[index]];
    reassignSortOrder(roots);
  }

  function moveChild(rootId: number, index: number, direction: "up" | "down") {
    const children = sortCategories(
      localCategories.value.filter((item) => item.parent_id === rootId),
    );

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (!children[index] || !children[targetIndex]) return;

    [children[index], children[targetIndex]] = [
      children[targetIndex],
      children[index],
    ];
    reassignSortOrder(children);
  }

  function buildReorderGroups(): CategoryReorderGroup[] {
    const groups: CategoryReorderGroup[] = [];

    const roots = sortCategories(
      localCategories.value.filter((item) => item.type === "root"),
    );

    groups.push({
      parent_id: null,
      items: roots.map((item, index) => ({
        id: item.id,
        sort_order: index + 1,
      })),
    });

    for (const root of roots) {
      const children = sortCategories(
        localCategories.value.filter((item) => item.parent_id === root.id),
      );

      if (!children.length) continue;

      groups.push({
        parent_id: root.id,
        items: children.map((item, index) => ({
          id: item.id,
          sort_order: index + 1,
        })),
      });
    }

    return groups;
  }

  function selectCategory(categoryId: number) {
    selectedCategoryId.value = String(categoryId);
  }

  return {
    categoryTree,
    selectedCategory,
    selectedCategoryDescription,
    moveRoot,
    moveChild,
    buildReorderGroups,
    selectCategory,
  };
}
