<script setup lang="ts">
import VenusEditor from '@/components/venus/venus-editor/index.vue';

defineOptions({
  name: 'AdminPage',
});
</script>

<template>
  <VenusEditor :is-read="true" />
</template>

<style scoped lang="scss">

</style>
