<script setup lang="ts">
import Cropper from 'cropperjs';
import { imageCropperProps } from './props';

interface CropperModalEmits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', blob: Blob): void;
  (e: 'cancel'): void;
}

defineOptions({
  name: 'ImageCropper',
});

const props = defineProps({
  ...imageCropperProps,
});

const emits = defineEmits<CropperModalEmits>();

const dialog = reactive({
  visible: false,
  width: '50%',
});

watch(
  () => props,
  () => {
    dialog.width = `${props.width + 208}px`;
  },
  {
    immediate: true,
  },
);

const dialogVisible = computed({
  get: () => props.visible,
  set: value => {
    emits('update:visible', value);
  },
});

let cropperInstance: Cropper | null = null;

// 确认裁剪中状态
const confirming = ref(false);

/**
 * 初始化Cropper
 */
function initCropper() {
  destroyInstance();

  const coverage = Math.round(100 * props.outWidth / Math.min(props.width, props.height)) * 0.01;
  const viewBorderRadius = props.rounded ? '50%' : '8px';
  const template: string = `
            <div style="flex:1; min-width: 300px;">
              <cropper-canvas background style="display:flex;border-radius:8px;width:100%;height:${props.height}px;max-width:${props.width}px">
                <cropper-image scalable translatable></cropper-image>
                <cropper-shade hidden></cropper-shade>
                <cropper-handle action="move" plain></cropper-handle>
                <cropper-selection id="cropperSelection" initial-coverage="${coverage}" aspect-ratio="${props.aspectRatio}" movable resizable zoomable">
                  <cropper-grid role="grid" bordered covered></cropper-grid>
                  <cropper-crosshair theme-color="rgba(238, 238, 238, 0.5)" centered></cropper-crosshair>
                  <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
                  <cropper-handle action="n-resize"></cropper-handle>
                  <cropper-handle action="e-resize"></cropper-handle>
                  <cropper-handle action="s-resize"></cropper-handle>
                  <cropper-handle action="w-resize"></cropper-handle>
                  <cropper-handle action="ne-resize"></cropper-handle>
                  <cropper-handle action="nw-resize"></cropper-handle>
                  <cropper-handle action="se-resize"></cropper-handle>
                  <cropper-handle action="sw-resize"></cropper-handle>
                </cropper-selection>
              </cropper-canvas>
            </div>
            <div id="viewer" style="width:160px;margin-left:16px; min-width: 160px;">
               <cropper-viewer selection="#cropperSelection" style="width:160px;height:160px;border-radius:${viewBorderRadius};"></cropper-viewer>
            </div>
        `;

  cropperInstance = new Cropper('#cropper-container', { template });
}

/**
 * 确认裁剪
 */
async function handleConfirm() {
  if (!cropperInstance) {
    return;
  }

  confirming.value = true;
  cropperInstance.getCropperSelection()?.$toCanvas()
    .then(canvas => {
      // 将 canvas 转换为 blob
      canvas.toBlob(
        blob => {
          confirming.value = false;
          if (blob) {
            emits('confirm', blob);
          }
        },
        'image/jpeg',
        props.coverage,
      );
    })
    .catch(error => {
      console.error('裁剪失败:', error);
      confirming.value = false;
    });
}

/**
 * 取消裁剪
 */
function handleCancel() {
  emits('update:visible', false);
}

/**
 * 弹窗关闭后的回调
 */
function handleClosed() {
  destroyInstance();
}

/**
 * 弹窗打开后的回调
 */
function handleOpened() {
  nextTick(() => {
    initCropper();
  });
}

/**
 * 销毁实例
 */
function destroyInstance() {
  if (cropperInstance) {
    cropperInstance.destroy();
    cropperInstance = null;
    const viewer = document.getElementById('viewer') as HTMLElement | null;
    if (viewer) {
      viewer.remove();
    }
  }
}

// 组件卸载时清理
onBeforeUnmount(() => {
  destroyInstance();
});
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="props.title"
    :width="props.width"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @opened="handleOpened"
    @closed="handleClosed"
  >
    <div class="flex w-full w-max-[500] flex-wrap">
      <img id="cropper-container" :src="props.path" alt="头像" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="handleCancel">
          取消
        </ElButton>
        <ElButton type="primary" :loading="confirming" @click="handleConfirm">
          确认
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
</style>
