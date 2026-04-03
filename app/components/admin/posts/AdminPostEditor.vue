<script setup lang="ts">
import MarkdownIt from "markdown-it";
import { nextTick, reactive, toRaw } from "vue";
import type { PostForm, PostStatus } from "~/types/post";
import { slugifyPost } from "~/utils/post";

const props = defineProps<{
  mode: "create" | "edit";
  form: PostForm;
  categoryOptions: { label: string; value: number | "all" }[];
}>();

const emit = defineEmits<{
  submit: [value: PostForm];
}>();

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

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

const editorRef = ref<HTMLTextAreaElement | null>(null);
const imageInputRef = ref<HTMLInputElement | null>(null);
const isUploadingImage = ref(false);
const tempImages = ref<{ name: string; url: string; sizeText: string }[]>([]);

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

const previewHtml = computed(() => {
  if (!localForm.content.trim()) {
    return `<p class="text-sm text-muted">왼쪽에서 마크다운을 입력하면 여기에 미리보기가 표시됩니다.</p>`;
  }

  return md.render(localForm.content);
});

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const sanitizeFileName = (name: string) => {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim() || "image"
  );
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () =>
      reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
    reader.readAsDataURL(file);
  });

const insertTextAtCursor = async (text: string) => {
  const textarea = editorRef.value;

  if (!textarea) {
    localForm.content = `${localForm.content}${localForm.content ? "\n\n" : ""}${text}`;
    return;
  }

  const start = textarea.selectionStart ?? localForm.content.length;
  const end = textarea.selectionEnd ?? localForm.content.length;
  const prefix = localForm.content.slice(0, start);
  const suffix = localForm.content.slice(end);
  const needsLeadingBreak = prefix.length > 0 && !prefix.endsWith("\n\n");
  const insertion = `${needsLeadingBreak ? "\n\n" : ""}${text}\n`;

  localForm.content = `${prefix}${insertion}${suffix}`;

  await nextTick();

  const nextCursor = prefix.length + insertion.length;
  textarea.focus();
  textarea.setSelectionRange(nextCursor, nextCursor);
};

const triggerImageUpload = () => {
  imageInputRef.value?.click();
};

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const [file] = input.files || [];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    input.value = "";
    return;
  }

  isUploadingImage.value = true;

  try {
    const dataUrl = await readFileAsDataUrl(file);
    const altText = sanitizeFileName(file.name);
    const markdown = `![${altText}](${dataUrl})`;

    tempImages.value.unshift({
      name: file.name,
      url: dataUrl,
      sizeText: formatBytes(file.size),
    });

    await insertTextAtCursor(markdown);
  } finally {
    isUploadingImage.value = false;
    input.value = "";
  }
};

const submit = () => {
  emit("submit", { ...toRaw(localForm) });
};
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-4 lg:grid-cols-2">
      <div class="space-y-4 rounded-2xl border border-default p-4">
        <h2 class="text-lg font-semibold">
          {{ mode === "create" ? "새 게시물 작성" : "게시물 수정" }}
        </h2>

        <UFormField label="제목" required>
          <UInput v-model="localForm.title" placeholder="게시물 제목" />
        </UFormField>

        <UFormField label="슬러그" required>
          <UInput v-model="localForm.slug" placeholder="post-slug" />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
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
        </div>

        <UFormField label="요약">
          <UTextarea
            v-model="localForm.summary"
            :rows="3"
            placeholder="목록에서 보여줄 요약"
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

      <div class="hidden rounded-2xl border border-default p-4 sm:block">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-lg font-semibold">미리보기</h2>
          <UBadge color="neutral" variant="subtle">Markdown Preview</UBadge>
        </div>

        <div
          class="prose prose-sm max-w-none min-h-[500px] overflow-auto dark:prose-invert"
          v-html="previewHtml"
        />
      </div>
    </div>

    <div class="rounded-2xl border border-default p-4">
      <div class="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold">본문</h2>
          <p class="text-xs text-muted sm:hidden">
            작은 화면에서는 미리보기가 숨겨집니다.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />

          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-image-plus"
            :loading="isUploadingImage"
            @click="triggerImageUpload"
          >
            이미지 임시 업로드
          </UButton>
        </div>
      </div>

      <div
        class="mb-4 rounded-xl border border-dashed border-default bg-elevated/40 p-3 text-sm"
      >
        <p class="font-medium">임시 업로드 동작</p>
        <p class="mt-1 text-muted">
          지금은 이미지를 브라우저에서만 임시로 읽어와 본문에 마크다운 링크로
          삽입합니다. 페이지를 새로고침하거나 닫으면 이 임시 이미지는 유지되지
          않습니다.
        </p>
      </div>

      <textarea
        ref="editorRef"
        v-model="localForm.content"
        rows="20"
        placeholder="# 제목

여기에 마크다운 본문을 작성하세요."
        class="min-h-[420px] w-full rounded-xl border border-default bg-default px-3 py-2 font-mono text-sm outline-none transition focus:border-primary"
      />

      <div v-if="tempImages.length" class="mt-4 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">
            이번 편집에서 추가한 임시 이미지
          </h3>
          <UBadge color="neutral" variant="subtle"
            >{{ tempImages.length }}개</UBadge
          >
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="image in tempImages"
            :key="`${image.name}-${image.url.slice(0, 24)}`"
            class="overflow-hidden rounded-xl border border-default"
          >
            <img
              :src="image.url"
              :alt="image.name"
              class="h-32 w-full object-cover"
            />
            <div class="space-y-1 p-3">
              <p class="truncate text-sm font-medium">{{ image.name }}</p>
              <p class="text-xs text-muted">{{ image.sizeText }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end gap-2">
      <UButton color="neutral" variant="soft" to="/admin/posts"> 취소 </UButton>
      <UButton @click="submit">
        {{ mode === "create" ? "게시물 추가" : "변경사항 저장" }}
      </UButton>
    </div>
  </div>
</template>
