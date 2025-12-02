<script setup lang="ts">
defineOptions({
  name: 'SvgIcon',
});
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '20px',
  },
  height: {
    type: String,
    default: '20px',
  },
  customClass: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <svg :class="customClass" :style="{ width, height }">
    <use :href="prefix + name" :fill="color" />
  </svg>
</template>
