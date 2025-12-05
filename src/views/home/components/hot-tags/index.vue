<script setup lang="ts">
import tagApiModule from '@/api/blog/tag';
import { asyncRequest } from '@/utils/request-util';
import HomeComponentCard from '@/views/home/components/home-component-card.vue';

defineOptions({
  name: 'HotTags',
});

// 热门标签列表
const hotTags = ref<Tag[]>([]);
const loading = ref(false);

/**
 * 加载热门标签
 */
function loadHotTags() {
  loading.value = true;
  asyncRequest<Tag[]>(tagApiModule.apis.fetchHot)
    .then(res => {
      hotTags.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  loadHotTags();
});
</script>

<template>
  <HomeComponentCard v-loading="loading" title="热门标签">
    <div class="min-h-20">
      <div v-if="hotTags.length" class="flex flex-wrap gap-2">
        <VenusTag v-for="tag of hotTags" :key="tag.id" :tag="tag" />
      </div>
      <ElEmpty v-else description="暂无标签" :image-size="60" />
    </div>
  </HomeComponentCard>
</template>

<style scoped lang="scss">
</style>
