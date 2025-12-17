<script setup lang="ts">
// 目录项接口
interface TocItem {
  id: string;
  level: number;
  text: string;
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
// 折叠状态
const collapsedHeadings = ref<Set<string>>(new Set());
// 滚动容器
const scrollContainer = ref<Element | null>(null);

/**
 * 从 Markdown 内容提取目录
 */
function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let index = 0;

  let match = headingRegex.exec(content);
  while (match !== null) {
    const level = match[1].length;
    const text = match[2].trim();

    items.push({
      id: `heading-${index}`,
      level,
      text,
    });

    index++;
    match = headingRegex.exec(content);
  }

  return items;
}

/**
 * 为 Markdown 渲染的标题元素注入 ID
 */
function injectHeadingIds() {
  // 使用 setTimeout 确保 Markdown 编辑器完全渲染
  setTimeout(() => {
    // ByteMD Viewer 渲染的内容在 .markdown-body 中
    const contentContainer = document.querySelector('.article-content-wrapper .markdown-body')
      || document.querySelector('.article-content-wrapper');

    if (!contentContainer) {
      console.warn('未找到内容容器');
      return;
    }

    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      console.warn('未找到任何标题元素，尝试延迟重试');
      // 如果没找到，可能是异步组件还没渲染完，延迟重试
      setTimeout(() => injectHeadingIds(), 500);
      return;
    }

    headings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });

    // 注入 ID 后初始化滚动监听
    initScrollObserver();
  }, 500);
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
 * 切换折叠状态
 *
 * @param id 标题ID
 * @param event 事件对象
 */
function toggleCollapse(id: string, event: Event) {
  event.stopPropagation();
  if (collapsedHeadings.value.has(id)) {
    collapsedHeadings.value.delete(id);
  } else {
    collapsedHeadings.value.add(id);
  }
}

/**
 * 判断是否应该隐藏（父级被折叠）
 *
 * @param item 当前目录项
 * @param index 当前索引
 */
function shouldHide(item: TocItem, index: number): boolean {
  // 从当前项往上查找，看是否有被折叠的父级
  for (let i = index - 1; i >= 0; i--) {
    const prevItem = tocItems.value[i];
    if (prevItem.level < item.level && collapsedHeadings.value.has(prevItem.id)) {
      return true;
    }
    if (prevItem.level < item.level) {
      break;
    }
  }
  return false;
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
  injectHeadingIds();
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
        <span class="text-base font-semibold text-gray-800">目录</span>
        <span class="text-xs text-gray-500">{{ Math.round(readingProgress) }}%</span>
      </div>
    </template>

    <div class="overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
      <div v-if="tocItems.length > 0" class="space-y-1">
        <div
          v-for="(item, index) of tocItems"
          v-show="!shouldHide(item, index)"
          :key="item.id"
          class="group flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-all duration-300 ease-in-out"
          :class="[
            activeTocId === item.id
              ? 'text-blue-300 font-semibold bg-sky-300/10 border-l-3'
              : 'text-gray-700 hover:bg-gray-100 border-transparent',
          ]
          "
          :style="{ paddingLeft: `${(item.level - 1) * 10 + 8}px` }"
          @click="scrollToHeading(item.id)"
        >
          <!-- 层级图标 -->
          <span class="text-xs flex-shrink-0">
            {{ item.level <= 2 ? '▪️' : '·' }}
          </span>

          <!-- 标题文本 -->
          <span class="flex-1 text-sm truncate" :title="item.text">
            {{ item.text }}
          </span>

          <!-- 折叠按钮（仅 H3+ 显示） -->
          <span
            v-if="item.level >= 3"
            class="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            @click="toggleCollapse(item.id, $event)"
          >
            {{ collapsedHeadings.has(item.id) ? '▶' : '▼' }}
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
