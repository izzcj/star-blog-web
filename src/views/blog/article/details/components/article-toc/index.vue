<script setup lang="ts">
// 目录项接口
interface TocItem {
  id: string;
  depth: number;
  value: string;
}

const props = defineProps<{
  content: string;
}>();

// 目录列表
const tocItems = ref<TocItem[]>([]);
// 当前激活的目录项
const activeTocId = ref<string>('');
// IntersectionObserver 实例
const observer = ref<IntersectionObserver | null>(null);
// 阅读进度
const readingProgress = ref(0);
// 滚动容器
const scrollContainer = ref<Element | null>(null);

/**
 * 从 Markdown 内容提取目录
 */
function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = [];

  // 1. 移除 fenced code block（```）
  const withoutCodeBlock = content.replace(/```[\s\S]*?```/g, '');

  // 2. 匹配真正的 Markdown 标题（排除 >、-、* 等前缀）
  const headingRegex = /^(#{1,6})\s+(.*)$/gm;

  let match: RegExpExecArray | null;
  let index = 0;

  for (const line of withoutCodeBlock.split('\n')) {
    // 排除引用、列表
    if (/^\s*([>\-*+])\s+/.test(line)) {
      continue;
    }

    match = headingRegex.exec(line);
    if (!match) {
      continue;
    }

    toc.push({
      id: `heading-${index++}`,
      depth: match[1].length,
      value: match[2].trim(),
    });

    headingRegex.lastIndex = 0;
  }

  return toc;
}

/**
 * 跳转到指定标题
 */
function scrollToHeading(id: string) {
  const targetElement = document.getElementById(id);
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    activeTocId.value = id;
  }
}

/**
 * 更新阅读进度
 */
function updateReadingProgress() {
  // 查找文章组件的最外层容器（包含标题、元信息、内容等）
  const articleDetail = document.querySelector('#article-detail');
  // 查找文章内容区域的底部
  const contentWrapper = document.querySelector('.article-content-wrapper');

  if (!articleDetail || !contentWrapper || !scrollContainer.value) {
    return;
  }

  // 获取滚动容器的滚动位置和视口高度
  const scrollTop = scrollContainer.value.scrollTop;
  const scrollViewHeight = scrollContainer.value.clientHeight;

  // 获取相对于滚动容器的位置
  const articleRect = articleDetail.getBoundingClientRect();
  const contentRect = contentWrapper.getBoundingClientRect();
  const scrollContainerRect = scrollContainer.value.getBoundingClientRect();

  // 文章卡片顶部相对于滚动容器的位置（起始位置）
  const articleTopInScroll = articleRect.top - scrollContainerRect.top + scrollTop;
  // 内容区域底部相对于滚动容器的位置（结束位置）
  const contentBottomInScroll = contentRect.top - scrollContainerRect.top + scrollTop + contentWrapper.scrollHeight;

  // 如果还未进入阅读区域，进度为 0
  if (scrollTop + scrollViewHeight < articleTopInScroll) {
    readingProgress.value = 0;
    return;
  }

  // 如果已完全滚动过阅读区域，进度为 100
  if (scrollTop > contentBottomInScroll) {
    readingProgress.value = 100;
    return;
  }

  // 计算阅读进度
  const readStart = articleTopInScroll;
  const readEnd = contentBottomInScroll - scrollViewHeight;
  const readDistance = readEnd - readStart;

  const currentRead = scrollTop - readStart;
  const progress = (currentRead / readDistance) * 100;
  readingProgress.value = Math.min(Math.max(progress, 0), 100);
}

/**
 * 初始化滚动监听
 */
function initScrollObserver() {
  // 实际的滚动容器（el-main）
  scrollContainer.value = document.querySelector('.el-main');

  if (!scrollContainer.value) {
    console.warn('未找到滚动容器 .el-main');
    return;
  }

  // 清理旧的 observer
  if (observer.value) {
    observer.value.disconnect();
  }

  // 创建 IntersectionObserver，使用滚动容器作为 root
  observer.value = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeTocId.value = entry.target.id;
        }
      });
    },
    {
      root: scrollContainer.value,
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    },
  );

  // 观察所有标题
  const headings = document.querySelectorAll('[id^="heading-"]');
  headings.forEach(heading => {
    observer.value?.observe(heading);
  });

  // 绑定滚动容器的滚动事件
  scrollContainer.value.addEventListener('scroll', updateReadingProgress, { passive: true });

  // 初始化时计算一次
  updateReadingProgress();
}

// 监听内容变化，重新提取目录
watch(() => props.content, () => {
  tocItems.value = extractToc(props.content);
  setTimeout(() => {
    initScrollObserver();
  }, 500);
}, { immediate: true });

// 清理 observer
onUnmounted(() => {
  observer.value?.disconnect();
  scrollContainer.value?.removeEventListener('scroll', updateReadingProgress);
});
</script>

<template>
  <ElCard
    shadow="never"
    class="sticky top-5 max-h-[calc(100vh-40px)] overflow-hidden border border-gray-100/60 hover:shadow-md transition-all duration-300 rounded-xl"
  >
    <!-- 阅读进度条 -->
    <div
      class="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 z-10 rounded-tl-xl"
      :style="{ width: `${readingProgress}%` }"
    />

    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <IconRender icon="svg:catalog" class="mr-2" />
          <span class="text-base font-semibold text-gray-800">目录</span>
        </div>
        <span class="text-xs text-gray-500">{{ Math.round(readingProgress) }}%</span>
      </div>
    </template>

    <div class="overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
      <div v-if="tocItems.length > 0" class="space-y-1">
        <div
          v-for="item of tocItems"
          :key="item.id"
          class="group flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-all duration-300 ease-in-out"
          :class="[
            activeTocId === item.id
              ? 'text-blue-300 font-semibold bg-sky-300/10 border-l-3'
              : 'text-gray-700 hover:bg-gray-100 border-transparent',
          ]
          "
          :style="{ paddingLeft: `${(item.depth - 1) * 10 + 8}px` }"
          @click="scrollToHeading(item.id)"
        >
          <!-- 层级图标 -->
          <span class="text-xs flex-shrink-0">
            {{ item.depth <= 2 ? '▪️' : '·' }}
          </span>

          <!-- 标题文本 -->
          <span class="flex-1 text-sm truncate" :title="item.value">
            {{ item.value }}
          </span>
        </div>
      </div>

      <div v-else class="text-center text-sm text-gray-500 py-8">
        <div class="text-2xl mb-2">
          📖
        </div>
        暂无目录
      </div>
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
</style>
