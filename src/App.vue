<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useUploadInfoStore } from '@/stores/upload-info-state';
import { emitter } from '@/utils/event-util';
import { useAppSettingsStore } from '@/stores/app-settings-store';

const appSettingsStore = useAppSettingsStore();
const uploadInfoStore = useUploadInfoStore();
uploadInfoStore.fetchOssBaseUrls();
emitter.on('global-im', message => handleGlobalEvent(message));

const noticeDialogVisible = ref(false);
const noticeTitle = ref('');
const noticeContent = ref('');

const currentWindowHeight = ref(window.innerHeight);

const isMobile = computed<boolean>({
  get: () => appSettingsStore.isMobile,
  set: bool => appSettingsStore.isMobile = bool,
});

/**
 * 处理全局事件
 *
 * @param message 消息
 */
function handleGlobalEvent(message: InstantMessage) {
  noticeDialogVisible.value = true;
  noticeTitle.value = message.extra.title;
  noticeContent.value = message.content;
}

/**
 * 处理窗口大小改变
 */
const handleResize = debounce(() => {
  currentWindowHeight.value = window.innerHeight;
  isMobile.value = window.innerWidth <= appSettingsStore.mobileWidth;
}, 100);

useEventListener(window, 'resize', () => {
  handleResize();
});

onMounted(() => {
  isMobile.value = window.innerWidth <= appSettingsStore.mobileWidth;
});
</script>

<template>
  <div class="container hidden-scrollbar">
    <ElConfigProvider :locale="zhCn">
      <RouterView />
    </ElConfigProvider>
    <ElDialog v-model="noticeDialogVisible" :title="noticeTitle" width="40%">
      <VenusVdMdEditor v-model:value="noticeContent" :preview="true" />
      <template #footer>
        <ElButton type="primary" @click="noticeDialogVisible = false">
          确定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss">
@use "@/styles/index";
</style>
