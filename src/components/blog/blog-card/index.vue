<script setup lang="ts">
import { Avatar, Clock, View } from '@element-plus/icons-vue';
import type { Blog } from '@/components/blog/metadata';

defineOptions({
  name: 'BlogCard',
});

defineProps<{
  blog: Blog;
}>();

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
  <div @click="clickBlog(blog)">
    <div v-if="blog.coverImage" class="rounded-[8px] shadow-xl overflow-hidden">
      <VenusImage :src="blog.coverImage" :alt="blog.title" class="transition duration-500 ease-in-out hover:scale-125" />
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
  </div>
</template>

<style scoped lang="scss">
</style>
