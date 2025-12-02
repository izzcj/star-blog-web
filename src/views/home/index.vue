<script setup lang="ts">
import anime from 'animejs';
import { calculateElTopToViewportDistance } from '@/utils/html-util';
import MasterInfo from '@/views/home/components/master-info/index.vue';
import HotArticle from '@/views/home/components/hot-article/index.vue';
import { asyncRequest } from '@/utils/request-util';
import { systemConfigApiModule } from '@/api/system/system-config';
import type { SystemConfig } from '@/views/admin/system/system-config/metadata';
import tagApiModule from '@/api/blog/tag';

defineOptions({
  name: 'HomePage',
});

let mottoList: string[] = [];
const hotsTags = ref<Tag[]>([]);

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
 * 加载热门标签
 */
function loadHotTags() {
  asyncRequest<Tag[]>(tagApiModule.apis.fetchHot).then(res => {
    hotsTags.value = res.data;
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

onMounted(() => {
  loadTitle();
  loadMotto();
  loadHotTags();
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
        <!-- 左侧区域 -->
        <ElCol :span="24" :md="4">
          <div class="affix-content">
            <ElCard class="home-card">
              <span>广告招租位</span>
            </ElCard>
          </div>
        </ElCol>

        <!-- 中间区域 -->
        <ElCol :span="24" :md="12">
          <HotArticle />
        </ElCol>

        <!-- 右侧区域 -->
        <ElCol :span="24" :md="4">
          <div class="affix-content">
            <MasterInfo />
            <ElCard class="home-card">
              <template #header>
                <div class="card-header">
                  热门标签
                </div>
              </template>
              <div class="flex flex-wrap gap-2">
                <VenusTag
                  v-for="tag of hotsTags"
                  :key="tag.id"
                  :tag="tag"
                />
              </div>
            </ElCard>
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
  padding: 20px;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 100%;
}

.home-content {
  @media (max-width: 768px) {
    .el-col {
      width: 100% !important;
    }

    .el-col:nth-child(1) {
      order: 1;
    }

    .el-col:nth-child(2) {
      order: 3;
    }

    .el-col:nth-child(3) {
      order: 2;
    }
  }
}

.affix-content {
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding-right: 5px;
}

.home-card {
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}
</style>
