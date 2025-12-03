<script setup lang="ts">
import anime from 'animejs';
import { calculateElTopToViewportDistance } from '@/utils/html-util';
import MasterInfo from '@/views/home/components/master-info/index.vue';
import HotArticle from '@/views/home/components/hot-article/index.vue';
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
const { observeElements, fadeInUpConfig, fadeInLeftConfig, fadeInRightConfig } = useScrollAnimation();

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
  return anime({
    targets: '.title',
    translateY: [
      { value: 10, duration: 600 },
      { value: -10, duration: 600 },
    ],
    easing: 'easeInOutSine',
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
  const homeHeader = document.querySelector('.home-header');
  let distanceToViewportTop = calculateElTopToViewportDistance(homeHeader);
  const bannerWave1 = document.querySelector('#banner-wave-1');
  if (bannerWave1) {
    distanceToViewportTop = distanceToViewportTop + bannerWave1.getBoundingClientRect().height;
  }
  const start = distanceToViewportTop * 0.4;
  const end = distanceToViewportTop;
  if (isExpanded.value) {
    // 展开动画
    anime({
      targets: '.home-header',
      height: [`${start}px`, `${end}px`],
      easing: 'easeInOutQuad',
      duration: 1000,
    });
    document.body.addEventListener('wheel', preventScroll, { passive: false });
    document.body.addEventListener('touchmove', preventScroll, { passive: false });
  } else {
    // 收起动画
    anime({
      targets: '.home-header',
      height: [`${end}px`, `${start}px`],
      easing: 'easeInOutQuad',
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
      const leftElements = document.querySelectorAll('.left-sidebar-col > .sidebar-content > *');
      const rightElements = document.querySelectorAll('.right-sidebar-col > .sidebar-content > *');
      const mainElements = document.querySelectorAll('.main-col > .main-content > *');

      if (leftElements.length > 0) {
        // 左侧栏淡入左移
        observeElements('.left-sidebar-col > .sidebar-content > *', {
          ...fadeInLeftConfig,
          delay: anime.stagger(100),
        });
      }

      if (rightElements.length > 0) {
        // 右侧栏淡入右移
        observeElements('.right-sidebar-col > .sidebar-content > *', {
          ...fadeInRightConfig,
          delay: anime.stagger(100),
        });
      }

      if (mainElements.length > 0) {
        // 中间内容淡入上移
        observeElements('.main-col > .main-content > *', {
          ...fadeInUpConfig,
          delay: 200,
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
  <div class="size-full">
    <div class="venus-center home-header">
      <div class="home-title" @mouseenter="homeTitleAnime" @click="homeTitleClick">
        <span v-for="(char, index) of title" :key="index" class="title">{{ char }}</span>
      </div>
      <div class="home-motto">
        <Motto #default="scope" :motto="currentMotto" @update-motto="updateMotto">
          <p>
            {{ scope.content }}<span class="cursor" />
          </p>
        </Motto>
      </div>

      <div id="banner-wave-1" />
      <div id="banner-wave-2" />
    </div>

    <div class="home-body">
      <ElRow :gutter="20" justify="center" class="home-content">
        <!-- 左侧栏 -->
        <ElCol :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="sidebar-col left-sidebar-col">
          <div class="sidebar-content">
            <MasterInfo />
            <WebsiteStats />
            <LatestActivity />
          </div>
        </ElCol>

        <!-- 中间主内容区 -->
        <ElCol :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="main-col">
          <div class="main-content">
            <HotArticle />
          </div>
        </ElCol>

        <!-- 右侧栏 -->
        <ElCol :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="sidebar-col right-sidebar-col">
          <div class="sidebar-content">
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
.home-header {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 40dvh;
  overflow: hidden;
}

.home-title {
  cursor: pointer;
  color: rgb(255, 255, 255);
  font-size: 4dvh;
  font-weight: 800;
  margin-bottom: 20px;
  .title {
    display: inline-block;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  }
}

.home-motto {
  height: 6dvh;
  color: gainsboro;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 2dvh;
  font-weight: 600;
  display: flex;
  align-items: center;
  overflow: hidden;
  .cursor {
    border-left: 2px solid rgba(255, 255, 255, 0.5);
    margin-left: 2px;
    animation: hideToShow 0.9s infinite;
  }
}

#banner-wave-1 {
  height: 8dvh;
  background: url("@/assets/image/bannerWave1.png");
  position: absolute;
  width: 100%;
  bottom: 0;
  animation: gradientBG 20s linear infinite;
}
#banner-wave-2 {
  height: 10dvh;
  background: url("@/assets/image/bannerWave2.png");
  position: absolute;
  width: 100%;
  bottom: 0;
  animation: gradientBG 30s linear infinite;
}

.home-body {
  background-color: rgba(255, 255, 255);
  padding: 24px 20px;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 100%;
  min-height: calc(100vh - 40dvh);
}

.home-content {
  margin: 0 auto;

  // 移动端响应式布局
  @media (max-width: 1023px) {
    // 移动端：博主信息 → 热门文章 → 其他组件
    .left-sidebar-col {
      order: 1;
    }

    .main-col {
      order: 2;
    }

    .right-sidebar-col {
      order: 3;
    }
  }
}

// 侧边栏
.sidebar-col {
  @media (min-width: 1024px) {
    position: sticky;
    top: 20px;
    align-self: flex-start;
  }
}

.sidebar-content {
  @media (min-width: 1024px) {
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    padding-right: 5px;

    // 自定义滚动条
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
      transition: background 0.2s;

      &:hover {
        background: #a8a8a8;
      }
    }
  }

  // 初始隐藏，等待动画
  > * {
    opacity: 0;
  }
}

.main-content {
  width: 100%;

  // 初始隐藏，等待动画
  > * {
    opacity: 0;
  }
}
</style>
