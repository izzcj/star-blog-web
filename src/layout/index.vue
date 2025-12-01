<script setup lang="ts">
import { debounce } from 'lodash-es';
import NavBar from './components/nav-bar/index.vue';
import AppMain from './components/app-main/index.vue';
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

const layoutRef = ref<HTMLElement | null>(null);
const appStatusStore = useAppStatusStore();
const appSettingsStore = useAppSettingsStore();

const backgroundImage = ref(bgImage);

const isLoaded = computed(() => appStatusStore.resourceLoadStatus);
const isMobile = computed<boolean>({
  get: () => appSettingsStore.isMobile,
  set: bool => appSettingsStore.isMobile = bool,
});

onMounted(() => {
  isMobile.value = window.innerWidth <= appSettingsStore.mobileWidth;
  window.addEventListener('resize', debounce(handleResize, 100));
  containerLoadComplete();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

/**
 * 处理窗口大小改变
 */
function handleResize() {
  currentWindowHeight.value = window.innerHeight;
  isMobile.value = window.innerWidth <= appSettingsStore.mobileWidth;
}

/**
 * 容器加载完毕
 */
function containerLoadComplete() {
  containerLoadTimeout.value = setTimeout(() => {
    appStatusStore.setResourceLoadStatus(true);
  }, 1500);
}
</script>

<template>
  <div>
    <!-- Loading -->
    <Loading />

    <!-- 背景图 -->
    <ElImage class="h-dvh w-dvw fixed" :src="backgroundImage" fit="cover" :z-index="-1" alt="背景图" />

    <!-- 页面主体 -->
    <ElContainer v-if="isLoaded" ref="layoutRef" class="h-dvh w-dvw relative">
      <ElHeader :class="isMobile ? '' : 'transition-colors duration-500 ease-in-out hover:bg-(--venus-menu-bg--color)'">
        <NavBar />
      </ElHeader>
      <ElMain id="venus-main" class="default-main w-dvw hidden-scrollbar">
        <AppMain />
        <ElBacktop :bottom="100" target="#venus-main" :visibility-height="visibilityHeight" />
      </ElMain>
      <ElFooter>Footer</ElFooter>
    </ElContainer>
  </div>
</template>

<style lang="scss" scoped>
.default-main {
  --el-main-padding: 0 20px;
}
</style>
