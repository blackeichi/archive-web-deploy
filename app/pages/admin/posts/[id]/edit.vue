<script setup lang="ts">
import type { PostForm } from "~/types/post";
import AdminPostEditor from "~/components/admin/posts/AdminPostEditor.vue";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const router = useRouter();
const { categoryOptions, getPostById, toForm, updatePost } = usePosts();

const postId = computed(() => Number(route.params.id));
const post = computed(() => getPostById(postId.value));

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "게시물을 찾을 수 없습니다.",
  });
}

const form = ref<PostForm>(toForm(post.value));

useSeoMeta({
  title: `${post.value.title} 수정`,
});

const submitForm = async (payload: PostForm) => {
  updatePost(payload);
  await router.push("/admin/posts");
};
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">게시물 수정</h1>
        <p class="text-sm text-muted">
          제목, 요약, 본문과 상태를 한 페이지에서 편집할 수 있습니다.
        </p>
      </div>

      <UButton
        color="neutral"
        variant="ghost"
        to="/admin/posts"
        icon="i-lucide-arrow-left"
      >
        목록으로
      </UButton>
    </div>

    <AdminPostEditor
      mode="edit"
      :form="form"
      :category-options="categoryOptions"
      @submit="submitForm"
    />
  </div>
</template>
