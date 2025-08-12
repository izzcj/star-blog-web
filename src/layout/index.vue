<script setup lang="ts">
import NavBar from './components/nav-bar/index.vue';
import AppMain from './components/app-main/index.vue';

defineOptions({
  name: 'Layout',
});

const currentWindowHeight = ref(window.innerHeight);
const visibilityHeight = computed(() => {
  return currentWindowHeight.value * 0.4;
});

onMounted(() => {
  // 使用防抖函数提高性能
  window.addEventListener('resize', debounce(handleResize, 100));
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

/**
 * 处理窗口调整
 */
function handleResize() {
  currentWindowHeight.value = window.innerHeight;
}
</script>

<template>
  <ElContainer class="layout">
    <ElAffix>
      <ElHeader class="header-container">
        <NavBar />
      </ElHeader>
    </ElAffix>
    <ElMain id="venus-main" class="main-container hidden-scrollbar">
      <AppMain />
      <ElBacktop :bottom="100" target="#venus-main" :visibility-height="visibilityHeight" />
    </ElMain>
    <ElFooter>Footer</ElFooter>
  </ElContainer>
</template>

<style lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/image/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
</style>
