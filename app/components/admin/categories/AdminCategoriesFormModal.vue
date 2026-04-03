<script setup lang="ts">
import type { CategoryForm } from "~/types/category";
import { slugify } from "~/utils/category";

const props = defineProps<{
  open: boolean;
  mode: "create" | "edit";
  form: CategoryForm;
  parentOptions: { label: string; value: number | null }[];
}>();

const emit = defineEmits<{
  updateOpen: [value: boolean];
  submit: [value: CategoryForm];
}>();

const localForm = reactive<CategoryForm>({
  id: undefined,
  parentId: null,
  name: "",
  slug: "",
  description: "",
  visible: true,
  order: 1,
});
watch(
  () => props.form,
  (value) => {
    Object.assign(localForm, { ...toRaw(value) });
  },
  { immediate: true, deep: true },
);

watch(
  () => localForm.name,
  (value) => {
    if (!localForm.slug) {
      localForm.slug = slugify(value);
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
    :title="mode === 'create' ? '카테고리 추가' : '카테고리 수정'"
    @update:open="emit('updateOpen', $event)"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField label="분류 타입">
          <USelect
            v-model="localForm.parentId"
            :items="parentOptions"
            option-attribute="label"
          />
        </UFormField>

        <UFormField label="이름" required>
          <UInput v-model="localForm.name" placeholder="카테고리 이름" />
        </UFormField>

        <UFormField label="슬러그" required>
          <UInput v-model="localForm.slug" placeholder="category-slug" />
        </UFormField>

        <UFormField label="설명">
          <UTextarea
            v-model="localForm.description"
            placeholder="카테고리 설명"
          />
        </UFormField>

        <UFormField label="정렬 순서">
          <UInput v-model.number="localForm.order" type="number" min="1" />
        </UFormField>

        <div
          class="flex items-center justify-between rounded-lg border border-default p-3"
        >
          <div>
            <p class="font-medium">노출 여부</p>
            <p class="text-sm text-muted">
              비활성화 시 사용자 화면에 숨김 처리됩니다.
            </p>
          </div>
          <USwitch v-model="localForm.visible" />
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
