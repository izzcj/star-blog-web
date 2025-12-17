<script setup lang="ts">
import { asyncRequest } from '@/utils/request-util';
import userApiModule from '@/api/system/user';

const props = defineProps<{
  authorId: string;
}>();

// 作者信息
const authorInfo = ref<User>({
  id: '',
  avatar: '',
  nickname: '',
  remark: '',
  username: '',
  email: '',
  phone: '',
  enabled: false,
  createTime: '',
  updateTime: '',
});
const loading = ref(false);

/**
 * 获取作者信息
 */
async function fetchAuthorInfo() {
  loading.value = true;
  try {
    const response = await asyncRequest<User>(userApiModule.apis.fetchDetail, {
      pathParams: { id: props.authorId },
    });
    Object.assign(authorInfo.value, response.data);
  } catch (error) {
    console.error('获取作者信息失败:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchAuthorInfo();
});
</script>

<template>
  <ElCard
    shadow="never"
    class="border border-gray-100/60 hover:shadow-lg transition-all duration-300 rounded-xl"
  >
    <ElSkeleton v-if="loading" :rows="3" animated />

    <div v-else-if="authorInfo.id" class="flex flex-col items-center text-center p-2">
      <!-- 头像 -->
      <div class="relative mb-4">
        <VenusAvatar
          v-model:value="authorInfo.avatar"
          size="large"
          class="transition-transform duration-300 ease-out hover:scale-105"
        />
      </div>

      <!-- 昵称 -->
      <h3 class="text-lg font-bold text-gray-800 mb-2">
        {{ authorInfo.nickname }}
      </h3>

      <!-- 简介 -->
      <p class="text-sm text-gray-600 leading-relaxed">
        {{ authorInfo.remark || '暂无简介' }}
      </p>
    </div>

    <div v-else class="text-center text-sm text-gray-500 py-4">
      作者信息加载失败
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
</style>
