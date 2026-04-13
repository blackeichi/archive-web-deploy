<script setup lang="ts">
import type { CategoryForm, CategoryTreeItem } from "~/types/category";

defineProps<{
  open: boolean;
  mode: "create" | "edit";
  form: CategoryForm;
  categoryTree: CategoryTreeItem[];
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();
</script>

<template>
  <CommonModal
    :is-modal-open="open"
    @update:is-modal-open="emit('close')"
    is-centered
  >
    <div class="w-full max-w-lg rounded-2xl bg-white shadow-xl">
      <div class="border-b border-gray-200 px-5 py-4">
        <h3 class="text-base font-semibold text-stone-900">
          {{ mode === "create" ? "카테고리 추가" : "카테고리 수정" }}
        </h3>
        <p class="mt-1 text-sm text-stone-500">
          대분류/소분류 구조와 게스트룸 여부를 설정할 수 있습니다.
        </p>
      </div>

      <form class="space-y-4 px-5 py-5" @submit.prevent="emit('submit')">
        <div>
          <label class="mb-1 block text-xs text-stone-500">카테고리 타입</label>
          <select
            v-model="form.type"
            class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
          >
            <option value="root">대분류</option>
            <option value="child">소분류</option>
          </select>
        </div>

        <div v-if="form.type === 'child'">
          <label class="mb-1 block text-xs text-stone-500">상위 대분류</label>
          <select
            v-model="form.parent_id"
            class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
          >
            <option :value="null">선택하세요</option>
            <option
              v-for="root in categoryTree"
              :key="root.id"
              :value="root.id"
            >
              {{ root.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs text-stone-500">이름</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
            placeholder="예: JavaScript"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-stone-500">설명</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
            placeholder="카테고리 소개를 입력하세요."
          />
        </div>

        <label class="flex items-center gap-2 text-sm text-stone-600">
          <input
            v-model="form.is_guest_room"
            type="checkbox"
            class="h-4 w-4 rounded border-stone-300"
          />
          게스트룸 카테고리로 사용
        </label>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            class="rounded-xl border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
            @click="emit('close')"
          >
            취소
          </button>
          <button
            type="submit"
            class="rounded-xl border border-stone-900 bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800"
          >
            {{ mode === "create" ? "추가하기" : "저장하기" }}
          </button>
        </div>
      </form>
    </div>
  </CommonModal>
</template>
