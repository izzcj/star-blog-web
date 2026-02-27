<script setup lang="ts">
import { Clock, DArrowRight, Star, Top, View } from '@element-plus/icons-vue';
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

function clickArticle(article: Article) {
  router.push({
    name: 'ArticleDetails',
    params: { id: article.id },
  });
}

// 格式化发布时间 - 只显示日期部分
const publishDate = computed(() => {
  if (!props.article.publishTime) {
    return '';
  }
  return props.article.publishTime.split(' ')[0];
});
</script>

<template>
  <!-- 特色卡片（横向大卡片，占满网格） -->
  <div
    v-if="isFeatured"
    class="featured-card group relative rounded-2xl overflow-hidden cursor-pointer contain-layout card-glow min-h-[280px] bg-white"
    @click="clickArticle(article)"
  >
    <!-- 图片区（右侧50%） -->
    <div class="absolute inset-0 md:left-[48%]">
      <VenusImage
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full img-optimize transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <!-- 右侧图片渐变遮罩（从左侧过来） -->
      <div class="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent md:block hidden" />
    </div>

    <!-- 移动端图片渐变遮罩（从底部） -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:hidden" />

    <!-- 内容区（左侧，桌面；底部覆盖，移动端） -->
    <div class="relative z-10 flex flex-col h-full p-6 md:p-8 md:w-[52%]">
      <!-- 顶部标签行 -->
      <div class="flex items-center gap-2 mb-4">
        <!-- 分类 -->
        <span
          v-if="article.categoryName"
          class="px-2.5 py-1 rounded-lg text-xs font-semibold tag-mint"
        >
          {{ article.categoryName }}
        </span>
        <!-- 置顶 -->
        <span
          v-if="article.top"
          class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-orange-600 md:text-orange-600 md:bg-orange-50 md:border md:border-orange-200 bg-orange-500/80"
        >
          <ElIcon :size="12">
            <Top />
          </ElIcon>
          置顶
        </span>
        <!-- 推荐 -->
        <span
          v-if="article.recommended"
          class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-mint-700 md:text-mint-700 md:bg-mint-50 md:border md:border-mint-200 bg-mint-500/80"
        >
          <ElIcon :size="12">
            <Star />
          </ElIcon>
          精选
        </span>
      </div>

      <!-- 标题 -->
      <h2 class="font-bold leading-snug line-clamp-3 mb-3 transition-colors duration-300 md:text-gray-900 text-white text-2xl md:text-3xl group-hover:text-mint-700 text-shadow-card">
        {{ article.title }}
      </h2>

      <!-- 摘要 -->
      <p
        v-if="article.summary"
        class="text-sm md:text-base leading-relaxed line-clamp-3 mb-4 flex-1 md:text-gray-500 text-white/75"
      >
        {{ article.summary }}
      </p>

      <!-- 底部元信息 -->
      <div class="flex items-center gap-4 mt-auto">
        <!-- 作者头像 + 姓名 -->
        <div v-if="article.createByName" class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 avatar-gradient">
            {{ article.createByName.charAt(0) }}
          </div>
          <span class="text-xs font-medium md:text-gray-700 text-white/90">{{ article.createByName }}</span>
        </div>

        <!-- 分隔点 -->
        <span class="w-1 h-1 rounded-full md:bg-gray-300 bg-white/40 shrink-0" />

        <!-- 发布日期 -->
        <div v-if="publishDate" class="flex items-center gap-1 text-xs md:text-gray-400 text-white/70">
          <ElIcon>
            <Clock />
          </ElIcon>
          {{ publishDate }}
        </div>

        <!-- 阅读量 -->
        <div v-if="article.viewCount" class="flex items-center gap-1 text-xs md:text-gray-400 text-white/70 ml-auto">
          <ElIcon>
            <View />
          </ElIcon>
          {{ formatViewCount(article.viewCount) }}
        </div>
      </div>
    </div>

    <!-- 右下角：阅读按钮（仅桌面） -->
    <div class="absolute bottom-6 right-6 hidden md:block">
      <div class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-300 group-hover:gap-2.5 btn-read-gradient">
        阅读全文
        <ElIcon>
          <DArrowRight />
        </ElIcon>
      </div>
    </div>
  </div>

  <!-- 普通卡片 -->
  <div
    v-else
    class="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer contain-layout card-glow bg-white"
    @click="clickArticle(article)"
  >
    <!-- 封面图区域 -->
    <div class="relative overflow-hidden aspect-[16/10] bg-gradient-to-br from-mint-50 to-mint-100 shrink-0">
      <VenusImage
        :src="article.coverImage"
        :alt="article.title"
        class="w-full h-full img-optimize transition-transform duration-600 ease-out group-hover:scale-110"
      />

      <!-- 底部渐变遮罩 -->
      <div class="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

      <!-- 左上角分类标签 -->
      <div class="absolute top-3 left-3">
        <span
          v-if="article.categoryName"
          class="px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm cover-tag"
        >
          {{ article.categoryName }}
        </span>
      </div>

      <!-- 右上角标识（置顶/推荐） -->
      <div v-if="article.top || article.recommended" class="absolute top-3 right-3 flex flex-col gap-1.5">
        <span
          v-if="article.top"
          class="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium text-white backdrop-blur-sm badge-top-bg"
        >
          <ElIcon :size="12">
            <Top />
          </ElIcon>
          置顶
        </span>
        <span
          v-if="article.recommended"
          class="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium text-white backdrop-blur-sm badge-rec-bg"
        >
          <ElIcon :size="12">
            <Star />
          </ElIcon>
          精选
        </span>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="flex flex-col flex-1 p-4 md:p-5">
      <!-- 标题 -->
      <h3 class="font-bold text-base md:text-lg text-gray-900 line-clamp-2 mb-2 leading-snug group-hover:text-mint-700 transition-colors duration-250">
        {{ article.title }}
      </h3>

      <!-- 摘要 -->
      <p
        v-if="article.summary"
        class="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3 flex-1"
      >
        {{ article.summary }}
      </p>

      <!-- 底部信息栏 -->
      <div class="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
        <!-- 左侧：作者 + 日期 -->
        <div class="flex items-center gap-2 min-w-0">
          <!-- 作者头像 -->
          <div
            v-if="article.createByName"
            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 avatar-gradient"
          >
            {{ article.createByName.charAt(0) }}
          </div>
          <span class="text-xs text-gray-500 truncate max-w-[80px]">{{ article.createByName }}</span>
          <span class="w-1 h-1 rounded-full bg-gray-200 shrink-0" />
          <span v-if="publishDate" class="text-xs text-gray-400 shrink-0">{{ publishDate }}</span>
        </div>

        <!-- 右侧：阅读量 -->
        <div v-if="article.viewCount" class="flex items-center gap-1 text-xs text-gray-400 shrink-0">
          <ElIcon>
            <View />
          </ElIcon>
          {{ formatViewCount(article.viewCount) }}
        </div>
      </div>
    </div>

    <!-- 底部悬停进度条（装饰） -->
    <div class="absolute bottom-0 inset-x-0 h-0.5 transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100 progress-mint-lime" />
  </div>
</template>

<style scoped lang="scss">
</style>
