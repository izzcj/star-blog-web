<script setup lang="ts">
import { Avatar, View } from '@element-plus/icons-vue';
import type { Blog } from './metadata';
import blogApiModule from '@/api/blog';
import { asyncRequest } from '@/utils/request-util';

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
  asyncRequest(blogApiModule.apis.page, { params }).then(res => {
    blogList.value = res.data.data;
  });
}

const router = useRouter();

/**
 * 点击博客
 */
function clickBlog(blog: Blog) {
  router.push({
    name: 'BlogDetails',
    params: {
      id: blog.id,
    },
  });
}
</script>

<template>
  <div>
    <ElCard v-for="blog of blogList" :key="blog.id" @click="clickBlog(blog)">
      <div>
        <ElImage :src="blog.coverImage" fit="cover" />
        <div class="flex">
          <span class="mr-auto">
            {{ blog.title }}
          </span>
          <ElTag class="ml-auto">
            {{ blog.typeName }}
          </ElTag>
        </div>
        <p class="text-[12px] text-black/50">
          {{ blog.summary }}
        </p>
        <div class="pt-5 text-[13px] text-black/40 flex">
          <div class="mr-auto venus-center">
            <ElIcon>
              <Avatar />
            </ElIcon>
            {{ blog.createByName }}
            <div class="pl-2 venus-center">
              <ElIcon class="pr-0.5">
                <View />
              </ElIcon>
              {{ blog.viewCount }}
            </div>
          </div>
          <div class="ml-auto">
            {{ blog.publishTime }}
          </div>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
</style>
