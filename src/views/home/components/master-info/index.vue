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
    <ElCard class="master-card">
      <div class="master-content">
        <div class="avatar-wrapper">
          <ElAvatar :src="masterInfo.avatar" :size="100" class="master-avatar" />
          <div class="avatar-ring" />
        </div>
        <p ref="textShineRef" class="master-name text-shine">
          {{ masterInfo.nickname }}
        </p>
        <p class="master-remark">
          {{ masterInfo.remark }}
        </p>
        <div class="master-email">
          <ElIcon :size="16" class="email-icon">
            <Message />
          </ElIcon>
          <span class="email-text">{{ masterInfo.email }}</span>
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.card-wrapper {
  background: linear-gradient(163deg, #b5f6d4 0%, #9276fd 100%);
  border-radius: 12px;
  padding: 3px;
  margin-bottom: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    animation: shimmer 3s infinite;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(146, 118, 253, 0.4);

    .master-avatar {
      transform: scale(1.05) rotate(5deg);
    }

    .avatar-ring {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.master-card {
  background: white;
  border-radius: 10px;
  box-shadow: none;
  border: none;
  transition: all 0.3s;

  :deep(.el-card__body) {
    padding: 24px;
  }
}

.master-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.master-avatar {
  position: relative;
  z-index: 2;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 2px solid rgba(146, 118, 253, 0.3);
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.master-name {
  margin: 0 0 12px 0;
  font-size: 20px;
}

.text-shine {
  color: #fff;
  background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #868686 20%) 0;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
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

.master-remark {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  max-width: 200px;
}

.master-email {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #888;
  padding: 8px 16px;
  background-color: #f5f7fa;
  border-radius: 20px;
  transition: all 0.2s;

  &:hover {
    background-color: #e8ebf0;
    color: #409eff;

    .email-icon {
      color: #409eff;
    }
  }
}

.email-icon {
  color: #888;
  transition: color 0.2s;
}

.email-text {
  font-weight: 500;
}
</style>
