<script setup lang="ts">
defineOptions({
  name: 'ArticleSkeleton',
});
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <!-- 封面骨架 -->
    <ElSkeleton animated>
      <template #template>
        <div class="aspect-video bg-gray-200" />
      </template>
    </ElSkeleton>

    <!-- 内容骨架 -->
    <div class="p-4 space-y-3">
      <!-- 分类标签骨架 -->
      <ElSkeleton animated>
        <template #template>
          <ElSkeletonItem variant="text" class="w-20 h-6" />
        </template>
      </ElSkeleton>

      <!-- 标题骨架 -->
      <ElSkeleton animated :rows="2">
        <template #template>
          <ElSkeletonItem variant="text" class="w-full h-5" />
          <ElSkeletonItem variant="text" class="w-3/4 h-5" />
        </template>
      </ElSkeleton>

      <!-- 摘要骨架 -->
      <ElSkeleton animated :rows="2">
        <template #template>
          <ElSkeletonItem variant="text" class="w-full h-4" />
          <ElSkeletonItem variant="text" class="w-5/6 h-4" />
        </template>
      </ElSkeleton>

      <!-- 底部信息骨架 -->
      <div class="flex items-center gap-4 pt-2">
        <ElSkeleton animated>
          <template #template>
            <ElSkeletonItem variant="text" class="w-16 h-3" />
          </template>
        </ElSkeleton>
        <ElSkeleton animated>
          <template #template>
            <ElSkeletonItem variant="text" class="w-16 h-3" />
          </template>
        </ElSkeleton>
        <ElSkeleton animated>
          <template #template>
            <ElSkeletonItem variant="text" class="w-20 h-3" />
          </template>
        </ElSkeleton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
