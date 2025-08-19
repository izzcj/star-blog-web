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

/**
 * 更新motto
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
      { value: 10, duration: 800 },
      { value: -10, duration: 800 },
    ],
    easing: 'easeInOutSine',
    delay: (_, i) => i * 100,
  });
}

/**
 * 标题点击事件
 */
function homeTitleClick() {
  homeTitleAnime().restart();
}
</script>

<template>
  <div class="home-container">
    <div class="venus-center home-header">
      <div class="home-title" @click="homeTitleClick">
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
    <div class="home-body" />
  </div>
</template>

<style scoped lang="less">
.home-container {
  width: 100%;
  height: 100%;
}

.home-header {
  // 向下排列
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
  }
}

.home-motto {
  min-height: 13%;
  color: gainsboro;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;

  // 光标效果
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
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
