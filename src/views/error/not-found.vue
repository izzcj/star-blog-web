<script setup lang="ts">
defineOptions({
  name: 'NotFoundPage',
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-6">
    <div class="max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
      <div class="text-6xl font-bold text-sky-500">
        404
      </div>
      <h1 class="mt-4 text-2xl font-semibold text-slate-900">
        页面不存在
      </h1>
      <p class="mt-3 text-sm text-slate-500">
        您访问的页面不存在或已被删除，请检查您的输入或返回首页。
      </p>
      <div class="mt-6 flex justify-center gap-3">
        <ElButton @click="$router.back()">
          返回
        </ElButton>
        <ElButton type="primary" @click="$router.push('/home')">
          回到首页
        </ElButton>
      </div>
    </div>
  </div>
</template>
