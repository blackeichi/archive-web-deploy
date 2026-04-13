<script setup lang="ts">
import type { CategoryTreeItem } from "~/types/category";

const props = defineProps<{
  categoryTree: CategoryTreeItem[];
  selectedCategoryId: string | null;
  reorderMode: boolean;
  hasPendingChanges: boolean;
  isSavingOrder: boolean;
}>();

const emit = defineEmits<{
  select: [categoryId: number, isChild?: boolean];
  moveRoot: [index: number, direction: "up" | "down"];
  moveChild: [rootId: number, index: number, direction: "up" | "down"];
  createRoot: [];
  createChild: [rootId?: number];
  edit: [category: CategoryTreeItem];
  startReorder: [];
  cancelReorder: [];
  saveReorder: [];
}>();
</script>

<template>
  <section
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
  >
    <div class="border-b border-gray-200 px-4 py-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-stone-900">카테고리 관리</h2>
          <p class="mt-1 text-xs text-stone-500">
            <template v-if="reorderMode">
              위/아래 버튼으로 순서를 조정한 뒤 저장하세요.
            </template>
            <template v-else>
              대분류/소분류를 추가하거나 수정할 수 있습니다.
            </template>
          </p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <template v-if="reorderMode">
            <button
              class="h-8 rounded-lg border border-stone-300 bg-white px-3 text-xs font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isSavingOrder"
              @click="emit('cancelReorder')"
            >
              취소
            </button>
            <button
              class="h-8 rounded-lg bg-stone-900 px-3 text-xs font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="!hasPendingChanges || isSavingOrder"
              @click="emit('saveReorder')"
            >
              {{ isSavingOrder ? "저장 중..." : "순서 저장" }}
            </button>
          </template>

          <template v-else>
            <button
              class="h-7 rounded-lg border border-stone-300 bg-white px-3 text-xs text-stone-700 transition hover:bg-stone-50"
              @click="emit('startReorder')"
            >
              순서 변경
            </button>
            <button
              class="h-7 w-20 rounded-lg border border-stone-300 bg-white text-xs text-stone-700 transition hover:bg-stone-50"
              @click="emit('createRoot')"
            >
              대분류 ➕
            </button>
            <button
              class="h-7 w-20 rounded-lg border border-stone-900 bg-stone-900 text-xs text-white transition hover:bg-stone-800"
              @click="emit('createChild')"
            >
              소분류 ➕
            </button>
          </template>
        </div>
      </div>

      <div
        v-if="reorderMode"
        class="mt-3 rounded-xl border px-3 py-2 text-xs"
        :class="
          hasPendingChanges
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : 'border-stone-200 bg-stone-50 text-stone-600'
        "
      >
        <template v-if="hasPendingChanges">
          저장되지 않은 순서 변경사항이 있습니다.
        </template>
        <template v-else> 아직 변경된 순서가 없습니다. </template>
      </div>
    </div>

    <div class="scroll-area 2xl:max-h-[85vh] max-h-[60vh] overflow-y-auto p-3">
      <div
        v-if="categoryTree.length === 0"
        class="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500"
      >
        아직 카테고리가 없습니다.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(root, rootIndex) in categoryTree"
          :key="root.id"
          class="rounded-2xl border border-stone-200 bg-stone-50"
        >
          <div
            class="flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition rounded-2xl border cursor-pointer"
            :class="
              reorderMode
                ? 'cursor-default border-stone-200'
                : selectedCategoryId === String(root.id)
                  ? 'border-stone-900 bg-stone-200'
                  : 'border-stone-100 hover:bg-stone-100'
            "
            @click="!reorderMode && emit('select', root.id)"
          >
            <button
              aria-hidden="true"
              aria-label="카테고리 선택"
              @click="!reorderMode && emit('select', root.id)"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span
                  class="rounded-md bg-stone-900 px-2 py-0.5 text-[11px] font-medium text-white"
                >
                  대분류
                </span>
                <span
                  v-if="root.is_guest_room"
                  class="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700"
                >
                  게스트룸
                </span>
              </div>

              <p class="mt-2 truncate text-sm font-semibold text-stone-900">
                {{ root.name }}
              </p>
              <p class="mt-1 line-clamp-2 text-xs text-stone-500">
                {{ root.description || "설명이 없습니다." }}
              </p>

              <div
                class="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-stone-500"
              >
                <span>직속 포스트 {{ root.directPostCount }}개</span>
                <span>하위 포함 {{ root.totalPostCount }}개</span>
                <span>소분류 {{ root.children.length }}개</span>
              </div>
            </div>

            <div class="flex shrink-0 flex-col gap-2" @click.stop>
              <template v-if="reorderMode">
                <button
                  class="rounded-lg border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="rootIndex === 0 || isSavingOrder"
                  @click="emit('moveRoot', rootIndex, 'up')"
                >
                  ↑
                </button>
                <button
                  class="rounded-lg border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="
                    rootIndex === categoryTree.length - 1 || isSavingOrder
                  "
                  @click="emit('moveRoot', rootIndex, 'down')"
                >
                  ↓
                </button>
              </template>

              <template v-else>
                <button
                  class="rounded-lg border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:bg-white"
                  @click="emit('edit', root)"
                >
                  수정
                </button>
                <button
                  class="rounded-lg border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:bg-white"
                  @click="emit('createChild', root.id)"
                >
                  하위+
                </button>
              </template>
            </div>
          </div>

          <div
            v-if="root.children.length"
            class="border-t border-stone-200 bg-white px-3 py-3"
          >
            <div class="space-y-2">
              <div
                v-for="(child, childIndex) in root.children"
                :key="`child-${child.id}`"
                class="flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-3 text-left transition cursor-pointer"
                :class="
                  reorderMode
                    ? 'border-stone-200'
                    : selectedCategoryId === String(child.id)
                      ? 'border-stone-900 bg-stone-200'
                      : 'border-stone-200 hover:bg-stone-100'
                "
                @click="!reorderMode && emit('select', child.id)"
              >
                <button
                  aria-hidden="true"
                  aria-label="자식 카테고리 선택"
                  @click="!reorderMode && emit('select', child.id)"
                />
                <div class="min-w-0 flex-1 pl-3">
                  <div class="flex items-center gap-2">
                    <span class="h-1.5 w-1.5 rounded-full bg-stone-400" />
                    <span
                      class="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600"
                    >
                      소분류
                    </span>
                    <span
                      v-if="child.is_guest_room"
                      class="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700"
                    >
                      게스트룸
                    </span>
                  </div>

                  <p class="mt-2 truncate text-sm font-medium text-stone-900">
                    {{ child.name }}
                  </p>
                  <p class="mt-1 line-clamp-2 text-xs text-stone-500">
                    {{ child.description || "설명이 없습니다." }}
                  </p>
                  <p class="mt-2 text-[11px] text-stone-500">
                    포스트 {{ child.directPostCount }}개
                  </p>
                </div>

                <div class="flex shrink-0 flex-col gap-2" @click.stop>
                  <template v-if="reorderMode">
                    <button
                      class="rounded-lg border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      :disabled="childIndex === 0 || isSavingOrder"
                      @click="emit('moveChild', root.id, childIndex, 'up')"
                    >
                      ↑
                    </button>
                    <button
                      class="rounded-lg border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      :disabled="
                        childIndex === root.children.length - 1 || isSavingOrder
                      "
                      @click="emit('moveChild', root.id, childIndex, 'down')"
                    >
                      ↓
                    </button>
                  </template>

                  <template v-else>
                    <button
                      class="rounded-lg border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:bg-white"
                      @click="emit('edit', child)"
                    >
                      수정
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
