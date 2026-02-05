<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue';
import { venusAvatarProps } from './props';
import AvatarDisplay from './components/avatar-display/index.vue';
import AvatarUploader from './components/avatar-uploader/index.vue';
import ImageCropper from './components/image-cropper/index.vue';
import { useUploadInfoStore } from '@/stores/upload-info-state';
import { errorNotification, successNotification } from '@/element-plus/notification';
import { blobToFile, fileToDataURL, isValidImageType } from '@/utils/file-util';
import { asyncRequest, asyncUploadRequest } from '@/utils/request-util';
import { uploadApiModule } from '@/api/upload';

defineOptions({
  name: 'VenusAvatar',
});

const props = defineProps({
  ...venusAvatarProps,
});

const uploadInfoStore = useUploadInfoStore();

const model = defineModel<string | null>('value', { type: String });

const avatarUrl = ref('');

watch(
  () => model.value,
  value => {
    if (!value) {
      avatarUrl.value = '';
      return;
    }
    if (value.startsWith('http')) {
      avatarUrl.value = value;
      return;
    }
    asyncRequest(uploadApiModule.apis.fetchVisitUrl, { params: { fileId: value } }).then(resp => {
      avatarUrl.value = resp.data;
    });
  },
  { immediate: true },
);

// 尺寸映射
const sizeMap = {
  mini: 24,
  small: 32,
  default: 50,
  large: 80,
};

// 计算实际尺寸
const computedSize = computed(() => {
  if (isNumber(props.size)) {
    return props.size;
  }
  return sizeMap[props.size];
});

// 裁剪弹窗显示状态
const showCropperModal = ref(false);

// 待裁剪的图片 DataURL
const imageToCrop = ref('');

// 上传加载状态
const uploading = ref(false);

/**
 * 处理文件选择
 *
 * @param file 选择的文件
 */
async function handleFileSelected(file: File) {
  // 验证文件类型
  if (!isValidImageType(file)) {
    errorNotification('仅支持 jpeg、png、jpg、bmp 格式的图片', '错误');
    return;
  }

  // 如果启用裁剪
  if (props.enableCrop) {
    try {
      imageToCrop.value = await fileToDataURL(file);
      showCropperModal.value = true;
    } catch (error) {
      console.error('读取图片失败:', error);
      errorNotification('读取图片失败', '错误');
    }
  } else {
    // 直接上传
    await uploadToOss(file);
  }
}

/**
 * 确认裁剪
 *
 * @param blob 裁剪后的 Blob
 */
async function handleCropConfirm(blob: Blob) {
  const file = blobToFile(blob, 'avatar.jpg');
  showCropperModal.value = false;
  await uploadToOss(file);
}

/**
 * 上传到 OSS
 *
 * @param file 文件对象
 */
async function uploadToOss(file: File) {
  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await asyncUploadRequest<OssMate>(formData, props.ossProvider);
    model.value = response.data.id;
    avatarUrl.value = response.data.url;

    successNotification('头像上传成功', '成功');
  } catch (error) {
    console.error('上传失败:', error);
    errorNotification('头像上传失败', '错误');
  } finally {
    uploading.value = false;
  }
}

/**
 * 删除头像
 */
async function handleDelete() {
  if (!model.value) {
    return;
  }

  try {
    await uploadInfoStore.removeTempObject(model.value);
    model.value = null;
    avatarUrl.value = '';
  } catch (error) {
    console.error('删除失败:', error);
    errorNotification('删除头像失败', '错误');
  }
}
</script>

<template>
  <div
    class="relative inline-block"
    :style="{ width: `${computedSize}px`, height: `${computedSize}px` }"
  >
    <AvatarUploader
      :enabled="props.mode === 'edit' && !uploading"
      :has-avatar="!!model"
      @upload="handleFileSelected"
      @delete="handleDelete"
    >
      <AvatarDisplay
        :src="avatarUrl"
        :name="props.name"
        :size="computedSize"
        :shape="props.shape"
        :text-color="props.textColor"
        :bg-color="props.bgColor"
      />
    </AvatarUploader>

    <!-- 裁剪弹窗 -->
    <ImageCropper
      v-model:visible="showCropperModal"
      :path="imageToCrop"
      @confirm="handleCropConfirm"
    />

    <!-- 上传中遮罩 -->
    <Transition name="fade-scale">
      <div
        v-if="uploading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full"
      >
        <div class="actions flex gap-3 text-white">
          <ElIcon class="animate-spin" :size="computedSize * 0.3">
            <Loading />
          </ElIcon>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
</style>
