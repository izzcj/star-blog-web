<script setup lang="ts">
defineOptions({
  name: 'Logo',
});

const props = withDefaults(defineProps<Props>(), {
  textClass: '',
});

interface Props {
  /**
   * log地址
   */
  logo?: string;
  /**
   * 文字
   */
  text: string;
  /**
   * 文本的自定义类名
   */
  textClass?: string;
}
</script>

<template>
  <div class="flex items-center justify-items-start text-xl h-16 overflow-hidden whitespace-nowrap">
    <VenusImage v-if="props.logo" :src="props.logo" class="mr-2 rounded-xl h-8 w-auto" />
    <span
      v-for="(char, index) of props.text"
      :key="index"
      class="text-white/80 text-xl"
      :class="[props.textClass]"
    >
      {{ char }}
    </span>
  </div>
</template>

<style scoped lang="scss">
</style>
