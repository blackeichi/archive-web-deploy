<script setup lang="ts">
import type { PostForm } from "~/types/post";
import AdminPostEditor from "~/components/admin/posts/AdminPostEditor.vue";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "게시물 추가",
});

const router = useRouter();
const { categoryOptions, emptyForm, createPost } = usePosts();

const form = ref<PostForm>(emptyForm());

const submitForm = async (payload: PostForm) => {
  createPost(payload);
  await router.push("/admin/posts");
};
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">게시물 추가</h1>
        <p class="text-sm text-muted">
          마크다운으로 본문을 작성하고 오른쪽에서 미리보기를 확인하세요.
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
      mode="create"
      :form="form"
      :category-options="categoryOptions"
      @submit="submitForm"
    />
  </div>
</template>
