<script setup lang="ts">
import { Avatar, Clock, View } from '@element-plus/icons-vue';
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
  <ElCard class="min-h-full">
    <div class="flex flex-wrap gap-4 justify-center w-full mx-auto 2xl:max-w-[900px]">
      <ElCard v-for="blog of blogList" :key="blog.id" class="flex-1 cursor-pointer min-w-[300px] 2xl:max-w-[400px]" body-class="flex flex-col min-h-full" @click="clickBlog(blog)">
        <div v-if="blog.coverImage" class="rounded-[8px] shadow-xl overflow-hidden">
          <img :src="blog.coverImage" :alt="blog.title" class="transition duration-300 ease-in-out hover:scale-125" />
        </div>
        <div class="pt-2">
          <span class="mr-auto text-[20px] font-bold">
            {{ blog.title }}
          </span>
        </div>
        <span v-if="blog.summary" class="mt-auto text-[12px] text-black/75">
          {{ blog.summary }}
        </span>
        <div class="pt-5 text-[13px] text-black/40">
          <div class="mr-auto flex flex-wrap">
            <div class="venus-center">
              <ElIcon>
                <Avatar />
              </ElIcon>
              <span class="pl-1">
                {{ blog.createByName }}
              </span>
            </div>
            <div class="pl-2 venus-center">
              <ElIcon>
                <View />
              </ElIcon>
              <span class="pl-1">
                {{ blog.viewCount }}
              </span>
            </div>
          </div>
          <div class="mr-auto">
            <div class="flex items-center">
              <ElIcon>
                <Clock />
              </ElIcon>
              <span class="pl-1">
                {{ blog.publishTime }}
              </span>
            </div>
          </div>
        </div>
      </ElCard>
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.blog-cover {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
