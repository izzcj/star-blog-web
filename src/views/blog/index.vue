<script setup lang="ts">
import type { Blog } from '@/components/blog/metadata';
import blogApiModule from '@/api/blog/blog';
import { asyncRequest } from '@/utils/request-util';
import BlogCard from '@/components/blog/blog-card/index.vue';

defineOptions({
  name: 'BlogPage',
});

const blogList = ref<Blog[]>([]);

const page = ref(1);
const size = ref(10);
const params = reactive({
  page,
  size,
  status: 'PUBLISHED',
});

onMounted(() => {
  loadBlogData();
});

/**
 * 加载博客数据
 */
function loadBlogData() {
  asyncRequest(blogApiModule.apis.fetchPage, { params }).then(res => {
    blogList.value = res.data.data;
  });
}
</script>

<template>
  <ElCard class="min-h-full">
    <div class="flex flex-wrap gap-4 justify-center w-full mx-auto 2xl:max-w-[900px]">
      <ElCard v-for="blog of blogList" :key="blog.id" class="flex-1 cursor-pointer min-w-[300px] 2xl:max-w-[400px]" body-class="flex flex-col min-h-full">
        <BlogCard :blog="blog" />
      </ElCard>
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
</style>
