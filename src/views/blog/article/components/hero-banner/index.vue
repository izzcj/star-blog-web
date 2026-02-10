<script setup lang="ts">
import { systemConfigApiModule } from '@/api/system/system-config';
import { asyncRequest } from '@/utils/request-util';

defineOptions({
  name: 'HeroBanner',
});

const bannerImage = ref<string>('');
const loading = ref(false);

const mouseInside = ref(false);

const parallax = ref();

const container = ref(null);

const style = computed(() => {
  if (!mouseInside.value || !parallax.value) {
    return {
      transform: 'translate3d(0, 0, 0)',
    };
  }

  const x = parallax.value.tilt * 30;
  const y = parallax.value.roll * 30;

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(1.05)`,
  };
});

/**
 * 鼠标移入
 */
function onMouseEnter() {
  mouseInside.value = true;
  if (!parallax.value) {
    parallax.value = useParallax(container);
  }
}

/**
 * 鼠标移出
 */
function onMouseLeave() {
  mouseInside.value = false;
}

/**
 * 加载横幅图片配置
 */
async function loadBannerImage() {
  loading.value = true;
  try {
    const res = await asyncRequest<SystemConfig>(
      systemConfigApiModule.apis.fetchOne,
      { params: { key: 'hero-banner-cover' } },
    );
    if (res.data.value) {
      bannerImage.value = res.data.value;
    }
  } catch (error) {
    console.error('加载横幅图片配置失败:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadBannerImage();
});
</script>

<template>
  <!-- 加载状态 -->
  <div v-if="loading" class="h-[300px] md:h-[400px] lg:h-[500px] w-full rounded-xl md:rounded-2xl neumorphic animate-pulse">
    <div class="h-full w-full bg-gradient-to-br from-mint-100 to-mint-200" />
  </div>

  <!-- 横幅图片展示 -->
  <div
    v-else-if="!loading && bannerImage"
    class="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl md:rounded-2xl contain-layout"
  >
    <!-- 背景图片 -->
    <div
      ref="container"
      class="absolute inset-0"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <VenusImage
        :src="bannerImage"
        alt="Hero Banner"
        class="w-full h-full"
        :style="style"
      />
    </div>
  </div>

  <!-- 空状态 -->
  <div v-else-if="!loading && !bannerImage" class="h-[300px] flex items-center justify-center neumorphic rounded-xl md:rounded-2xl">
    <p class="text-gray-400">
      暂无横幅图片
    </p>
  </div>
</template>

<style scoped lang="scss">
</style>
