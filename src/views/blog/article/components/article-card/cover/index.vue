<script setup lang="ts">
import { Star, Top } from '@element-plus/icons-vue';

defineOptions({
  name: 'ArticleCardCover',
});

defineProps<{
  article: ArticleDetail;
  isFeatured?: boolean;
}>();
</script>

<template>
  <!-- 精选卡片 -->
  <div v-if="isFeatured" class="absolute inset-0 md:left-[48%]">
    <VenusImage
      :src="article.coverImage"
      :alt="article.title"
      class="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
    />

    <!-- 桌面渐变 -->
    <div class="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent hidden md:block" />

    <!-- 移动渐变 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:hidden" />
  </div>

  <div v-else class="relative overflow-hidden">
    <VenusImage
      :src="article.coverImage"
      :alt="article.title"
      class="w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
    />

    <!-- 右上角标签 -->
    <div
      v-if="article.top || article.recommended"
      class="absolute top-3 right-3 flex flex-col gap-1.5"
    >
      <span
        v-if="article.top"
        class="badge-top"
      >
        <ElIcon :size="12">
          <Top />
        </ElIcon>
        置顶
      </span>

      <span
        v-if="article.recommended"
        class="badge-rec"
      >
        <ElIcon :size="12">
          <Star />
        </ElIcon>
        精选
      </span>
    </div>
  </div>
</template>
