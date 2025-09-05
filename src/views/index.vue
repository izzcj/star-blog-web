<script setup lang="ts">
import anime from 'animejs';

defineOptions({
  name: 'Home',
});

// TODO: 待替换为接口获取
const mottoList = [
  '醉后不知天在水，满船清梦压星河',
  '人道洛阳花似锦，偏我来时不逢春',
  '愿你长歌乘风去，归来仍少年',
  '晚安',
];

const currentMottoIndex = ref(0);
const currentMotto = ref(mottoList[currentMottoIndex.value]);
const title = ref('夏至未至');

// header 展开状态
const isExpanded = ref(false);

onBeforeRouteLeave(() => {
  document.body.removeEventListener('wheel', preventScroll);
});

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
  if (isExpanded.value) {
    // 展开动画
    anime({
      targets: '.home-header',
      height: ['40vh', '100vh'],
      easing: 'easeInOutQuad',
      duration: 1000,
    });
    document.body.addEventListener('wheel', preventScroll, { passive: false });
  } else {
    // 收起动画
    anime({
      targets: '.home-header',
      height: ['100vh', '40vh'],
      easing: 'easeInOutQuad',
      duration: 1000,
    });
    document.body.removeEventListener('wheel', preventScroll);
  }
}

/***
 * 阻止滚动
 *
 * @param event 滚轮事件
 */
function preventScroll(event: WheelEvent) {
  event.preventDefault();
}
</script>

<template>
  <div class="home-container">
    <div class="venus-center home-header">
      <div class="home-title" @mouseenter="homeTitleAnime" @click="homeTitleClick">
        <span v-for="(char, index) of title" :key="index" class="title">{{ char }}</span>
      </div>
      <div class="home-motto">
        <Motto #default="scope" :motto="currentMotto" @update-motto="updateMotto">
          <h3>
            {{ scope.content }}<span class="cursor" />
          </h3>
        </Motto>
      </div>

      <div id="banner-wave-1" />
      <div id="banner-wave-2" />
    </div>

    <div class="home-body">
      <ElRow :gutter="20" class="home-content">
        <!-- 左侧区域 -->
        <ElCol :span="6">
          <div class="affix-content">
            <ElCard class="home-card">
              <template #header>
                <div class="card-header">
                  城市
                </div>
              </template>
              <div class="city-info">
                <p>城市：杭州</p>
                <p>省份：浙江省</p>
                <p>区域：华东地区</p>
              </div>
            </ElCard>
            <ElCard class="home-card">
              <template #header>
                <div class="card-header">
                  天气
                </div>
              </template>
              <div class="weather-info">
                <p>城市：杭州</p>
                <p>天气：晴朗</p>
                <p>温度：25°C</p>
                <p>湿度：60%</p>
              </div>
            </ElCard>
          </div>
        </ElCol>

        <!-- 中间区域 -->
        <ElCol :span="13">
          <ElCard class="home-card">
            <ElScrollbar>
              <div class="blog-list">
                <ElCard
                  v-for="i of 30"
                  :key="i"
                  class="blog-item"
                  shadow="hover"
                >
                  <div class="blog-title">
                    这是博客标题 {{ i }}
                  </div>
                  <div class="blog-summary">
                    这是博客的简要介绍内容，展示博客的主要内容和亮点。
                  </div>
                  <div class="blog-meta">
                    <span class="publish-date">2024-08-{{ 20 + i }}</span>
                    <ElTag size="small" class="blog-tag">
                      技术
                    </ElTag>
                  </div>
                </ElCard>
              </div>
            </ElScrollbar>
          </ElCard>
        </ElCol>

        <!-- 右侧区域 -->
        <ElCol :span="5">
          <div class="affix-content">
            <ElCard class="home-card">
              <template #header>
                <div class="card-header">
                  站长信息
                </div>
              </template>
              <div class="admin-info">
                <ElAvatar
                  src="https://www.zmtc.com/wp-content/uploads/2023/0308/20230308090400294.jpg"
                  size="large"
                  class="admin-avatar"
                />
                <div class="admin-details">
                  <p class="admin-name">
                    不快乐的阿乐
                  </p>
                  <p class="admin-desc">
                    热爱技术，其实是干后端的
                  </p>
                </div>
              </div>
            </ElCard>

            <ElCard class="home-card">
              <template #header>
                <div class="card-header">
                  热门标签
                </div>
              </template>
              <div class="hot-tags">
                <ElTag
                  v-for="tag of ['Vue', 'React', 'JavaScript', 'TypeScript', 'CSS', 'HTML']"
                  :key="tag"
                  class="hot-tag"
                  type="success"
                  effect="dark"
                >
                  {{ tag }}
                </ElTag>
              </div>
            </ElCard>
          </div>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<style scoped lang="less">
.home-container {
  width: 100%;
  height: 100%;
}

.home-header {
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  height: 40vh;
  overflow: hidden;
}

.home-title {
  cursor: pointer;
  color: rgb(255, 255, 255);
  font-size: 4vh;
  font-weight: 800;
  margin-bottom: 20px;
  .title {
    display: inline-block;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  }
}

.home-motto {
  height: 6.5vh;
  color: gainsboro;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
  .cursor {
    border-left: 2px solid rgba(255, 255, 255, 0.5);
    margin-left: 2px;
    animation: hideToShow 0.9s infinite;
  }
}

#banner-wave-1 {
  height: 8vh;
  background: url("@/assets/image/bannerWave1.png");
  position: absolute;
  width: 100%;
  bottom: 0;
  animation: gradientBG 20s linear infinite;
}
#banner-wave-2 {
  height: 10vh;
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

.blog-list {
  max-height: calc(80vh - 20px);
}

.affix-content {
  max-height: calc(100vh - 40px);
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

.blog-item {
  margin-bottom: 15px;
  min-height: 15vh;
}
.blog-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}
.blog-summary {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.5;
}
.blog-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.publish-date {
  font-size: 12px;
  color: #999;
}
</style>
