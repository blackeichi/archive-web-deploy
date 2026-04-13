import type { CreatePostBody, DbPost, PostListItem } from "~/types/post";

export function usePostsByCategory(categoryId: Ref<string | null>) {
  const { request } = useApi();

  return useAsyncData(
    () => `postsByCategory-${categoryId.value}`,
    () => {
      return request<PostListItem[]>(`/posts/category/${categoryId.value}`);
    },
    {
      watch: [categoryId],
    },
  );
}

export function usePosts() {
  const { request } = useApi();

  async function createPost(payload: CreatePostBody) {
    return await request<DbPost>("/posts", {
      method: "POST",
      body: payload,
    });
  }

  return {
    createPost,
  };
}
