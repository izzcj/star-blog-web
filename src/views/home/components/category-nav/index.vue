<script setup lang="ts">
import { useRouter } from 'vue-router';
import HomeComponentCard from '../home-component-card.vue';

defineOptions({
  name: 'CategoryNav',
});

/**
 * 分类（含文章数）
 */
interface CategoryWithCount {
  // ID
  id: string;
  // 分类名称
  name: string;
  // 文章数量
  articleCount: number;
  // 渐变色配置
  color: string;
}

const router = useRouter();

// 分类列表
const categories = ref<CategoryWithCount[]>([]);
const loading = ref(false);

/**
 * 加载分类列表
 */
function loadCategories() {
  loading.value = true;

  // Mock数据，后续对接API
  setTimeout(() => {
    categories.value = [
      {
        id: '1',
        name: '前端开发',
        articleCount: 23,
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      {
        id: '2',
        name: '后端开发',
        articleCount: 15,
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
      {
        id: '3',
        name: '移动开发',
        articleCount: 12,
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      {
        id: '4',
        name: '设计相关',
        articleCount: 8,
        color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      },
    ];
    loading.value = false;
  }, 300);
}

/**
 * 跳转到分类页面
 *
 * @param categoryId 分类ID
 */
function goToCategory(categoryId: string) {
  router.push({ name: 'Article', query: { categoryId } });
}

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <HomeComponentCard v-loading="loading" title="分类导航">
    <div class="category-grid">
      <div
        v-for="category of categories"
        :key="category.id"
        class="category-item"
        :style="{ background: category.color }"
        @click="goToCategory(category.id)"
      >
        <div class="category-content">
          <div class="category-info">
            <div class="category-name">
              {{ category.name }}
            </div>
            <div class="category-count">
              {{ category.articleCount }} 篇
            </div>
          </div>
        </div>
      </div>
      <ElEmpty v-if="!loading && categories.length === 0" description="暂无分类" :image-size="60" />
    </div>
  </HomeComponentCard>
</template>

<style scoped lang="scss">
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.category-item {
  position: relative;
  padding: 16px;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    opacity: 0.85;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 1;
    }

    .category-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .category-name {
      transform: translateX(4px);
    }
  }
}

.category-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.category-icon {
  color: white;
  margin-bottom: 8px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-info {
  width: 100%;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}
</style>
