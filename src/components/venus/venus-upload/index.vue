<script setup lang="ts">
import 'element-plus/es/components/upload/style/index';
import type { UploadUserFile, UploadRawFile } from 'element-plus';
import path from 'path-browserify';
import { remove } from 'lodash-es';
import { Delete, Plus } from '@element-plus/icons-vue';
import { venusUploadProps } from './props';
import { useUploadInfoStore } from '@/stores/upload-info-state';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { getAppConfig } from '@/utils/env-util';
import { isValidImageType } from '@/utils/file-util';
import { asyncRequest } from '@/utils/request-util';
import { normalizeToArray } from '@/utils/array-util';
import { isUrl } from '@/utils/string-util';
import RequestHeader from '@/enums/request-header';
import { errorNotification } from '@/element-plus/notification';
import { uploadApiModule } from '@/api/upload';

defineOptions({ name: 'VenusUpload' });

const props = defineProps({ ...venusUploadProps });

const model = defineModel<string | string[] | null>('value', {
  type: [String, Array],
});

interface VenusUploadFile extends UploadUserFile {
  fileId?: string;
  translated?: boolean;
}

const uploadInfoStore = useUploadInfoStore();
const authenticationStore = useAuthenticationStore();

const apiBaseUrl = getAppConfig().apiBaseUrl;
const uploadUrl = `${apiBaseUrl.replace(/\/$/, '')}/oss/upload/${props.ossProvider}/${
  props.fileType === 'image' ? 'image' : 'file'
}`;

const headers = computed<Recordable>(() => {
  if (authenticationStore.isLoggedIn) {
    return {
      [RequestHeader.AUTHORIZATION]: `Bearer ${authenticationStore.accessToken}`,
    } as Recordable;
  }
  return {};
});

const accept = computed(() => (props.fileType === 'image' ? 'image/*' : '*'));

const limit = computed(() =>
  (props.multiple ?? false) ? (props.max ?? 5) : 1,
);

const listType = computed(() =>
  props.multiple ? (props.fileType === 'image' ? 'picture-card' : 'picture') : 'picture-card',
);

const showFileList = computed(() => props.multiple && limit.value > 1);

const fileList = ref<VenusUploadFile[]>([]);

const singleImage = computed(() => {
  return fileList.value[fileList.value.length - 1];
});

const fileIds = ref<string[]>([]);

/**
 * 根据 fileIds 重新生成 fileList
 */
async function rebuildFileList(ids: string[]) {
  fileList.value = [];

  // 防止竞态污染
  const snapshot = [...ids];

  const results = await Promise.all(
    snapshot.map(async value => {
      try {
        if (isUrl(value)) {
          const filename = path.basename(value);
          return {
            name: filename.includes('__') ? filename.split('__').pop()! : filename,
            url: value,
            status: 'success',
            fileId: value,
            translated: true,
          } as VenusUploadFile;
        }
        const resp = await asyncRequest(uploadApiModule.apis.fetchVisitUrl, { params: { fileId: value } });
        const url = resp.data;
        if (!url) {
          return null;
        }

        const filename = path.basename(url);
        return {
          name: filename.includes('__') ? filename.split('__').pop()! : filename,
          translated: false,
          fileId: value,
          url,
          status: 'success',
        } as VenusUploadFile;
      } catch {
        return null;
      }
    }),
  );

  // 如果期间 fileIds 已变，丢弃旧结果
  if (!isEqual(snapshot, fileIds.value)) {
    return;
  }

  fileList.value = results.filter(Boolean) as VenusUploadFile[];
}

watch(
  () => model.value,
  async value => {
    const ids = normalizeToArray(value);

    if (isEqual(ids, fileIds.value)) {
      return;
    }

    fileIds.value = ids;
    await rebuildFileList(ids);
  },
  { immediate: true },
);

watch(
  fileIds,
  ids => {
    model.value = props.multiple ? [...ids] : ids[0] ?? null;
  },
  { deep: true },
);

/**
 * 上传文件成功回调
 *
 * @param response   请求响应
 * @param uploadFile 上传文件
 */
function onSuccess(response: any, uploadFile: VenusUploadFile) {
  const meta = response.data;

  if (!fileIds.value.includes(meta.id)) {
    fileIds.value.push(meta.id);
  }

  uploadFile.url = meta.url;
  uploadFile.fileId = meta.id;
  uploadFile.name = path.basename(meta.url).split('__', 2)[1];
}

/**
 * 文件上传前回调
 *
 * @param rawFile 需要上传的文件
 */
function beforeUpload(rawFile: UploadRawFile) {
  if (props.fileType === 'image') {
    if (!isValidImageType(rawFile)) {
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
  if (uploadFile.status !== 'success') {
    return true;
  }
  if (!uploadFile.fileId) {
    return false;
  }

  if (uploadFile.translated) {
    remove(fileIds.value, v => v === uploadFile.url);
    return true;
  }

  try {
    await uploadInfoStore.removeTempObject(uploadFile.fileId);
    remove(fileIds.value, id => id === uploadFile.fileId);
    return true;
  } catch {
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
  <ElUpload
    v-model:file-list="fileList"
    class="size-full"
    :action="uploadUrl"
    :headers="headers"
    :accept="accept"
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
      <img :src="singleImage.url" class="object-cover transition duration-500 ease-in-out transform animate-fade-in" alt="" />
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
</template>

<style scoped lang="scss">
</style>
