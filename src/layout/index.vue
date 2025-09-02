<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { debounce } from 'lodash-es';
import NavBar from './components/nav-bar/index.vue';
import AppMain from './components/app-main/index.vue';
import Loading from '@/components/loading/Loading.vue';
import { useAppStatusStore } from '@/stores/app-status-store';
import bgImage from '@/assets/image/background.png';

defineOptions({
  name: 'Layout',
});

const currentWindowHeight = ref(window.innerHeight);
const visibilityHeight = computed(() => currentWindowHeight.value * 0.4);
const containerLoadTimeout = ref<any>();

const layoutRef = ref<HTMLElement | null>(null);
const appStatusStore = useAppStatusStore();

const backgroundImage = ref(bgImage);

const isLoaded = computed(() => appStatusStore.resourceLoadStatus);

onMounted(async () => {
  window.addEventListener('resize', debounce(handleResize, 100));
  await nextTick();
  await containerLoadComplete();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

function handleResize() {
  currentWindowHeight.value = window.innerHeight;
}

async function containerLoadComplete() {
  // 确保背景加载完成
  await waitForImageLoad(bgImage);
  containerLoadTimeout.value = setTimeout(() => {
    appStatusStore.setResourceLoadStatus(true);
  }, 1500);
}

function waitForImageLoad(imageSrc: string): Promise<void> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = imageSrc;
  });
}
</script>

<template>
  <!-- Loading -->
  <Loading />

  <!-- 背景图 -->
  <img class="page-bg" :src="backgroundImage" alt="背景图" />

  <!-- 页面主体 -->
  <ElContainer v-if="isLoaded" ref="layoutRef" class="layout">
    <ElHeader class="header-container">
      <NavBar />
    </ElHeader>
    <ElMain id="venus-main" class="main-container hidden-scrollbar">
      <AppMain />
      <ElBacktop :bottom="100" target="#venus-main" :visibility-height="visibilityHeight" />
    </ElMain>
    <ElFooter>Footer</ElFooter>
  </ElContainer>
</template>

<style lang="less" scoped>
.page-bg {
  /* 固定在页面背景 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 保持比例铺满 */
  object-fit: cover;
  /* 在内容后面 */
  z-index: -1;
}
.layout {
  width: 100%;
  height: 100%;
  position: relative;
  /*background-image: url('@/assets/image/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;*/
}
.header-container {
  // 动画时长
  @transition-duration: 0.5s;
  // 鼠标移入变换,
  &:hover {
    transition: background-color @transition-duration;
    background-color: var(--venus-menu-bg--color);
  }
  &:not(:hover) {
    transition: background-color @transition-duration;
  }
}
.main-container {
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
