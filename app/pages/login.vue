<template>
  <div>
    <h1>로그인</h1>

    <form
      @submit.prevent="onSubmit"
      style="display: grid; gap: 12px; max-width: 360px"
    >
      <input v-model="email" type="email" placeholder="이메일" />
      <input v-model="password" type="password" placeholder="비밀번호" />
      <button type="submit">로그인</button>
    </form>

    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

const { signIn } = useAuth();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const onSubmit = async () => {
  errorMessage.value = "";

  try {
    await signIn({
      email: email.value,
      password: password.value,
    });

    await navigateTo("/");
  } catch (err: any) {
    errorMessage.value = err.message || "로그인에 실패했습니다.";
  }
};
</script>
