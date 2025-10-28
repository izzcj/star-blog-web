<script setup lang="ts">
defineOptions({
  name: 'Logo',
});

withDefaults(defineProps<Props>(), {
  textClass: '',
});

interface Props {
  /**
   * 类型
   */
  type: string;
  /**
   * log地址/logo文本
   */
  logo: string;
  /**
   * 文本的自定义类名
   */
  textClass?: string;
}
</script>

<template>
  <div class="logo">
    <img v-if="type === 'IMAGE'" :src="logo" alt="LOGO" class="mr-2" />
    <span
      v-for="(char, index) of logo"
      v-else
      :key="index"
      class="text"
      :class="[textClass]"
    >
      {{ char }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  justify-content: left;
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  white-space: nowrap;

  img {
    border-radius: 9999px;
    width: auto;
    height: 32px;
  }

  .text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 20px;
  }
}
</style>
