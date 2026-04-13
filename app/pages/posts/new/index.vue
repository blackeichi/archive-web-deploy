<script setup lang="ts">
import type { CreatePostBody, PostVisibility } from "~/types/post";
import { usePosts } from "~/composables/post/usePosts";
import { useCategories } from "~/composables/category/useCategories";
import { useStorage } from "~/composables/useStorage";
import MarkdownRenderer from "~/components/common/MarkdownRenderer.vue";

definePageMeta({
  middleware: ["admin"],
  layout: "default",
});

const toast = useToast();
const { createPost } = usePosts();
const { uploadImage } = useStorage();
const { data: categories, pending: categoriesLoading } = await useCategories();

const editorRef = ref<HTMLTextAreaElement | null>(null);
const isDraggingEditor = ref(false);
const isUploadingEditorImage = ref(false);

const form = reactive({
  category_id: null as number | null,
  title: "",
  slug: "",
  content_md: "",
  summary: "",
  thumbnail_url: "",
  visibility: "public" as PostVisibility,
});

const isSubmitting = ref(false);
const isSlugManuallyEdited = ref(false);

watch(
  () => form.title,
  (value) => {
    if (isSlugManuallyEdited.value) return;
    form.slug = slugify(value);
  },
);

function onSlugInput(value: string) {
  form.slug = value;
  isSlugManuallyEdited.value = true;
}

function resetSlug() {
  form.slug = slugify(form.title);
  isSlugManuallyEdited.value = false;
}

const categoryOptions = computed(() => {
  return (categories.value ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type,
  }));
});

function insertTextAtCursor(text: string) {
  const textarea = editorRef.value;

  if (!textarea) {
    form.content_md += text;
    return;
  }

  const start = textarea.selectionStart ?? form.content_md.length;
  const end = textarea.selectionEnd ?? form.content_md.length;

  form.content_md =
    form.content_md.slice(0, start) + text + form.content_md.slice(end);

  nextTick(() => {
    const cursor = start + text.length;
    textarea.focus();
    textarea.setSelectionRange(cursor, cursor);
  });
}

async function uploadAndInsertImage(file: File) {
  try {
    isUploadingEditorImage.value = true;

    const { url } = await uploadImage(file);

    const alt = file.name.replace(/\.[^/.]+$/, "") || "image";
    const markdown = `\n![${alt}](${url})\n`;

    insertTextAtCursor(markdown);
    toast.success("이미지를 본문에 추가했습니다.");
  } catch (error: any) {
    console.error(error);
    toast.error(error?.message || "이미지 업로드에 실패했습니다.");
  } finally {
    isUploadingEditorImage.value = false;
  }
}

async function onEditorPaste(event: ClipboardEvent) {
  const items = event.clipboardData?.items;
  if (!items?.length) return;

  const imageItem = Array.from(items).find((item) =>
    item.type.startsWith("image/"),
  );

  if (!imageItem) return;

  const file = imageItem.getAsFile();
  if (!file) return;

  event.preventDefault();
  await uploadAndInsertImage(file);
}

function onEditorDragOver(event: DragEvent) {
  const hasFile = Array.from(event.dataTransfer?.items ?? []).some(
    (item) => item.kind === "file" && item.type.startsWith("image/"),
  );

  if (!hasFile) return;

  event.preventDefault();
  isDraggingEditor.value = true;
}

function onEditorDragLeave() {
  isDraggingEditor.value = false;
}

async function onEditorDrop(event: DragEvent) {
  const files = Array.from(event.dataTransfer?.files ?? []);
  const imageFile = files.find((file) => file.type.startsWith("image/"));

  isDraggingEditor.value = false;

  if (!imageFile) return;

  event.preventDefault();
  await uploadAndInsertImage(imageFile);
}

// 썸네일 업로드
const thumbnailInputRef = ref<HTMLInputElement | null>(null);
const isUploadingThumbnail = ref(false);

async function onThumbnailChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  try {
    isUploadingThumbnail.value = true;

    const { url } = await uploadImage(file);
    form.thumbnail_url = url;

    toast.success("썸네일 이미지를 업로드했습니다.");
  } catch (error: any) {
    console.error(error);
    toast.error(error?.message || "썸네일 업로드에 실패했습니다.");
  } finally {
    isUploadingThumbnail.value = false;

    // 같은 파일 다시 선택 가능하게 초기화
    if (input) {
      input.value = "";
    }
  }
}

function triggerThumbnailSelect() {
  thumbnailInputRef.value?.click();
}

function removeThumbnail() {
  form.thumbnail_url = "";
  toast.success("썸네일을 제거했습니다.");
}

async function submitPost() {
  if (!form.category_id) {
    toast.error("카테고리를 선택해주세요.");
    return;
  }

  if (!form.title.trim()) {
    toast.error("제목을 입력해주세요.");
    return;
  }

  if (!form.slug.trim()) {
    toast.error("슬러그를 입력해주세요.");
    return;
  }

  if (!form.content_md.trim()) {
    toast.error("본문을 입력해주세요.");
    return;
  }

  const payload: CreatePostBody = {
    category_id: form.category_id,
    title: form.title.trim(),
    slug: form.slug.trim(),
    content_md: form.content_md,
    summary: form.summary.trim() ? form.summary.trim() : null,
    thumbnail_url: form.thumbnail_url.trim() ? form.thumbnail_url.trim() : null,
    visibility: form.visibility,
  };

  try {
    isSubmitting.value = true;
    await createPost(payload);
    toast.success("포스트를 작성했습니다.");
    await navigateTo("/settings");
  } catch (error: any) {
    console.error("포스트 작성 실패:", error);

    toast.error(
      error?.data?.message || error?.message || "포스트 작성에 실패했습니다.",
    );
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 px-6 py-8">
    <div class="mx-auto max-w-6xl">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-stone-900">새 포스트 작성</h1>
        <p class="mt-2 text-sm text-stone-500">
          제목 입력 시 slug가 자동 생성됩니다. 본문에는 이미지를 붙여넣거나
          드래그해서 넣을 수 있습니다.
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="submitPost">
        <section
          class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <h2 class="mb-4 text-base font-semibold text-stone-900">기본 정보</h2>

          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-xs text-stone-500">카테고리</label>
              <select
                v-model="form.category_id"
                class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
                :disabled="categoriesLoading"
              >
                <option :value="null">카테고리를 선택하세요</option>
                <option
                  v-for="category in categoryOptions"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.type === "root" ? "[대분류]" : "[소분류]" }}
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs text-stone-500">제목</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="포스트 제목"
                class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-900"
              />
            </div>

            <div>
              <div class="mb-1 flex items-center justify-between">
                <label class="block text-xs text-stone-500">Slug</label>
                <button
                  type="button"
                  class="text-xs text-stone-600 hover:text-stone-900"
                  @click="resetSlug"
                >
                  제목 기준으로 다시 생성
                </button>
              </div>

              <input
                :value="form.slug"
                type="text"
                placeholder="post-slug"
                class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-900"
                @input="onSlugInput(($event.target as HTMLInputElement).value)"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs text-stone-500">요약</label>
              <textarea
                v-model="form.summary"
                rows="3"
                placeholder="포스트 요약"
                class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-900"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs text-stone-500">썸네일</label>

              <input
                ref="thumbnailInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onThumbnailChange"
              />

              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isUploadingThumbnail"
                    @click="triggerThumbnailSelect"
                  >
                    {{ isUploadingThumbnail ? "업로드 중..." : "이미지 선택" }}
                  </button>

                  <button
                    v-if="form.thumbnail_url"
                    type="button"
                    class="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    @click="removeThumbnail"
                  >
                    제거
                  </button>
                </div>

                <div
                  v-if="form.thumbnail_url"
                  class="overflow-hidden rounded-xl border border-stone-200 bg-stone-50"
                >
                  <img
                    :src="form.thumbnail_url"
                    alt="썸네일 미리보기"
                    class="h-48 w-48 max-w-full object-cover mx-auto my-4"
                  />
                </div>

                <p v-else class="text-xs text-stone-400">
                  업로드한 이미지가 썸네일로 사용됩니다.
                </p>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-xs text-stone-500">공개 범위</label>
              <select
                v-model="form.visibility"
                class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
              >
                <option value="public">public</option>
                <option value="private">private</option>
              </select>
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-base font-semibold text-stone-900">본문</h2>
              <p class="mt-1 text-xs text-stone-500">
                이미지 붙여넣기(Ctrl/Cmd+V) 또는 드래그앤드롭을 지원합니다.
              </p>
            </div>

            <span v-if="isUploadingEditorImage" class="text-xs text-stone-500">
              이미지 업로드 중...
            </span>
          </div>

          <div
            class="relative rounded-xl border"
            :class="
              isDraggingEditor
                ? 'border-stone-900 bg-stone-100'
                : 'border-stone-300'
            "
            @dragover="onEditorDragOver"
            @dragleave="onEditorDragLeave"
            @drop="onEditorDrop"
          >
            <textarea
              ref="editorRef"
              v-model="form.content_md"
              rows="20"
              placeholder="# Markdown으로 포스트를 작성해보세요"
              class="min-h-[500px] w-full rounded-xl bg-transparent px-4 py-3 text-sm outline-none placeholder:text-stone-400"
              @paste="onEditorPaste"
            />

            <div
              v-if="isDraggingEditor"
              class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-stone-100/80 text-sm font-medium text-stone-700"
            >
              이미지를 놓으면 본문에 추가됩니다
            </div>
          </div>
        </section>
        <section
          class="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-stone-900">미리보기</h2>
            <span class="text-xs text-stone-500">Markdown Preview</span>
          </div>

          <div
            class="min-h-[420px] rounded-xl border border-stone-200 bg-stone-50 p-4"
          >
            <MarkdownRenderer :content="form.content_md" />
          </div>
        </section>
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="rounded-xl border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
            @click="navigateTo('/settings')"
          >
            취소
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || isUploadingEditorImage"
            class="rounded-xl border border-stone-900 bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ isSubmitting ? "저장 중..." : "작성하기" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
