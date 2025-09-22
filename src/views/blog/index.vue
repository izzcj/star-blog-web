<script setup lang="ts">
import { View } from '@element-plus/icons-vue';
import blogApiModule from '@/api/blog';
import { asyncRequest } from '@/utils/request-util';

defineOptions({
  name: 'BlogPage',
});

interface Blog {
  id: string;
  type: string;
  typeName: string;
  title: string;
  summary: string;
  coverImage: string;
  viewCount: number;
  top: boolean;
  publishTime: string;
  tags: Recordable[];
}

const blogList = ref<Blog[]>([]);

const page = ref(1);
const size = ref(10);
const params = reactive({
  page,
  size,
  status: 'PUBLISHED',
});

onMounted(() => {
  asyncRequest(blogApiModule.apis.page, { params }).then(res => {
    blogList.value = res.data.data;
  });
});
</script>

<template>
  <div>
    <ElCard v-for="blog of blogList" :key="blog.id">
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
        <p class="text-[12px]">
          {{ blog.summary }}
        </p>
        <div class="pt-5 text-[12px] text-black/30 flex">
          <span class="mr-auto venus-center">
            <ElIcon class="pr-0.5">
              <View />
            </ElIcon>
            {{ blog.viewCount }}
          </span>
          <ElTag class="ml-auto">
            {{ blog.publishTime }}
          </ElTag>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
</style>
