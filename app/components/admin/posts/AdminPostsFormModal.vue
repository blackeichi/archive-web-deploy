<script setup lang="ts">
import { toRaw } from "vue";
import type { PostForm, PostStatus } from "~/types/post";
import { slugifyPost } from "~/utils/post";

const props = defineProps<{
  open: boolean;
  mode: "create" | "edit";
  form: PostForm;
  categoryOptions: { label: string; value: number | "all" }[];
}>();

const emit = defineEmits<{
  updateOpen: [value: boolean];
  submit: [value: PostForm];
}>();

const localForm = reactive<PostForm>({
  id: undefined,
  title: "",
  slug: "",
  summary: "",
  content: "",
  categoryId: null,
  status: "draft",
  isPinned: false,
});

const statusOptions: { label: string; value: PostStatus }[] = [
  { label: "임시저장", value: "draft" },
  { label: "발행됨", value: "published" },
  { label: "보관됨", value: "archived" },
];

const formCategoryOptions = computed(
  () =>
    props.categoryOptions.filter((item) => item.value !== "all") as {
      label: string;
      value: number;
    }[],
);

watch(
  () => props.form,
  (value) => {
    Object.assign(localForm, { ...toRaw(value) });
  },
  { immediate: true, deep: true },
);

watch(
  () => localForm.title,
  (value) => {
    if (!localForm.slug) {
      localForm.slug = slugifyPost(value);
    }
  },
);

const close = () => emit("updateOpen", false);

const submit = () => {
  emit("submit", { ...toRaw(localForm) });
  close();
};
</script>

<template>
  <UModal
    :open="open"
    :title="mode === 'create' ? '게시물 추가' : '게시물 수정'"
    @update:open="emit('updateOpen', $event)"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField label="제목" required>
          <UInput v-model="localForm.title" placeholder="게시물 제목" />
        </UFormField>

        <UFormField label="슬러그" required>
          <UInput v-model="localForm.slug" placeholder="post-slug" />
        </UFormField>

        <UFormField label="카테고리">
          <USelect
            v-model="localForm.categoryId"
            :items="formCategoryOptions"
            placeholder="카테고리 선택"
          />
        </UFormField>

        <UFormField label="상태">
          <USelect v-model="localForm.status" :items="statusOptions" />
        </UFormField>

        <UFormField label="요약">
          <UTextarea
            v-model="localForm.summary"
            :rows="3"
            placeholder="목록에서 보여줄 요약"
          />
        </UFormField>

        <UFormField label="본문">
          <UTextarea
            v-model="localForm.content"
            :rows="8"
            placeholder="여기는 나중에 에디터로 교체 가능"
          />
        </UFormField>

        <div
          class="flex items-center justify-between rounded-lg border border-default p-3"
        >
          <div>
            <p class="font-medium">상단 고정</p>
            <p class="text-sm text-muted">
              중요 게시물을 목록 상단에 고정합니다.
            </p>
          </div>
          <USwitch v-model="localForm.isPinned" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="soft" @click="close"> 취소 </UButton>
        <UButton @click="submit">
          {{ mode === "create" ? "추가" : "저장" }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
