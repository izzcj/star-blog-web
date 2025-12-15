<script setup lang="ts">
import { Avatar, Clock, Star, Top, View } from '@element-plus/icons-vue';
import { formatViewCount } from '@/utils/format-util';
import { getCategoryColor } from '@/utils/color-util';

defineOptions({
  name: 'ArticleCard',
});

defineProps<{
  article: Article;
}>();

const router = useRouter();

/**
 * 点击文章
 */
function clickArticle(article: Article) {
  router.push({
    name: 'ArticleDetails',
    params: {
      id: article.id,
    },
  });
}
</script>

<template>
  <ElCard
    class="group rounded-[10px]! cursor-pointer overflow-hidden transition duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl!"
    shadow="hover"
    @click="clickArticle(article)"
  >
    <!-- 封面图 -->
    <div class="relative rounded-[8px] shadow-lg aspect-video overflow-hidden bg-gray-100">
      <VenusImage
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-125"
      />

      <!-- 分类标签 -->
      <div class="absolute top-2 left-2">
        <span :class="getCategoryColor(article.category)" class="px-2 py-1 text-white text-xs font-medium rounded-md">
          {{ article.categoryName }}
        </span>
      </div>

      <!-- 置顶/推荐标识 -->
      <div v-if="article.top || article.recommended" class="absolute top-2 right-2 flex gap-2">
        <span v-if="article.top" class="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-md shadow-sm">
          <ElIcon :size="12">
            <Top />
          </ElIcon>
          置顶
        </span>
        <span v-if="article.recommended" class="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md shadow-sm">
          <ElIcon :size="12">
            <Star />
          </ElIcon>
          推荐
        </span>
      </div>
    </div>

    <!-- 标题 -->
    <ElText class="block! pt-2! text-[20px]! font-bold!" truncated>
      {{ article.title }}
    </ElText>
    <ElText v-if="article.summary" class="block! pt-2! text-[14px]! text-black/75!" truncated :line-clamp="2">
      {{ article.summary }}
    </ElText>

    <!-- 底部信息栏 -->
    <div class="pt-5 text-[13px] text-black/40">
      <div class="mr-auto flex flex-wrap">
        <div class="venus-center">
          <ElIcon>
            <Avatar />
          </ElIcon>
          <span class="pl-1">
            {{ article.createByName }}
          </span>
        </div>
        <div class="pl-2 venus-center">
          <ElIcon>
            <View />
          </ElIcon>
          <span class="pl-1">
            {{ formatViewCount(article.viewCount) }}
          </span>
        </div>
      </div>
      <div class="mr-auto">
        <div class="flex items-center">
          <ElIcon>
            <Clock />
          </ElIcon>
          <span class="pl-1">
            {{ article.publishTime }}
          </span>
        </div>
      </div>
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
</style>
