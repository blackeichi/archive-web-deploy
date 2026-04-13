<template>
  <div class="min-h-screen bg-white px-6 py-16">
    <div class="mx-auto max-w-sm">
      <div class="mb-10">
        <h1 class="text-2xl font-semibold text-stone-900">로그인</h1>
        <p class="mt-2 text-sm text-stone-500">
          정우의 기록/메모 아카이브에 접속하려면 로그인해주세요.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <div>
          <label class="mb-1 block text-xs text-stone-500">이메일</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            :disabled="isGuestLogin"
            class="w-full border-b border-stone-300 bg-transparent px-0 py-2 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-900 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400 disabled:bg-stone-100"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-stone-500">비밀번호</label>
          <input
            v-model="password"
            type="password"
            placeholder="비밀번호"
            autocomplete="current-password"
            :disabled="isGuestLogin"
            class="w-full border-b border-stone-300 bg-transparent px-0 py-2 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-900 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400 disabled:bg-stone-100"
          />
        </div>

        <div class="flex items-center justify-between pt-2">
          <label class="flex items-center gap-2 text-xs text-stone-500">
            <input
              v-model="rememberEmail"
              type="checkbox"
              :disabled="isGuestLogin"
              class="h-3.5 w-3.5 border-stone-300 text-stone-900 focus:ring-0 disabled:cursor-not-allowed"
            />
            아이디 저장
          </label>

          <label class="flex items-center gap-2 text-xs text-stone-500">
            <input
              v-model="isGuestLogin"
              type="checkbox"
              class="h-3.5 w-3.5 border-stone-300 text-stone-900 focus:ring-0"
            />
            게스트로 로그인하기
          </label>
        </div>

        <p v-if="errorMessage" class="text-xs text-red-500">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isSubmitting || !canSubmit"
          class="mt-4 w-full border border-stone-300 py-2 text-sm text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting ? "로그인 중..." : "로그인" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  layout: false,
});

const { signIn } = useAuth();
const user = useSupabaseUser();

const email = ref("");
const password = ref("");
const rememberEmail = ref(false);
const isGuestLogin = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false);

const REMEMBER_EMAIL_KEY = "remembered-email";

const config = useRuntimeConfig();
const GUEST_EMAIL = config.public.guestEmail;
const GUEST_PASSWORD = config.public.guestPassword;

onMounted(() => {
  const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);

  if (savedEmail) {
    email.value = savedEmail;
    rememberEmail.value = true;
  }
});

const canSubmit = computed(() => {
  if (isGuestLogin.value) return true;
  return email.value.trim() !== "" && password.value.trim() !== "";
});

const waitForUser = () =>
  new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      stop();
      reject(new Error("로그인 상태 반영이 지연되고 있습니다."));
    }, 3000);

    const stop = watch(
      user,
      (value) => {
        if (value) {
          clearTimeout(timeout);
          stop();
          resolve();
        }
      },
      { immediate: true },
    );
  });

const onSubmit = async () => {
  if (!canSubmit.value) return;

  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    const loginEmail = isGuestLogin.value ? GUEST_EMAIL : email.value;
    const loginPassword = isGuestLogin.value ? GUEST_PASSWORD : password.value;

    await signIn({
      email: loginEmail,
      password: loginPassword,
    });

    if (!isGuestLogin.value && rememberEmail.value) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email.value);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }

    await waitForUser();
    await navigateTo("/");
  } catch (err: any) {
    errorMessage.value = err?.message || "로그인에 실패했습니다.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
