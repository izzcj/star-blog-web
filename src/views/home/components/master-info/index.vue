<script setup lang="ts">
import { Message } from '@element-plus/icons-vue';
import { asyncRequest } from '@/utils/request-util';
import userApiModule from '@/api/system/user';

defineOptions({
  name: 'MasterInfo',
});

const masterInfo: Pick<UserProfile, 'nickname' | 'avatar' | 'remark' | 'email'> = reactive({
  nickname: '',
  avatar: '',
  remark: '',
  email: '',
});
const textShineRef = ref<HTMLElement | null>(null);
onMounted(() => {
  asyncRequest(userApiModule.apis.masterInfo).then(res => {
    const { nickname, avatar, remark, email } = res.data;
    Object.assign(masterInfo, { nickname, avatar, remark, email });

    // 动态设置背景动画距离
    nextTick(() => {
      if (textShineRef.value) {
        const textWidth = textShineRef.value.offsetWidth;
        textShineRef.value.style.setProperty('--shine-distance', `${textWidth}px`);
      }
    });
  });
});
</script>

<template>
  <div class="card-wrapper">
    <ElCard class="card mb-2.5 rounded-xl shadow-xl">
      <div class="flex-col">
        <ElAvatar
          :src="masterInfo.avatar"
          :size="100"
        />
        <p ref="textShineRef" class="text-shine">
          {{ masterInfo.nickname }}
        </p>
        <p class="pt-3">
          {{ masterInfo.remark }}
        </p>
        <p>
          <ElIcon class="text-gray-500">
            <Message />
          </ElIcon>
          {{ masterInfo.email }}
        </p>
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.text-shine {
  color: #fff;
  background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #868686 20%) 0;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  font-size: 18px;
  animation: shine 5s infinite linear;
  --shine-distance: 100%;
}

@keyframes shine {
  0% {
    background-position: 0;
  }
  100% {
    background-position: var(--shine-distance);
  }
}

.card-wrapper {
  background-image: linear-gradient(163deg, #b5f6d4 0%, #9276fd 100%);
  border-radius: 12px;
  transition: all .3s;
}

.card {
  transition: all .2s;
}

.card:hover {
  transform: scale(0.98);
}

.card-wrapper:hover {
  box-shadow: 0 0 30px 1px rgba(0, 255, 117, 0.30);
  animation: floatArrow 2s linear infinite;
}
</style>
