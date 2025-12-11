<script setup lang="ts">
import { DArrowLeft, Delete, Edit, Plus } from '@element-plus/icons-vue';
import type { DictData } from './metadata';
import dictDataApiModule from '@/api/system/dict-data';
import { asyncRequest } from '@/utils/request-util';
import { successMessage } from '@/element-plus/notification';

defineOptions({
  name: 'DictDataPage',
});

const props = defineProps<{
  // 字典key
  dictKey: string;
}>();

const router = useRouter();

const dictDataList = ref<DictData[]>([]);

const total = ref(0);
const pagination = reactive({
  page: 1,
  size: 10,
});

// 弹窗相关
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const formRef = ref();
const formData = ref<Omit<DictData, 'id' | 'deletable'>>({
  dictLabel: '',
  dictValue: '',
  dictKey: '',
  cssClass: '',
  listClass: '',
  sort: 0,
  enabled: true,
});

watch(() => [pagination.page, pagination.size], () => {
  loadDictData();
});

onMounted(() => {
  loadDictData();
});

/**
 * 返回字典管理页面
 */
function handleBack() {
  router.go(-1);
}

/**
 * 加载字典项
 */
function loadDictData() {
  if (!props.dictKey) {
    return;
  }

  asyncRequest<PageData<DictData>>(dictDataApiModule.apis.fetchPage, {
    params: {
      page: pagination.page,
      size: pagination.size,
      dictKey: props.dictKey,
    },
  }).then(res => {
    dictDataList.value = res.data.data;
    total.value = Number(res.data.total);
  });
}

/**
 * 新增字典项
 */
function handleAddDictItem() {
  dialogTitle.value = '新增字典项';
  isEdit.value = false;
  formData.value = {
    dictLabel: '',
    dictValue: '',
    dictKey: props.dictKey,
    cssClass: '',
    listClass: '',
    sort: 0,
    enabled: true,
  };
  dialogVisible.value = true;
}

/**
 * 修改字典项
 *
 * @param dictItem 字典项
 */
function handleEditDictItem(dictItem: DictData) {
  dialogTitle.value = '修改字典项';
  isEdit.value = true;
  formData.value = { ...dictItem };
  dialogVisible.value = true;
}

/**
 * 保存字典项
 */
function saveDictItem(dictItem: DictData) {
  asyncRequest(dictDataApiModule.apis.modify, {
    data: {
      ...dictItem,
    },
  }).then(() => {
    successMessage('保存成功');
    loadDictData();
  });
}

/**
 * 删除字典项
 *
 * @param dictItem 字典项
 */
function handleDeleteDictItem(dictItem: DictData) {
  asyncRequest(dictDataApiModule.apis.delete, { pathParams: { id: dictItem.id } }).then(() => {
    successMessage('删除成功');
    loadDictData();
  });
}

/**
 * 提交表单
 */
function handleSubmit() {
  formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return;
    }

    const request = isEdit.value
      ? asyncRequest(dictDataApiModule.apis.modify, { data: formData.value })
      : asyncRequest(dictDataApiModule.apis.create, { data: formData.value });

    request.then(() => {
      successMessage(isEdit.value ? '修改成功' : '新增成功');
      dialogVisible.value = false;
      loadDictData();
    });
  });
}
</script>

<template>
  <div class="dict-data-management">
    <ElCard class="dict-data-card">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <ElButton :icon="DArrowLeft" text @click="handleBack" />
          </div>
          <ElButton :icon="Plus" type="primary" @click="handleAddDictItem">
            新增字典项
          </ElButton>
        </div>
      </template>

      <ElTable :data="dictDataList" border>
        <ElTableColumn prop="dictLabel" label="字典标签" />
        <ElTableColumn prop="dictValue" label="字典键值" />
        <ElTableColumn prop="sort" label="排序" width="80" align="center" />
        <ElTableColumn label="是否启用" width="100">
          <template #default="{ row }">
            <ElSwitch v-model="row.enabled" @change="saveDictItem(row)" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="remark" label="备注" />
        <ElTableColumn label="操作" width="150">
          <template #default="{ row }">
            <ElButton
              :icon="Edit"
              type="primary"
              size="small"
              link
              @click="handleEditDictItem(row)"
            >
              修改
            </ElButton>
            <ElPopconfirm v-if="row.deletable" title="确定删除吗？" placement="top" @confirm="handleDeleteDictItem(row)">
              <template #reference>
                <ElButton :icon="Delete" type="danger" link size="small">
                  删除
                </ElButton>
              </template>
            </ElPopconfirm>
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="flex justify-end mt-4">
        <ElPagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="total"
          :page-sizes="[10, 20, 50]"
          :hide-on-single-page="false"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </ElCard>

    <!-- 字典项编辑弹窗 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="formRef?.resetFields()"
    >
      <ElForm
        ref="formRef"
        :model="formData"
        label-width="80px"
        :rules="{
          dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
          dictValue: [{ required: true, message: '请输入字典键值', trigger: 'blur' }],
        }"
      >
        <ElFormItem label="字典标签" prop="dictLabel">
          <ElInput v-model="formData.dictLabel" placeholder="请输入字典标签" />
        </ElFormItem>
        <ElFormItem label="字典键值" prop="dictValue" :disabled="isEdit">
          <ElInput v-model="formData.dictValue" placeholder="请输入字典键值" />
        </ElFormItem>
        <ElFormItem label="字典样式" prop="cssClass">
          <ElInput v-model="formData.cssClass" placeholder="请输入字典样式" />
        </ElFormItem>
        <ElFormItem label="列表样式" prop="listClass">
          <ElInput v-model="formData.listClass" placeholder="请输入列表样式" />
        </ElFormItem>
        <ElFormItem label="排序" prop="sort">
          <ElInputNumber v-model="formData.sort" :min="0" controls-position="right" />
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElButton @click="dialogVisible = false">
          取消
        </ElButton>
        <ElButton type="primary" @click="handleSubmit">
          确定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">

</style>
