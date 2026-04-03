import type { PostForm, PostItem, PostStatus } from "~/types/post";

const mockPosts: PostItem[] = [
  {
    id: 1,
    title: "Nuxt 3 프로젝트 시작 정리",
    slug: "nuxt-3-project-start",
    summary: "Nuxt 3로 관리자 웹을 시작할 때 필요한 초기 설정 정리",
    content: `# Nuxt 3 프로젝트 시작 정리\n\nNuxt 3 관리자 웹을 시작할 때 먼저 확인할 것들입니다.\n\n## 체크리스트\n\n- 라우팅 구조 설계\n- 레이아웃 분리\n- 상태 관리 범위 정의\n- API 연동 방식 정리`,
    categoryId: 102,
    categoryName: "Nuxt",
    status: "published",
    isPinned: true,
    viewCount: 142,
    createdAt: "2026-04-01",
    updatedAt: "2026-04-03",
  },
  {
    id: 2,
    title: "Vue 컴포넌트 설계 메모",
    slug: "vue-component-design-note",
    summary: "컴포넌트 분리 기준과 props 이벤트 설계",
    content: `# Vue 컴포넌트 설계 메모\n\n재사용 가능한 컴포넌트를 만들 때는 역할을 작게 나누는 것이 좋습니다.\n\n> props와 emit의 책임을 분명히 하세요.`,
    categoryId: 101,
    categoryName: "Vue",
    status: "draft",
    isPinned: false,
    viewCount: 17,
    createdAt: "2026-03-29",
    updatedAt: "2026-04-02",
  },
  {
    id: 3,
    title: "독서 기록 템플릿",
    slug: "reading-note-template",
    summary: "독서 아카이브용 기록 템플릿 초안",
    content: `# 독서 기록 템플릿\n\n## 책 정보\n- 제목:\n- 저자:\n- 읽은 날짜:\n\n## 인상 깊은 문장\n\n## 나의 메모`,
    categoryId: 201,
    categoryName: "인문학",
    status: "archived",
    isPinned: false,
    viewCount: 53,
    createdAt: "2026-03-20",
    updatedAt: "2026-03-25",
  },
];

export const usePosts = () => {
  const posts = useState<PostItem[]>("admin-posts", () =>
    mockPosts.map((item) => ({ ...item })),
  );
  const search = useState("admin-post-search", () => "");
  const selectedStatus = useState<PostStatus | "all">(
    "admin-post-status",
    () => "all",
  );
  const selectedCategoryId = useState<number | "all">(
    "admin-post-category",
    () => "all",
  );

  const categoryOptions = computed(() => [
    { label: "전체 카테고리", value: "all" },
    { label: "Vue", value: 101 },
    { label: "Nuxt", value: 102 },
    { label: "인문학", value: 201 },
  ]);

  const statusOptions = computed(() => [
    { label: "전체 상태", value: "all" },
    { label: "임시저장", value: "draft" },
    { label: "발행됨", value: "published" },
    { label: "보관됨", value: "archived" },
  ]);

  const filteredPosts = computed(() => {
    const keyword = search.value.trim().toLowerCase();

    return posts.value.filter((post) => {
      const matchesKeyword =
        !keyword ||
        post.title.toLowerCase().includes(keyword) ||
        post.slug.toLowerCase().includes(keyword) ||
        post.summary.toLowerCase().includes(keyword);

      const matchesStatus =
        selectedStatus.value === "all" || post.status === selectedStatus.value;

      const matchesCategory =
        selectedCategoryId.value === "all" ||
        post.categoryId === selectedCategoryId.value;

      return matchesKeyword && matchesStatus && matchesCategory;
    });
  });

  const nextId = () => Date.now();

  const getCategoryName = (categoryId: number | null) => {
    const map: Record<number, string> = {
      101: "Vue",
      102: "Nuxt",
      201: "인문학",
    };

    if (!categoryId) return "미분류";
    return map[categoryId] || "미분류";
  };

  const getPostById = (id: number) => {
    return posts.value.find((post) => post.id === id) ?? null;
  };

  const createPost = (payload: PostForm) => {
    const now = new Date().toISOString().slice(0, 10);

    posts.value.unshift({
      id: nextId(),
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary,
      content: payload.content,
      categoryId: payload.categoryId,
      categoryName: getCategoryName(payload.categoryId),
      status: payload.status,
      isPinned: payload.isPinned,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updatePost = (payload: PostForm) => {
    if (!payload.id) return;

    const target = posts.value.find((post) => post.id === payload.id);
    if (!target) return;

    target.title = payload.title;
    target.slug = payload.slug;
    target.summary = payload.summary;
    target.content = payload.content;
    target.categoryId = payload.categoryId;
    target.categoryName = getCategoryName(payload.categoryId);
    target.status = payload.status;
    target.isPinned = payload.isPinned;
    target.updatedAt = new Date().toISOString().slice(0, 10);
  };

  const deletePost = (id: number) => {
    const index = posts.value.findIndex((post) => post.id === id);
    if (index >= 0) {
      posts.value.splice(index, 1);
    }
  };

  const togglePinned = (id: number) => {
    const target = posts.value.find((post) => post.id === id);
    if (!target) return;
    target.isPinned = !target.isPinned;
    target.updatedAt = new Date().toISOString().slice(0, 10);
  };

  const changeStatus = (id: number, status: PostStatus) => {
    const target = posts.value.find((post) => post.id === id);
    if (!target) return;
    target.status = status;
    target.updatedAt = new Date().toISOString().slice(0, 10);
  };

  const emptyForm = (): PostForm => ({
    title: "",
    slug: "",
    summary: "",
    content: "",
    categoryId: null,
    status: "draft",
    isPinned: false,
  });

  const toForm = (post: PostItem): PostForm => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content,
    categoryId: post.categoryId,
    status: post.status,
    isPinned: post.isPinned,
  });

  return {
    posts,
    search,
    selectedStatus,
    selectedCategoryId,
    statusOptions,
    categoryOptions,
    filteredPosts,
    emptyForm,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    togglePinned,
    changeStatus,
    toForm,
  };
};
