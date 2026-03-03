<script setup lang="ts">
defineOptions({
  name: 'ArticleCardTag',
});

const props = defineProps<{
  article: ArticleDetail;
  isFeatured?: boolean;
}>();

const tags = computed(() => {
  const list: any[] = [];

  if (props.article.top) {
    list.push({
      type: 'top',
      label: '置顶',
      icon: 'Top',
    });
  }

  if (props.article.recommended) {
    list.push({
      type: 'rec',
      label: '精选',
      icon: 'Star',
    });
  }

  return list;
});

/**
 * 获取样式
 *
 * @param type tag类型
 */
function getClass(type: string) {
  if (type === 'top') {
    return props.isFeatured
      ? 'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-orange-600 md:bg-orange-50 md:border md:border-orange-200 bg-orange-500/80'
      : 'flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium text-white backdrop-blur-sm bg-orange-500/80';
  }

  if (type === 'rec') {
    return props.isFeatured
      ? 'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-mint-700 md:bg-mint-50 md:border md:border-mint-200 bg-mint-500/80'
      : 'flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium text-white backdrop-blur-sm bg-mint-500/80';
  }
}
</script>

<template>
  <div class="flex items-center gap-2 mb-4">
    <!-- 分类 -->
    <span
      v-if="article.categoryName"
      class="px-2.5 py-1 rounded-lg text-xs font-semibold tag-mint"
    >
      {{ article.categoryName }}
    </span>

    <!-- 标签 -->
    <template v-for="tag of tags" :key="tag.type">
      <span :class="getClass(tag.type)">
        <ElIcon :size="12">
          <component :is="tag.icon" />
        </ElIcon>
        {{ tag.label }}
      </span>
    </template>
  </div>
</template>
