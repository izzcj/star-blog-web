<script setup lang="ts">
import { animate, stagger } from 'animejs';
import { calculateElTopToViewportDistance } from '@/utils/html-util';
import MasterInfo from '@/views/home/components/master-info/index.vue';
import HotArticle from '@/views/home/components/hot-article/index.vue';
import LatestArticle from '@/views/home/components/latest-article/index.vue';
import WebsiteStats from '@/views/home/components/website-stats/index.vue';
import LatestActivity from '@/views/home/components/latest-activity/index.vue';
import CategoryNav from '@/views/home/components/category-nav/index.vue';
import HotTags from '@/views/home/components/hot-tags/index.vue';
import RecommendArticle from '@/views/home/components/recommend-article/index.vue';
import { asyncRequest } from '@/utils/request-util';
import { systemConfigApiModule } from '@/api/system/system-config';
import type { SystemConfig } from '@/views/admin/system/system-config/metadata';
import { useScrollAnimation } from '@/uses/use-scroll-animation';

defineOptions({
  name: 'HomePage',
});

// 滚动动画
const { observeElements, scaleInConfig, fadeInLeftConfig, fadeInRightConfig } = useScrollAnimation();

let mottoList: string[] = [];

const currentMottoIndex = ref(0);
const currentMotto = ref(mottoList[currentMottoIndex.value]);
const title = ref('夏至未至');

// header 展开状态
const isExpanded = ref(false);

/**
 * 加载标题
 */
function loadTitle() {
  asyncRequest<SystemConfig>(systemConfigApiModule.apis.fetchOne, {
    params: { key: 'home-title' },
  }).then(res => {
    title.value = res.data.value as string;
  });
}

/**
 * 加载 motto
 */
function loadMotto() {
  asyncRequest<SystemConfig>(systemConfigApiModule.apis.fetchOne, { params: { key: 'home-motto' } })
    .then(res => {
      if (res.data.value) {
        mottoList = JSON.parse(res.data.value) as string[];
        currentMotto.value = mottoList[0];
      }
    });
}

/**
 * 更新 motto
 */
function updateMotto() {
  currentMottoIndex.value++;
  if (currentMottoIndex.value >= mottoList.length) {
    currentMottoIndex.value = 0;
  }
  currentMotto.value = mottoList[currentMottoIndex.value];
}

/**
 * 标题动画
 */
function homeTitleAnime() {
  return animate('#header-title', {
    translateY: [
      { to: 10, duration: 600 },
      { to: -10, duration: 600 },
    ],
    ease: 'easeInOutSine',
    delay: (_, i) => i * 100,
  });
}

/**
 * 标题点击事件
 */
function homeTitleClick() {
  toggleExpand();
}

/**
 * 展开/收起
 */
function toggleExpand() {
  isExpanded.value = !isExpanded.value;
  const homeHeader = document.querySelector('#home-header');
  if (!homeHeader) {
    return;
  }
  const distanceToViewportTop = calculateElTopToViewportDistance(homeHeader);
  const start = distanceToViewportTop * 0.4;
  const end = distanceToViewportTop;
  if (isExpanded.value) {
    // 展开动画
    animate(homeHeader, {
      height: [`${start}px`, `${end}px`],
      ease: 'easeInOutQuad',
      duration: 1000,
    });
    document.body.addEventListener('wheel', preventScroll, { passive: false });
    document.body.addEventListener('touchmove', preventScroll, { passive: false });
  } else {
    // 收起动画
    animate(homeHeader, {
      height: [`${end}px`, `${start}px`],
      ease: 'easeInOutQuad',
      duration: 1000,
    });
    document.body.removeEventListener('wheel', preventScroll);
    document.body.removeEventListener('touchmove', preventScroll);
  }
}

/***
 * 阻止滚动
 *
 * @param event 滚轮事件
 */
function preventScroll(event: Event) {
  event.preventDefault();
}

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
  // 使用setTimeout确保所有子组件都已渲染
  nextTick(() => {
    setTimeout(() => {
      // 检查元素是否存在
      const leftElements = document.querySelectorAll('#left-sidebar-col > .fade-children > *');
      const rightElements = document.querySelectorAll('#right-sidebar-col > .fade-children > *');
      const mainElements = document.querySelectorAll('#main-col > .fade-children > *');

      if (leftElements.length > 0) {
        // 左侧栏淡入左移
        observeElements('#left-sidebar-col > .fade-children > *', {
          ...fadeInLeftConfig,
          delay: stagger(100),
        });
      }

      if (rightElements.length > 0) {
        // 右侧栏淡入右移
        observeElements('#right-sidebar-col > .fade-children > *', {
          ...fadeInRightConfig,
          delay: stagger(100),
        });
      }

      if (mainElements.length > 0) {
        // 中间内容缩放淡入
        observeElements('#main-col > .fade-children > *', {
          ...scaleInConfig,
          delay: stagger(100),
        });
      }
    }, 100);
  });
}

onMounted(() => {
  loadTitle();
  loadMotto();
  initScrollAnimations();
});

onBeforeRouteLeave(() => {
  document.body.removeEventListener('wheel', preventScroll);
  document.body.removeEventListener('touchmove', preventScroll);
});
</script>

<template>
  <div class="w-full">
    <div id="home-header" class="venus-center flex-col relative h-[40dvh] overflow-hidden">
      <div class="cursor-pointer text-[#FFFFFFFF] text-[4dvh] font-extrabold mb-5" @mouseenter="homeTitleAnime" @click="homeTitleClick">
        <span v-for="(char, index) of title" id="header-title" :key="index" class="inline-block text-shadow-[2px_2px_4px_rgb(0_0_0/_0.6)]">{{ char }}</span>
      </div>
      <div class="h-[6dvh] text-[#DCDCDCFF] bg-black/50 rounded-xl px-2.5 text-[2dvh] font-semibold flex items-center overflow-hidden">
        <Motto #default="scope" :motto="currentMotto" @update-motto="updateMotto">
          <p>
            {{ scope.content }}<span class="border-l-2 border-l-[rgba(255,255,255,0.5)] border-solid ml-0.5 animate-[hideToShow_0.9s_infinite]" />
          </p>
        </Motto>
      </div>

      <div id="banner-wave-1" class="absolute h-[8dvh] w-full bottom-[0] bg-[url('@/assets/image/bannerWave1.png')] animate-[gradientBG_20s_linear_infinite]" />
      <div id="banner-wave-2" class="absolute h-[10dvh] w-full bottom-[0] bg-[url('@/assets/image/bannerWave2.png')] animate-[gradientBG_30s_linear_infinite]" />
    </div>

    <div class="max-w-full min-h-[calc(100vh - 40dvh)] bg-white py-6 px-5 my-0 mx-auto box-border">
      <ElRow :gutter="20" justify="center" class="my-0 mx-auto">
        <!-- 左侧栏 -->
        <ElCol id="left-sidebar-col" :xs="24" :sm="24" :md="6" :lg="5" :xl="4" class="lg:sticky lg:top-2 lg:self-start">
          <div class="fade-children lg:max-h-[100vh] lg:overflow-y-auto lg:pr-[5px] custom-scrollbar">
            <MasterInfo />
            <WebsiteStats />
            <LatestActivity />
          </div>
        </ElCol>

        <!-- 中间主内容区 -->
        <ElCol id="main-col" :xs="24" :sm="24" :md="12">
          <div class="fade-children w-full">
            <HotArticle />
            <LatestArticle />
          </div>
        </ElCol>

        <!-- 右侧栏 -->
        <ElCol id="right-sidebar-col" :xs="24" :sm="24" :md="6" :lg="5" :xl="4">
          <div class="fade-children lg:max-h-[100vh] lg:overflow-y-auto lg:pr-[5px] custom-scrollbar">
            <CategoryNav />
            <HotTags />
            <RecommendArticle />
          </div>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
