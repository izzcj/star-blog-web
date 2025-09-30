<script setup lang="ts">
import type { UploadFile, UploadFiles, UploadUserFile, UploadRawFile } from 'element-plus';
import path from 'path-browserify';
import { indexOf, remove } from 'lodash-es';
import type { VenusUploadProps } from './props';
import { useUploadInfoStore } from '@/stores/upload-info-state';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { getAppConfig } from '@/utils/env-util';
import RequestHeader from '@/enum/request-header';
import { errorNotification } from '@/element-plus/notification';

defineOptions({
  name: 'VenusUpload',
});
const props = defineProps<VenusUploadProps>();

const emit = defineEmits<{
  (e: 'update:value', value: Nullable<string> | string[]): void;
}>();

const uploadInfoStore = useUploadInfoStore();
const apiBaseUrl = getAppConfig().apiBaseUrl;
let uploadUrl: string;
if (apiBaseUrl.endsWith('/')) {
  uploadUrl = `${apiBaseUrl}oss/upload/${props.ossProvider ?? 'minio'}/${
    props.fileType == 'image' ? 'image' : 'file'
  }`;
} else {
  uploadUrl = `${apiBaseUrl}/oss/upload/${props.ossProvider ?? 'minio'}/${
    props.fileType == 'image' ? 'image' : 'file'
  }`;
}

const authenticationStore = useAuthenticationStore();

const headers = computed<Recordable>(() => {
  if (authenticationStore.isLoggedIn) {
    return {
      [RequestHeader.AUTHORIZATION]: `Bearer ${authenticationStore.accessToken}`,
    } as Recordable;
  }

  return {};
});

const listType = computed(() => {
  return props.fileType == 'image' ? 'picture-card' : 'picture';
});

const showFileList = computed(() => {
  if (props.max) {
    return props.max > 1;
  }
  return true;
});

const fileList = ref<UploadUserFile[]>([]);

const objectKeys = ref<string[]>([]);

watch(
  () => objectKeys.value.length,
  _ => {
    let value;
    if (objectKeys.value.length > 1) {
      value = [...objectKeys.value];
    } else {
      value = objectKeys.value.length ? objectKeys.value[0] : null;
    }
    emit('update:value', value);
  },
);

/**
 * 上传文件成功回调
 *
 * @param response   请求响应
 * @param uploadFile 上传文件
 * @param _          上传文件列表
 */
function onSuccess(response: any, uploadFile: UploadFile, _: UploadFiles) {
  const objectKey = response.data;
  objectKeys.value.push(objectKey);
  uploadFile.url = uploadInfoStore.getOssBaseUrl(props.ossProvider ?? 'minio') + objectKey;
  uploadFile.name = path.basename(objectKey);
}

/**
 * 文件上传前回调
 *
 * @param rawFile 需要上传的文件
 */
function beforeUpload(rawFile: UploadRawFile) {
  const supportableImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp'];
  if (props.fileType == 'image') {
    if (indexOf(supportableImageTypes, rawFile.type) == -1) {
      errorNotification('仅支持jpeg,png,jpg,bmp格式的图片', '错误');
      return false;
    }
  }
  return true;
}

/**
 * 移除文件前回调
 *
 * @param uploadFile 上传文件
 * @param _          上传文件列表
 */
async function beforeRemove(uploadFile: UploadFile, _: UploadFiles) {
  if (uploadFile.status != 'success') {
    return true;
  }
  const response: any = uploadFile.response;
  try {
    await uploadInfoStore.removeTempObject(props.ossProvider ?? 'minio', response.data);
    remove(objectKeys.value, item => item == response.data);
    return true;
  } catch (error) {
    console.error('Failed to remove temp object:', error);
    return false;
  }
}
</script>

<template>
  <div class="max-h-full">
    <ElUpload
      v-model:file-list="fileList"
      class="size-full"
      :action="uploadUrl"
      :disabled="props.disabled"
      :drag="props.draggable"
      :headers="headers"
      :multiple="props.multiple"
      :accept="props.fileType"
      :limit="props.max"
      :show-file-list="showFileList"
      :list-type="listType"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :before-remove="beforeRemove"
    >
      <template #trigger>
        <ElIcon>
          <slot />
        </ElIcon>
        <div v-if="props.draggable" class="el-upload__text">
          拖拽文件到这里，或 <em>点击上传</em>
        </div>
      </template>
    </ElUpload>
  </div>
</template>

<style scoped lang="scss">
</style>
