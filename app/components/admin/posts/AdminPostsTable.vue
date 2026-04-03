<script setup lang="ts">
import type { PostItem, PostStatus } from "~/types/post";

defineProps<{
  items: PostItem[];
}>();

const emit = defineEmits<{
  remove: [post: PostItem];
  togglePinned: [post: PostItem];
  changeStatus: [post: PostItem, status: PostStatus];
}>();

const statusBadge = (status: PostStatus) => {
  if (status === "published")
    return { label: "발행됨", color: "success" as const };
  if (status === "archived")
    return { label: "보관됨", color: "neutral" as const };
  return { label: "임시저장", color: "warning" as const };
};
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="post in items"
      :key="post.id"
      class="rounded-2xl border border-default p-4"
    >
      <div
        class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
      >
        <div class="min-w-0 flex-1">
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <UBadge :color="statusBadge(post.status).color" variant="subtle">
              {{ statusBadge(post.status).label }}
            </UBadge>

            <UBadge color="neutral" variant="outline">
              {{ post.categoryName }}
            </UBadge>

            <UBadge v-if="post.isPinned" color="primary" variant="soft">
              고정
            </UBadge>
          </div>

          <h3 class="truncate text-lg font-semibold">{{ post.title }}</h3>
          <p class="mt-1 text-sm text-muted">/{{ post.slug }}</p>
          <p class="mt-2 line-clamp-2 text-sm">{{ post.summary }}</p>

          <div class="mt-3 flex flex-wrap gap-3 text-xs text-muted">
            <span>조회수 {{ post.viewCount }}</span>
            <span>생성일 {{ post.createdAt }}</span>
            <span>수정일 {{ post.updatedAt }}</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-pin"
            @click="emit('togglePinned', post)"
          >
            {{ post.isPinned ? "고정 해제" : "고정" }}
          </UButton>

          <UButton
            color="neutral"
            variant="soft"
            icon="i-lucide-file-pen-line"
            :to="`/admin/posts/${post.id}/edit`"
          >
            수정
          </UButton>

          <UDropdownMenu
            :items="[
              [
                {
                  label: '임시저장',
                  icon: 'i-lucide-file',
                  onSelect: () => emit('changeStatus', post, 'draft'),
                },
                {
                  label: '발행',
                  icon: 'i-lucide-badge-check',
                  onSelect: () => emit('changeStatus', post, 'published'),
                },
                {
                  label: '보관',
                  icon: 'i-lucide-archive',
                  onSelect: () => emit('changeStatus', post, 'archived'),
                },
              ],
            ]"
          >
            <UButton color="neutral" variant="soft" icon="i-lucide-refresh-cw">
              상태 변경
            </UButton>
          </UDropdownMenu>

          <UButton
            color="error"
            variant="soft"
            icon="i-lucide-trash-2"
            @click="emit('remove', post)"
          >
            삭제
          </UButton>
        </div>
      </div>
    </div>

    <div
      v-if="items.length === 0"
      class="rounded-2xl border border-dashed border-default p-10 text-center"
    >
      <UIcon
        name="i-lucide-file-search"
        class="mx-auto mb-3 size-10 text-muted"
      />
      <p class="font-medium">게시물이 없습니다.</p>
      <p class="text-sm text-muted">
        검색 조건을 바꾸거나 새 게시물을 추가해보세요.
      </p>
    </div>
  </div>
</template>
