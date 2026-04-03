<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "사용자 관리",
});

const user = ref({
  name: "관리자",
  email: "admin@example.com",
  role: "Super Admin",
  avatarUrl: "https://i.pravatar.cc/160?img=12",
});

const handleProfileSave = async (payload: {
  name: string;
  avatarFile: File | null;
}) => {
  console.log("프로필 저장", payload);

  // 예시
  // 1) avatarFile이 있으면 업로드
  // 2) 업로드된 URL 또는 기존 URL과 함께 이름 저장
  // 3) user 상태 갱신

  user.value.name = payload.name;

  if (payload.avatarFile) {
    user.value.avatarUrl = URL.createObjectURL(payload.avatarFile);
  }

  // 실제 API 예시
  // const formData = new FormData()
  // formData.append('name', payload.name)
  // if (payload.avatarFile) {
  //   formData.append('avatar', payload.avatarFile)
  // }
  // const result = await $fetch('/api/admin/me/profile', {
  //   method: 'PATCH',
  //   body: formData
  // })
  // user.value = result
};

const handlePasswordChange = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  console.log("비밀번호 변경 요청", payload);

  // await $fetch('/api/admin/auth/change-password', {
  //   method: 'POST',
  //   body: payload
  // })
};

const handleLogout = async () => {
  console.log("로그아웃");

  // await $fetch('/api/admin/auth/logout', { method: 'POST' })
  // await navigateTo('/login')
};
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
    <div>
      <h1 class="text-2xl font-bold">사용자 관리</h1>
      <p class="text-sm text-muted">계정 정보와 보안 설정을 관리합니다.</p>
    </div>

    <AdminUsersProfileCard
      :name="user.name"
      :email="user.email"
      :avatar-url="user.avatarUrl"
      @save="handleProfileSave"
    />

    <AdminUsersPasswordCard @submit="handlePasswordChange" />

    <AdminUsersLogoutCard @logout="handleLogout" />
  </div>
</template>
