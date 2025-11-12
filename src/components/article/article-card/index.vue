<script setup lang="ts">
import { Avatar, Clock, View } from '@element-plus/icons-vue';
import type { Article } from '@/components/article/metadata';

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
  <div @click="clickArticle(article)">
    <div v-if="article.coverImage" class="rounded-[8px] shadow-xl overflow-hidden">
      <VenusImage :src="article.coverImage" :alt="article.title" class="transition duration-500 ease-in-out hover:scale-125" />
    </div>
    <div class="pt-2">
      <span class="mr-auto text-[20px] font-bold">
        {{ article.title }}
      </span>
    </div>
    <span v-if="article.summary" class="mt-auto text-[12px] text-black/75">
      {{ article.summary }}
    </span>
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
            {{ article.viewCount }}
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
  </div>
</template>

<style scoped lang="scss">
</style>
