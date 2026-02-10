<script setup lang="ts">
import { Avatar, Clock, Star, Top, View } from '@element-plus/icons-vue';
import { formatViewCount } from '@/utils/format-util';

defineOptions({
  name: 'ArticleCard',
});

const props = withDefaults(defineProps<Props>(), {
  isFeatured: false,
});

interface Props {
  article: Article;
  isFeatured?: boolean;
}

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

// 计算卡片类名
const cardClasses = computed(() => [
  'neumorphic neumorphic-hover rounded-2xl overflow-hidden cursor-pointer group contain-layout transition-all duration-300',
  props.isFeatured ? 'featured-card' : '',
]);

// 计算布局类名
const layoutClasses = computed(() => [
  'flex',
  props.isFeatured ? 'flex-col md:flex-row' : 'flex-col',
]);
</script>

<template>
  <div
    :class="[cardClasses, layoutClasses]"
    @click="clickArticle(article)"
  >
    <!-- 封面图 -->
    <div
      class="relative overflow-hidden bg-gray-100" :class="[
        isFeatured ? 'w-full md:w-[55%] aspect-video md:aspect-auto' : 'aspect-video',
      ]"
    >
      <VenusImage
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full img-optimize transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
      />

      <!-- 分类标签 -->
      <div v-if="article.categoryName" class="absolute top-3 left-3">
        <span class="neumorphic-sm rounded-full px-3 py-1 text-xs font-medium text-mint-700 bg-white/90 backdrop-blur-sm">
          {{ article.categoryName }}
        </span>
      </div>

      <!-- 置顶/推荐标识 -->
      <div v-if="article.top || article.recommended" class="absolute top-3 right-3 flex gap-2">
        <span v-if="article.top" class="flex items-center gap-1 px-2 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          <ElIcon :size="12">
            <Top />
          </ElIcon>
          置顶
        </span>
        <span v-if="article.recommended" class="flex items-center gap-1 px-2 py-1 bg-mint-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          <ElIcon :size="12">
            <Star />
          </ElIcon>
          推荐
        </span>
      </div>
    </div>

    <!-- 内容区 -->
    <div
      class="p-4 md:p-6 space-y-3 flex flex-col" :class="[
        isFeatured ? 'md:w-[45%]' : 'flex-1',
      ]"
    >
      <!-- 标题 -->
      <h3
        class="font-bold text-gray-900 line-clamp-2 group-hover:text-mint-700 transition-colors duration-300" :class="[
          isFeatured ? 'text-xl md:text-2xl' : 'text-lg',
        ]"
      >
        {{ article.title }}
      </h3>

      <!-- 摘要 -->
      <p
        v-if="article.summary"
        class="text-gray-600/50" :class="[
          isFeatured ? 'text-sm md:text-base line-clamp-3' : 'text-sm line-clamp-2',
        ]"
      >
        {{ article.summary }}
      </p>

      <!-- 底部信息栏 -->
      <div class="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mt-auto">
        <!-- 作者 -->
        <div v-if="article.createByName" class="flex items-center gap-1.5">
          <ElIcon>
            <Avatar />
          </ElIcon>
          <span class="pl-1">
            <span>{{ article.createByName }}</span>
          </span>
        </div>

        <!-- 阅读量 -->
        <div v-if="article.viewCount" class="flex items-center gap-1">
          <ElIcon>
            <View />
          </ElIcon>
          <span class="pl-1">
            {{ formatViewCount(article.viewCount) }}
          </span>
        </div>

        <!-- 发布时间 -->
        <div v-if="article.publishTime" class="flex items-center gap-1">
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
