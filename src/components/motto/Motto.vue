<script setup lang="ts">
const props = defineProps({
  // motto
  motto: {
    type: String,
    default: '',
  },
  // 持续时长
  duration: {
    type: Number,
    default: 150,
  },
  // 间隔延迟
  delay: {
    type: Number,
    default: 3000,
  },
  // 是否开启动画
  play: {
    type: Boolean,
    default: true,
  },
  // 是否只执行一次
  once: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['updateMotto']);
// 显示内容
const content = ref('');
// 当前内容索引
const contentIndex = ref(0);
// 是否输出内容（true正向输出，false反向输出）
let print: boolean = true;
let timer: any;
let timeout: any;

onMounted(() => {
  if (props.play) {
    start(updateIndex);
  } else {
    content.value = props.motto;
  }
});

watch(
  [() => props.play, () => props.motto],
  () => {
    reset();
  },
);
watch(
  contentIndex,
  () => {
    content.value = props.motto.slice(0, contentIndex.value);
  },
);

/**
 * 开启动画
 */
function start(callback: () => void) {
  // 延迟
  timeout = setTimeout(() => {
    // 速度
    timer = setInterval(() => {
      callback();
      if (contentIndex.value === 0 || (contentIndex.value === props.motto.length && !props.once)) {
        // 此处为了延迟
        clearInterval(timer);
        if (!print) {
          // 更新motto
          updateMotto();
        }
        start(callback);
      } else if (contentIndex.value === props.motto.length && props.once) {
        clearInterval(timer);
      }
    }, props.duration);
  }, props.delay);
}

/**
 * 更新索引
 */
function updateIndex() {
  let newContentIndex = contentIndex.value;
  newContentIndex += print ? 1 : -1;
  // 正向输出
  if (print) {
    if (newContentIndex == props.motto.length + 1) {
      newContentIndex -= 2;
      print = !print;
    }
  } else {
    if (newContentIndex == -1) {
      newContentIndex += 2;
      print = !print;
    }
  }
  contentIndex.value = newContentIndex;
}

/**
 * 重置
 * 不重置会导致显示速度越来越快
 */
function reset() {
  contentIndex.value = 0;
  if (timeout != null) {
    clearTimeout(timeout);
    if (timer != null) {
      clearInterval(timer);
    }
  }
  if (props.play) {
    start(updateIndex);
  } else {
    content.value = props.motto;
  }
}

/**
 * 更新motto
 */
function updateMotto() {
  emit('updateMotto');
}

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<template>
  <slot :content="content" />
</template>

<style scoped lang="less">

</style>
