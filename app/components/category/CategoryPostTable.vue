<script setup lang="ts">
import type { CategoryTreeItem } from "~/types/category";
import type { PostListItem, PostVisibility } from "~/types/post";

const props = defineProps<{
  selectedCategory: CategoryTreeItem | null;
  selectedCategoryDescription: string;
  filteredPosts: PostListItem[];
  publicCount: number;
  privateCount: number;
  totalViews: number;
}>();
const emit = defineEmits<{
  handleSearch: [
    payload: { search: string; visibilityFilter: "all" | PostVisibility },
  ];
  editPost: [post: PostListItem];
  deletePost: [postId: number];
}>();

const searchInput = ref("");
const visibilityFilterInput = ref<"all" | PostVisibility>("all");

function handleSearch() {
  emit("handleSearch", {
    search: searchInput.value,
    visibilityFilter: visibilityFilterInput.value,
  });
}
</script>

<template>
  <section
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
  >
    <div class="border-b border-gray-200 px-5 py-4">
      <div class="flex flex-col gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span
              v-if="selectedCategory"
              class="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600"
            >
              {{ selectedCategory.type === "root" ? "대분류" : "소분류" }}
            </span>
            <span
              v-if="selectedCategory?.is_guest_room"
              class="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
            >
              게스트룸
            </span>
          </div>

          <h2 class="mt-2 text-lg font-semibold text-stone-900">
            {{ selectedCategory?.name || "카테고리를 선택해주세요" }}
          </h2>
          <p class="mt-1 text-sm text-stone-500">
            {{ selectedCategoryDescription }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div class="rounded-xl bg-stone-50 px-3 py-3">
            <p class="text-[11px] text-stone-500">전체 포스트</p>
            <p class="mt-1 text-lg font-semibold text-stone-900">
              {{ filteredPosts.length }}
            </p>
          </div>
          <div class="rounded-xl bg-stone-50 px-3 py-3">
            <p class="text-[11px] text-stone-500">공개</p>
            <p class="mt-1 text-lg font-semibold text-stone-900">
              {{ publicCount }}
            </p>
          </div>
          <div class="rounded-xl bg-stone-50 px-3 py-3">
            <p class="text-[11px] text-stone-500">비공개</p>
            <p class="mt-1 text-lg font-semibold text-stone-900">
              {{ privateCount }}
            </p>
          </div>
          <div class="rounded-xl bg-stone-50 px-3 py-3">
            <p class="text-[11px] text-stone-500">총 조회수</p>
            <p class="mt-1 text-lg font-semibold text-stone-900">
              {{ totalViews }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="border-b border-gray-200 px-5 py-4">
      <div
        class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="flex flex-1 flex-col gap-3 sm:flex-row">
          <!-- 입력용 -->
          <input
            v-model="searchInput"
            type="text"
            placeholder="포스트 제목, 요약, 작성자 검색"
            class="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-900"
            @keyup.enter="handleSearch"
          />

          <select
            v-model="visibilityFilterInput"
            class="rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
          >
            <option value="all">전체</option>
            <option value="public">공개</option>
            <option value="private">비공개</option>
          </select>

          <!-- 🔥 검색 버튼 추가 -->
          <button
            class="rounded-xl bg-stone-900 px-4 py-2 text-sm text-white transition hover:bg-stone-700 shrink-0"
            @click="handleSearch"
          >
            검색
          </button>
        </div>
      </div>
    </div>

    <div class="scroll-area 2xl:max-h-[85vh] max-h-[60vh] overflow-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-stone-50">
          <tr>
            <th class="px-5 py-3 text-left font-medium text-stone-500">제목</th>
            <th class="px-5 py-3 text-left font-medium text-stone-500">
              작성자
            </th>
            <th class="px-5 py-3 text-left font-medium text-stone-500">
              소속 카테고리
            </th>
            <th class="px-5 py-3 text-left font-medium text-stone-500">
              공개범위
            </th>
            <th class="px-5 py-3 text-left font-medium text-stone-500">
              조회수
            </th>
            <th class="px-5 py-3 text-left font-medium text-stone-500">
              수정일
            </th>
            <th class="px-5 py-3 text-left font-medium text-stone-500">작업</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 bg-white">
          <tr v-if="filteredPosts.length === 0">
            <td
              colspan="7"
              class="px-5 py-14 text-center text-sm text-stone-500"
            >
              선택한 카테고리에 해당하는 포스트가 없습니다.
            </td>
          </tr>

          <tr
            v-for="post in filteredPosts"
            :key="post.id"
            class="transition hover:bg-stone-50"
          >
            <td class="px-5 py-4 align-top">
              <div class="min-w-[240px]">
                <p class="font-medium text-stone-900">{{ post.title }}</p>
                <p class="mt-1 line-clamp-2 text-xs text-stone-500">
                  {{ post.summary || "요약이 없습니다." }}
                </p>
              </div>
            </td>

            <td class="px-5 py-4 align-top text-stone-600">
              {{ post.author_name }}
            </td>

            <td class="px-5 py-4 align-top text-stone-600">
              <div class="space-y-1">
                <p>{{ post.category_name }}</p>
                <p
                  v-if="post.parent_category_name"
                  class="text-xs text-stone-400"
                >
                  {{ post.parent_category_name }} / {{ post.category_name }}
                </p>
              </div>
            </td>

            <td class="px-5 py-4 align-top">
              <span
                class="rounded-full px-2.5 py-1 text-xs font-medium"
                :class="
                  post.visibility === 'public'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-stone-200 text-stone-700'
                "
              >
                {{ post.visibility }}
              </span>
            </td>

            <td class="px-5 py-4 align-top text-stone-600">
              {{ post.view_count }}
            </td>

            <td class="px-5 py-4 align-top text-stone-600">
              {{ formatDateKR(post.updated_at) }}
            </td>

            <td class="px-5 py-4 align-top">
              <div class="flex items-center gap-2">
                <button
                  class="rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-stone-700 transition hover:bg-stone-50"
                  @click="emit('editPost', post)"
                >
                  수정
                </button>
                <button
                  class="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
                  @click="emit('deletePost', post.id)"
                >
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
