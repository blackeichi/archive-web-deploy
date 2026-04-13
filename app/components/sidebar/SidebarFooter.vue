<template>
  <div class="border-t border-gray-200 p-4 shrink-0">
    <button
      v-if="user"
      @click="onSignOut"
      class="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
    >
      로그아웃
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  user: { email?: string | null } | null;
}>();

const emit = defineEmits<{
  signOut: [];
}>();

function onSignOut() {
  emit("signOut");
}
</script>
