<script setup lang="ts">
const props = defineProps<{
  name: string;
  email: string;
  avatarUrl?: string;
}>();

const emit = defineEmits<{
  save: [{ name: string; avatarFile: File | null }];
}>();

const localName = ref(props.name);
const previewUrl = ref(props.avatarUrl || "");
const avatarFile = ref<File | null>(null);
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

watch(
  () => props.name,
  (value) => {
    localName.value = value;
  },
);

watch(
  () => props.avatarUrl,
  (value) => {
    if (!avatarFile.value) {
      previewUrl.value = value || "";
    }
  },
);

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    errorMessage.value = "이미지 파일만 업로드할 수 있습니다.";
    return;
  }

  avatarFile.value = file;
  errorMessage.value = "";
  successMessage.value = "";
  previewUrl.value = URL.createObjectURL(file);
};

const handleSave = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!localName.value.trim()) {
    errorMessage.value = "이름을 입력해주세요.";
    return;
  }

  loading.value = true;

  try {
    emit("save", {
      name: localName.value.trim(),
      avatarFile: avatarFile.value,
    });
    successMessage.value = "프로필 변경 요청이 저장되었습니다.";
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
          class="flex size-12 items-center justify-center rounded-full bg-primary/10"
        >
          <UIcon name="i-lucide-user-round" class="size-6 text-primary" />
        </div>
        <div>
          <h2 class="text-lg font-semibold">내 프로필</h2>
          <p class="text-sm text-muted">
            이름과 프로필 사진을 수정할 수 있습니다.
          </p>
        </div>
      </div>
    </template>

    <div class="space-y-6">
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

      <div class="flex flex-col gap-6 md:flex-row md:items-start">
        <div class="flex flex-col items-center gap-3">
          <UAvatar :src="previewUrl || undefined" :alt="localName" size="3xl" />
          <label class="w-full">
            <span class="mb-2 block text-sm font-medium">프로필 사진 변경</span>
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm"
              @change="onFileChange"
            />
          </label>
        </div>

        <div class="grid flex-1 gap-4">
          <UFormField label="이름" required>
            <UInput v-model="localName" placeholder="이름 입력" />
          </UFormField>

          <UFormField label="이메일">
            <UInput :model-value="email" readonly />
          </UFormField>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <UButton icon="i-lucide-save" :loading="loading" @click="handleSave">
          프로필 저장
        </UButton>
      </div>
    </template>
  </UCard>
</template>
