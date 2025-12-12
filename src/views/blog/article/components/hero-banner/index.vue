<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';

defineOptions({
  name: 'HeroBanner',
});

const props = defineProps<Props>();

interface Props {
  featuredArticle?: Article;
}

const router = useRouter();

/**
 * 跳转到文章详情
 */
function goToDetail(article: Article) {
  router.push({
    name: 'ArticleDetails',
    params: {
      id: article.id,
    },
  });
}
</script>

<template>
  <div v-if="props.featuredArticle" class="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
    <!-- 背景图片 -->
    <div class="absolute inset-0">
      <VenusImage
        :src="props.featuredArticle.coverImage"
        :alt="props.featuredArticle.title"
        class="w-full h-full object-cover opacity-30"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    </div>

    <!-- 内容 -->
    <div class="relative h-full flex items-end p-8 md:p-12">
      <div class="max-w-3xl space-y-4 text-white">
        <!-- 标签 -->
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
            精选推荐
          </span>
          <span class="px-3 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-sm font-medium rounded-full">
            {{ props.featuredArticle.categoryName }}
          </span>
        </div>

        <!-- 标题 -->
        <h1 class="text-3xl md:text-5xl font-bold leading-tight">
          {{ props.featuredArticle.title }}
        </h1>

        <!-- 摘要 -->
        <p class="text-lg md:text-xl text-white/90 line-clamp-2">
          {{ props.featuredArticle.summary }}
        </p>

        <!-- 底部信息 -->
        <div class="flex items-center gap-6 text-sm text-white/80">
          <span>{{ props.featuredArticle.createByName }}</span>
          <span>{{ props.featuredArticle.publishTime }}</span>
          <span>{{ props.featuredArticle.viewCount }} 次阅读</span>
        </div>

        <!-- 按钮 -->
        <div class="pt-4">
          <button
            class="group inline-flex items-center gap-2 px-6 py-3 bg-white cursor-pointer text-gray-900 font-medium rounded-full
                   transition-all duration-300 hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg"
            @click="goToDetail(props.featuredArticle)"
          >
            阅读全文
            <ElIcon class="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight />
            </ElIcon>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 空状态 -->
  <div v-else class="h-[300px] flex items-center justify-center bg-gray-100 rounded-2xl">
    <p class="text-gray-400">
      暂无精选文章
    </p>
  </div>
</template>

<style scoped lang="scss">
</style>
