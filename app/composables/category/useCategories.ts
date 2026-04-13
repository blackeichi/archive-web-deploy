import type { DbCategory, CategoryTreeItem } from "~/types/category";

export function useCategorieTrees() {
  const { request } = useApi();

  const { data, pending, error, refresh } = useAsyncData<CategoryTreeItem[]>(
    "categorieTrees",
    () => request<CategoryTreeItem[]>("/categories/tree"),
    {
      default: () => [],
    },
  );
  return {
    categorieTrees: data,
    loading: pending,
    error,
    fetchCategorieTrees: refresh,
  };
}

export function useCategories() {
  const { request } = useApi();

  return useAsyncData("categories", () => {
    return request<DbCategory[]>("/categories");
  });
}
