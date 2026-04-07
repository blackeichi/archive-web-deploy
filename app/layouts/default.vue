<template>
  <div>
    <header style="padding: 16px; border-bottom: 1px solid #ddd">
      <nav style="display: flex; gap: 12px; align-items: center">
        <NuxtLink to="/">홈</NuxtLink>
        <NuxtLink to="/categories">카테고리</NuxtLink>
        <NuxtLink to="/posts/new">글쓰기</NuxtLink>
        <NuxtLink to="/me/posts">내 글</NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin/categories">관리자</NuxtLink>
        <button v-if="user" @click="signOut">로그아웃</button>
        <NuxtLink v-else to="/login">로그인</NuxtLink>
      </nav>
    </header>

    <main style="padding: 24px">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import { useMyProfile } from "~/composables/useMyProfile";

const user = useSupabaseUser();
const { signOut } = useAuth();
const { isAdmin, profile, fetchMyProfile } = useMyProfile();

watchEffect(async () => {
  if (user.value && !profile.value) {
    await fetchMyProfile();
  }
});
</script>
