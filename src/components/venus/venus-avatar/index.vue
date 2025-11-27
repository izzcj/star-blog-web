<script setup lang="ts">
import { venusAvatarProps } from './props';
import AvatarDisplay from './components/avatar-display/index.vue';
import AvatarUploader from './components/avatar-uploader/index.vue';
import { blobToFile, fileToDataURL, isValidImageType } from './utils/image-process';
import ImageCropper from './components/image-cropper/index.vue';
import { useUploadInfoStore } from '@/stores/upload-info-state';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { getAppConfig } from '@/utils/env-util';
import { errorNotification, successNotification } from '@/element-plus/notification';
import request from '@/request';
import RequestMethod from '@/enum/request-method';
import RequestHeader from '@/enum/request-header';

defineOptions({
  name: 'VenusAvatar',
});

const props = defineProps({
  ...venusAvatarProps,
});

const model = defineModel<string | null>('value', { type: String });

const uploadInfoStore = useUploadInfoStore();

const authenticationStore = useAuthenticationStore();

// 尺寸映射
const sizeMap = {
  small: 48,
  default: 80,
  large: 120,
  auto: null,
};

// 计算实际尺寸
const computedSize = computed(() => {
  return props.customSize || sizeMap[props.size];
});

// 上传 URL
const uploadUrl = computed(() => {
  const apiBaseUrl = getAppConfig().apiBaseUrl;
  const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`;
  return `${baseUrl}oss/upload/${props.ossProvider}/image`;
});

// 裁剪弹窗显示状态
const showCropperModal = ref(false);

// 待裁剪的图片 DataURL
const imageToCrop = ref('');

// 上传加载状态
const uploading = ref(false);

// 请求头
const headers = computed<Recordable>(() => {
  if (authenticationStore.isLoggedIn) {
    return {
      [RequestHeader.AUTHORIZATION]: `Bearer ${authenticationStore.accessToken}`,
      [RequestHeader.CONTENT_TYPE]: RequestHeader.CONTENT_TYPE_MULTIPART_FORM_DATA,
    } as Recordable;
  }
  return {};
});

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

    const response = await request({
      url: uploadUrl.value,
      method: RequestMethod.POST,
      headers: headers.value,
      data: formData,
    });
    model.value = response.data.data;

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
    await uploadInfoStore.removeTempObject(props.ossProvider, model.value);
    model.value = null;
    successNotification('头像已删除', '成功');
  } catch (error) {
    console.error('删除失败:', error);
    errorNotification('删除头像失败', '错误');
  }
}
</script>

<template>
  <div class="relative inline-block">
    <AvatarUploader
      :disabled="props.disabled || uploading"
      :has-avatar="!!model"
      @upload="handleFileSelected"
      @delete="handleDelete"
    >
      <AvatarDisplay
        :src="model"
        :name="props.name"
        :size="computedSize"
        :shape="props.shape"
        :text-color="props.textColor"
        :bg-color="props.bgColor"
        :oss-provider="props.ossProvider"
      />
    </AvatarUploader>

    <!-- 裁剪弹窗 -->
    <ImageCropper
      v-model:visible="showCropperModal"
      :path="imageToCrop"
      @confirm="handleCropConfirm"
    />

    <!-- 上传中遮罩 -->
    <Transition name="fade">
      <div
        v-if="uploading"
        class="border-inherit absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-inherit"
      >
        <ElIcon class="animate-spin text-white" :size="computedSize * 0.3">
          <Loading />
        </ElIcon>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
</style>
