<script setup lang="ts">
import type { CategoryGroup, CategoryItem } from "~/types/category";

defineProps<{
  group: CategoryGroup;
}>();

const emit = defineEmits<{
  editGroup: [group: CategoryGroup];
  deleteGroup: [group: CategoryGroup];
  toggleGroup: [group: CategoryGroup];
  addChild: [group: CategoryGroup];
  editChild: [child: CategoryItem, parentId: number];
  deleteChild: [child: CategoryItem, parentId: number];
  toggleChild: [child: CategoryItem, parentId: number];
}>();
</script>

<template>
  <UCard class="rounded-2xl">
    <template #header>
      <AdminCategoriesItemRow
        :item="group"
        @edit="emit('editGroup', group)"
        @remove="emit('deleteGroup', group)"
        @toggle="emit('toggleGroup', group)"
        @add-child="emit('addChild', group)"
      />
    </template>

    <div class="space-y-3">
      <div
        v-if="group.children.length === 0"
        class="rounded-xl border border-dashed border-default p-6 text-center text-sm text-muted"
      >
        등록된 소분류가 없습니다.
      </div>

      <AdminCategoriesItemRow
        v-for="child in group.children"
        :key="child.id"
        :item="child"
        is-child
        @edit="emit('editChild', child, group.id)"
        @remove="emit('deleteChild', child, group.id)"
        @toggle="emit('toggleChild', child, group.id)"
      />
    </div>
  </UCard>
</template>
