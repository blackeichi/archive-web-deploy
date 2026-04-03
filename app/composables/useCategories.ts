import type {
  CategoryForm,
  CategoryGroup,
  CategoryItem,
} from "~/types/category";

const initialData: CategoryGroup[] = [
  {
    id: 1,
    name: "개발",
    slug: "development",
    description: "개발 관련 글",
    visible: true,
    order: 1,
    children: [
      {
        id: 101,
        name: "Vue",
        slug: "vue",
        description: "Vue 관련 정리",
        visible: true,
        order: 1,
      },
      {
        id: 102,
        name: "Nuxt",
        slug: "nuxt",
        description: "Nuxt 관련 정리",
        visible: true,
        order: 2,
      },
    ],
  },
  {
    id: 2,
    name: "독서",
    slug: "reading",
    description: "독서 노트",
    visible: true,
    order: 2,
    children: [
      {
        id: 201,
        name: "인문학",
        slug: "humanities",
        description: "인문학 메모",
        visible: true,
        order: 1,
      },
    ],
  },
];

export const useCategories = () => {
  const groups = useState<CategoryGroup[]>("category-groups", () =>
    structuredClone(initialData),
  );
  const search = useState("category-search", () => "");

  const filteredGroups = computed(() => {
    const keyword = search.value.trim().toLowerCase();
    if (!keyword) return groups.value;

    return groups.value
      .map((group) => {
        const groupMatched =
          group.name.toLowerCase().includes(keyword) ||
          group.slug.toLowerCase().includes(keyword);

        const filteredChildren = group.children.filter(
          (child) =>
            child.name.toLowerCase().includes(keyword) ||
            child.slug.toLowerCase().includes(keyword),
        );

        if (groupMatched) return group;
        if (filteredChildren.length > 0) {
          return {
            ...group,
            children: filteredChildren,
          };
        }

        return null;
      })
      .filter(Boolean) as CategoryGroup[];
  });

  const nextId = () => Date.now();

  const createCategory = (payload: CategoryForm) => {
    if (payload.parentId === null) {
      groups.value.push({
        id: nextId(),
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        visible: payload.visible,
        order: payload.order,
        children: [],
      });
      sortGroups();
      return;
    }

    const parent = groups.value.find((group) => group.id === payload.parentId);
    if (!parent) return;

    parent.children.push({
      id: nextId(),
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      visible: payload.visible,
      order: payload.order,
    });

    sortChildren(parent.id);
  };

  const updateCategory = (payload: CategoryForm) => {
    if (!payload.id) return;

    for (const group of groups.value) {
      if (group.id === payload.id && payload.parentId === null) {
        group.name = payload.name;
        group.slug = payload.slug;
        group.description = payload.description;
        group.visible = payload.visible;
        group.order = payload.order;
        sortGroups();
        return;
      }

      const child = group.children.find((item) => item.id === payload.id);
      if (child) {
        child.name = payload.name;
        child.slug = payload.slug;
        child.description = payload.description;
        child.visible = payload.visible;
        child.order = payload.order;
        sortChildren(group.id);
        return;
      }
    }
  };

  const deleteCategory = (id: number) => {
    const groupIndex = groups.value.findIndex((group) => group.id === id);
    if (groupIndex >= 0) {
      groups.value.splice(groupIndex, 1);
      return;
    }

    for (const group of groups.value) {
      const childIndex = group.children.findIndex((child) => child.id === id);
      if (childIndex >= 0) {
        group.children.splice(childIndex, 1);
        return;
      }
    }
  };

  const toggleVisibility = (id: number) => {
    for (const group of groups.value) {
      if (group.id === id) {
        group.visible = !group.visible;
        return;
      }

      const child = group.children.find((item) => item.id === id);
      if (child) {
        child.visible = !child.visible;
        return;
      }
    }
  };

  const sortGroups = () => {
    groups.value.sort((a, b) => a.order - b.order);
  };

  const sortChildren = (groupId: number) => {
    const group = groups.value.find((item) => item.id === groupId);
    if (!group) return;
    group.children.sort((a, b) => a.order - b.order);
  };

  const parentOptions = computed(() => [
    { label: "대분류", value: null },
    ...groups.value.map((group) => ({
      label: group.name,
      value: group.id,
    })),
  ]);

  const toForm = (
    item: CategoryGroup | CategoryItem,
    parentId: number | null,
  ): CategoryForm => ({
    id: item.id,
    parentId,
    name: item.name,
    slug: item.slug,
    description: item.description || "",
    visible: item.visible,
    order: item.order,
  });

  return {
    groups,
    search,
    filteredGroups,
    parentOptions,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleVisibility,
    toForm,
  };
};
