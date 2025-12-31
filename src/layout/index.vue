<script setup lang="ts">
import { useTemplateRef } from 'vue';
import NavBar from './components/nav-bar/index.vue';
import AppMain from './components/app-main/index.vue';
import Footer from './components/footer/index.vue';
import Loading from '@/components/loading/index.vue';
import { useAppSettingsStore } from '@/stores/app-settings-store';
import { useAppStatusStore } from '@/stores/app-status-store';
import bgImage from '@/assets/image/background.png';

defineOptions({
  name: 'Layout',
});

const currentWindowHeight = ref(window.innerHeight);
const visibilityHeight = computed(() => currentWindowHeight.value * 0.4);
const containerLoadTimeout = ref<any>();
const isScrolled = ref(false);

const appStatusStore = useAppStatusStore();
const appSettingsStore = useAppSettingsStore();

const backgroundImage = ref(bgImage);

const isLoaded = computed(() => appStatusStore.resourceLoadStatus);

const mainRef = useTemplateRef<any>('mainRef');

/**
 * 导航栏动态类名
 * PC端：根据滚动状态和hover效果动态应用背景
 * 移动端：保持原样
 */
const headerClass = computed(() => {
  if (appSettingsStore.isMobile) {
    return '';
  }

  const baseClass = 'transition-colors duration-500 ease-in-out';
  return isScrolled.value ? `${baseClass} bg-(--venus-menu-bg--color)` : `${baseClass} hover:bg-(--venus-menu-bg--color)`;
});

/**
 * 处理主区域滚动
 * 当滚动距离超过阈值时，更新导航栏背景状态
 */
const handleScroll = debounce(() => {
  if (mainRef.value) {
    isScrolled.value = mainRef.value.$el.scrollTop > visibilityHeight.value;
  }
}, 20);

/**
 * 容器加载完毕
 */
function containerLoadComplete() {
  containerLoadTimeout.value = setTimeout(() => {
    appStatusStore.setResourceLoadStatus(true);
  }, 1500);
}

useEventListener(mainRef, 'scroll', () => {
  handleScroll();
});

onMounted(() => {
  containerLoadComplete();
});
</script>

<template>
  <div>
    <!-- Loading -->
    <Loading />

    <!-- 背景图 -->
    <ElImage class="h-dvh w-dvw fixed!" :src="backgroundImage" fit="cover" :z-index="-1" alt="背景图" />

    <!-- 页面主体 -->
    <ElContainer v-if="isLoaded" class="h-dvh w-dvw relative">
      <ElHeader :class="headerClass">
        <NavBar />
      </ElHeader>
      <ElMain ref="mainRef" class="default-main w-dvw hidden-scrollbar">
        <AppMain />
        <Footer />
        <ElBacktop :bottom="100" target=".default-main" :visibility-height="visibilityHeight" class="z-0!" />
      </ElMain>
    </ElContainer>
  </div>
</template>

<style lang="scss" scoped>
.default-main {
  --el-main-padding: 0;
}
</style>
