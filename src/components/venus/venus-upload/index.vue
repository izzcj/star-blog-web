<script setup lang="ts">
import 'element-plus/es/components/upload/style/index';
import type { UploadUserFile, UploadRawFile } from 'element-plus';
import path from 'path-browserify';
import { indexOf, remove } from 'lodash-es';
import { Delete, Plus } from '@element-plus/icons-vue';
import { venusUploadProps } from './props';
import { useUploadInfoStore } from '@/stores/upload-info-state';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { getAppConfig } from '@/utils/env-util';
import RequestHeader from '@/enum/request-header';
import { errorNotification } from '@/element-plus/notification';

defineOptions({
  name: 'VenusUpload',
});
const props = defineProps({
  ...venusUploadProps,
});

const model = defineModel<string | string[] | null>('value', { type: [String, Array] });

interface VenusUploadFile extends UploadUserFile {
  fullPath?: string | null;
}

const uploadInfoStore = useUploadInfoStore();
const result = uploadInfoStore.fetchOssBaseUrls();
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
  if (!props.multiple) {
    return 'picture-card';
  }
  return props.fileType == 'image' ? 'picture-card' : 'picture';
});

const limit = computed(() => {
  return props.multiple ?? false ? (props.max ?? 5) : 1;
});

const showFileList = computed(() => {
  return (props.multiple ?? false) && limit.value > 1;
});

const fileList = ref<VenusUploadFile[]>([]);
const singleImage = computed(() => {
  return fileList.value[fileList.value.length - 1];
});

const objectKeys = ref<string[]>([]);

watch(
  () => model.value ?? [],
  value => {
    let files: string[];
    if (isString(value) && value) {
      files = [value];
    } else if (isArray(value) && value.length > 0) {
      files = value;
    } else {
      files = [];
    }

    if (isEqual(files, objectKeys.value)) {
      return;
    }

    const updateFileList = () => {
      fileList.value = files.map(file => {
        objectKeys.value.push(file);
        return {
          name: path.basename(file).split('__', 2)[1],
          fullPath: file,
          url: uploadInfoStore.getOssBaseUrl(props.ossProvider ?? 'minio') + file,
          status: 'success',
        } as VenusUploadFile;
      });
    };

    if (uploadInfoStore.fetched) {
      updateFileList();
    } else {
      result?.then(updateFileList);
    }
  },
  { immediate: true },
);

watch(
  () => objectKeys.value.length,
  _ => {
    let value;
    if (props.multiple ?? false) {
      value = [...objectKeys.value];
    } else {
      value = objectKeys.value.length ? objectKeys.value[0] : null;
    }
    model.value = value;
  },
);

/**
 * 上传文件成功回调
 *
 * @param response   请求响应
 * @param uploadFile 上传文件
 */
function onSuccess(response: any, uploadFile: VenusUploadFile) {
  const objectKey = response.data;
  objectKeys.value.push(objectKey);
  // 使用 nextTick 确保 DOM 更新后再修改文件信息
  nextTick(() => {
    uploadFile.url = uploadInfoStore.getOssBaseUrl(props.ossProvider ?? 'minio') + objectKey;
    uploadFile.fullPath = objectKey;
    uploadFile.name = path.basename(objectKey).split('__', 2)[1];
  });
}

/**
 * 文件上传前回调
 *
 * @param rawFile 需要上传的文件
 */
function beforeUpload(rawFile: UploadRawFile) {
  if (props.fileType === 'image') {
    const supportableImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp'];
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
 */
async function beforeRemove(uploadFile: VenusUploadFile) {
  if (uploadFile.status != 'success') {
    return true;
  }
  if (!uploadFile.fullPath) {
    errorNotification('请先上传文件', '错误');
    return false;
  }
  try {
    await uploadInfoStore.removeTempObject(props.ossProvider ?? 'minio', uploadFile.fullPath);
    remove(objectKeys.value, item => item == uploadFile.fullPath);
    return true;
  } catch (error) {
    console.error('Failed to remove temp object:', error);
    errorNotification('删除文件失败', '错误');
    return false;
  }
}

/**
 * 处理移除文件
 *
 * @param file 上传文件
 */
function handleRemove(file: VenusUploadFile) {
  beforeRemove(file).then(() => {
    remove(fileList.value, item => item == file);
  });
}
</script>

<template>
  <div class="max-h-full">
    <ElUpload
      v-model:file-list="fileList"
      class="size-full"
      :action="uploadUrl"
      :headers="headers"
      :accept="props.fileType"
      :disabled="props.disabled"
      :drag="props.draggable"
      :show-file-list="showFileList"
      :multiple="props.multiple ?? false"
      :limit="limit"
      :list-type="listType"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :before-remove="beforeRemove"
    >
      <div v-if="!props.multiple && fileList.length === 1" class="el-upload-list--picture-card">
        <img :src="singleImage.url" class="object-cover transition-all duration-500 ease-in-out transform animate-fade-in" alt="" />
        <span class="el-upload-list__item-actions" @click.stop>
          <span class="el-upload-list__item-delete" @click="handleRemove(singleImage)">
            <ElIcon>
              <Delete />
            </ElIcon>
          </span>
        </span>
      </div>
      <div v-else>
        <ElIcon>
          <slot>
            <Plus />
          </slot>
        </ElIcon>
      </div>
    </ElUpload>
  </div>
</template>

<style scoped lang="scss">
</style>
