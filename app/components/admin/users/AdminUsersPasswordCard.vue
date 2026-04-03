<!-- app/components/admin/users/AdminUsersPasswordCard.vue -->
<script setup lang="ts">
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const emit = defineEmits<{
  submit: [{ currentPassword: string; newPassword: string }];
}>();

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = "모든 항목을 입력해주세요.";
    return;
  }

  if (newPassword.value.length < 8) {
    errorMessage.value = "새 비밀번호는 8자 이상이어야 합니다.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "새 비밀번호 확인이 일치하지 않습니다.";
    return;
  }

  loading.value = true;

  try {
    emit("submit", {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });

    successMessage.value = "비밀번호 변경 요청이 전송되었습니다.";
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UCard class="rounded-2xl">
    <template #header>
      <div class="flex items-center gap-3">
        <div
          class="flex size-12 items-center justify-center rounded-full bg-warning/10"
        >
          <UIcon name="i-lucide-lock" class="size-6 text-warning" />
        </div>
        <div>
          <h2 class="text-lg font-semibold">비밀번호 변경</h2>
          <p class="text-sm text-muted">
            보안을 위해 주기적으로 비밀번호를 변경하세요.
          </p>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :title="errorMessage"
      />

      <UAlert
        v-if="successMessage"
        color="success"
        variant="soft"
        :title="successMessage"
      />

      <UFormField label="현재 비밀번호" required>
        <UInput
          v-model="currentPassword"
          type="password"
          placeholder="현재 비밀번호"
        />
      </UFormField>

      <UFormField label="새 비밀번호" required>
        <UInput
          v-model="newPassword"
          type="password"
          placeholder="새 비밀번호"
        />
      </UFormField>

      <UFormField label="새 비밀번호 확인" required>
        <UInput
          v-model="confirmPassword"
          type="password"
          placeholder="새 비밀번호 다시 입력"
        />
      </UFormField>

      <div class="flex justify-end">
        <UButton
          icon="i-lucide-key-round"
          :loading="loading"
          @click="handleSubmit"
        >
          비밀번호 변경
        </UButton>
      </div>
    </div>
  </UCard>
</template>
