<template>
  <div
    class="pointer-events-none fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-3"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto rounded-lg border px-4 py-3 shadow-lg transition"
      :class="toastClass(toast.type)"
    >
      <div class="flex items-start justify-between gap-3">
        <p class="text-sm font-medium">
          {{ toast.message }}
        </p>

        <button
          class="shrink-0 text-xs opacity-70 hover:opacity-100"
          @click="removeToast(toast.id)"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from "~/composables/useToast";

const { toasts, removeToast } = useToast();

function toastClass(type: ToastType) {
  switch (type) {
    case "success":
      return "border-green-200 bg-green-50 text-green-800";
    case "error":
      return "border-red-200 bg-red-50 text-red-800";
    case "warning":
      return "border-yellow-200 bg-yellow-50 text-yellow-800";
    case "info":
    default:
      return "border-gray-200 bg-white text-gray-800";
  }
}
</script>
