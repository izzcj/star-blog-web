<script setup lang="ts">
import { Avatar, Clock, View } from '@element-plus/icons-vue';
import { formatViewCount } from '@/utils/format-util';

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
  <ElCard class="rounded-[10px]! cursor-pointer overflow-hidden transition duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl!" shadow="hover" @click="clickArticle(article)">
    <div class="rounded-[8px] shadow-xl overflow-hidden">
      <VenusImage :src="article.coverImage" :alt="article.title" class="transition duration-500 ease-in-out hover:scale-125" />
    </div>
    <ElText class="block! pt-2! text-[20px]! font-bold!" truncated>
      {{ article.title }}
    </ElText>
    <ElText v-if="article.summary" class="block! pt-2! text-[14px]! text-black/75!" truncated :line-clamp="2">
      {{ article.summary }}
    </ElText>
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
