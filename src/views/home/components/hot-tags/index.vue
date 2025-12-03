<script setup lang="ts">
import tagApiModule from '@/api/blog/tag';
import { asyncRequest } from '@/utils/request-util';

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
  <ElCard v-loading="loading" class="hot-tags-card">
    <template #header>
      <div class="card-header">
        <span class="text-base font-bold text-gray-700">热门标签</span>
      </div>
    </template>
    <div class="tags-container">
      <div v-if="hotTags.length" class="flex flex-wrap gap-2">
        <VenusTag v-for="tag of hotTags" :key="tag.id" :tag="tag" />
      </div>
      <ElEmpty v-else description="暂无标签" :image-size="60" />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.hot-tags-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  :deep(.el-card__header) {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  :deep(.el-card__body) {
    padding: 16px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tags-container {
  min-height: 80px;
}
</style>
