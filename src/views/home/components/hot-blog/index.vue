<script setup lang="ts">
import { useRouter } from 'vue-router';
import blogApiModule from '@/api/blog/blog';
import { asyncRequest } from '@/utils/request-util';
import type { Blog } from '@/components/blog/metadata';
import BlogCard from '@/components/blog/blog-card/index.vue';

defineOptions({
  name: 'HotBlog',
});

const hotBlogs = ref<Blog[]>([]);
const router = useRouter();

onMounted(() => {
  loadHotBlogs();
});

/**
 * 跳转至博客列表页
 */
function goBlogList() {
  router.push({ name: 'Blog' });
}

/**
 * 加载热门博客
 */
async function loadHotBlogs() {
  const res = await asyncRequest(blogApiModule.apis.hotBlogs);
  hotBlogs.value = res.data ?? [];
}
</script>

<template>
  <ElCard class="hot-blog-card">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-bold">热门博客</span>
        <ElButton text type="primary" size="small" @click="goBlogList">
          查看更多
        </ElButton>
      </div>
    </template>
    <div class="flex flex-col gap-3">
      <template v-if="hotBlogs.length">
        <ElCard
          v-for="blog of hotBlogs"
          :key="blog.id"
          class="mb-1 cursor-pointer"
          body-class="p-2"
        >
          <BlogCard :blog="blog" />
        </ElCard>
      </template>
      <ElEmpty v-else description="暂无热门博客" />
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.hot-blog-card {
  .el-card__header {
    padding: 10px 12px;
  }
}
</style>
