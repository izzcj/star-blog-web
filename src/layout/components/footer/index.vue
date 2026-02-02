<script setup lang="ts">
import { Link } from '@element-plus/icons-vue';
import { useScrollAnimation } from '@/uses/use-scroll-animation';

defineOptions({
  name: 'LayoutFooter',
});

// 当前年份计算
const currentYear = computed(() => new Date().getFullYear());
const copyrightYear = computed(() => {
  return currentYear.value > 2026 ? `2026-${currentYear.value}` : '2026';
});

// 备案链接
const ICP_LINK = 'https://beian.miit.gov.cn';
const POLICE_LINK = 'https://beian.mps.gov.cn/#/query/webSearch';

// 滚动动画
const { observeElement, fadeInUpConfig } = useScrollAnimation();

/**
 * 初始化滚动动画
 */
function initScrollAnimation() {
  nextTick(() => {
    const footerEl = document.querySelector('#app-footer');
    if (footerEl instanceof HTMLElement) {
      observeElement(footerEl, fadeInUpConfig, 0.1);
    }
  });
}

onMounted(() => {
  initScrollAnimation();
});
</script>

<template>
  <div id="app-footer" class="backdrop-blur-sm bg-white/60 border-t border-gray-200/50 flex items-center justify-center px-6 py-2">
    <ElRow justify="center" align="middle" class="w-full">
      <ElCol :span="24">
        <div class="flex flex-col items-center gap-1 text-gray-600 text-sm">
          <div>
            <span>热爱生活，也别忘了热爱自己！</span>
          </div>
          <!-- 备案信息 -->
          <div class="flex items-center flex-wrap justify-center md:gap-6 gap-1">
            <!-- ICP 备案 -->
            <a
              :href="ICP_LINK"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-600 hover:underline transition-colors duration-300 inline-flex items-center gap-1"
            >
              <ElIcon :size="16">
                <Link />
              </ElIcon>
              <span>黔ICP备2024023839号</span>
            </a>

            <!-- 公安备案 -->
            <a
              :href="POLICE_LINK"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-600 hover:underline transition-colors duration-300 inline-flex items-center gap-1"
            >
              <IconRender icon="svg:备案" :size="15" />
              <span>贵公网安备52011502009806号</span>
            </a>
          </div>
          <div>
            <span>本站所有素材均来自网络，如有侵权请联系作者删除！</span>
          </div>
          <!-- 版权信息 -->
          <div>
            Copyright © {{ copyrightYear }} Ale All Rights Reserved
          </div>
        </div>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped lang="scss">
</style>
