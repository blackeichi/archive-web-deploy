<script setup lang="ts">
const emit = defineEmits<{
  logout: [];
}>();
</script>

<template>
  <UCard class="rounded-2xl">
    <template #header>
      <div class="flex items-center gap-3">
        <div
          class="flex size-12 items-center justify-center rounded-full bg-error/10"
        >
          <UIcon name="i-lucide-log-out" class="size-6 text-error" />
        </div>
        <div>
          <h2 class="text-lg font-semibold">로그아웃</h2>
          <p class="text-sm text-muted">현재 관리자 세션을 종료합니다.</p>
        </div>
      </div>
    </template>

    <div
      class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <p class="text-sm text-muted">
        공용 기기에서 작업 중이라면 사용 후 반드시 로그아웃하세요.
      </p>

      <UButton
        color="error"
        variant="soft"
        icon="i-lucide-log-out"
        @click="emit('logout')"
      >
        로그아웃
      </UButton>
    </div>
  </UCard>
</template>
