import type { Ref } from "vue";
import type { CategoryTreeItem } from "~/types/category";
import type { PostListItem, PostVisibility } from "~/types/post";

export function useCategoryPosts(
  allPosts: Ref<PostListItem[]>,
  selectedCategory: Ref<CategoryTreeItem | null>,
) {
  const search = ref("");
  const visibilityFilter = ref<"all" | PostVisibility>("all");

  const filteredPosts = computed(() => {
    const target = selectedCategory.value;
    if (!target) return [];

    const categoryIds =
      target.type === "root"
        ? [target.id, ...target.children.map((child) => child.id)]
        : [target.id];

    const keyword = search.value.trim().toLowerCase();

    return allPosts.value
      .filter((post) => !post.is_deleted)
      .filter((post) => categoryIds.includes(post.category_id))
      .filter(
        (post) =>
          visibilityFilter.value === "all" ||
          post.visibility === visibilityFilter.value,
      )
      .filter((post) => {
        if (!keyword) return true;

        return [
          post.title,
          post.summary ?? "",
          post.author_name ?? "",
          post.category_name ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
  });

  const publicCount = computed(
    () =>
      filteredPosts.value.filter((post) => post.visibility === "public").length,
  );

  const privateCount = computed(
    () =>
      filteredPosts.value.filter((post) => post.visibility === "private")
        .length,
  );

  const totalViews = computed(() =>
    filteredPosts.value.reduce((sum, post) => sum + post.view_count, 0),
  );

  function handleSearch(payload: {
    search: string;
    visibilityFilter: "all" | PostVisibility;
  }) {
    search.value = payload.search;
    visibilityFilter.value = payload.visibilityFilter;
  }

  return {
    filteredPosts,
    publicCount,
    privateCount,
    totalViews,
    handleSearch,
  };
}
