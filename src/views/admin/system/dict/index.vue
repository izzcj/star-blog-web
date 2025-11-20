<script setup lang="ts">
import { Delete, Edit, Plus, Refresh } from '@element-plus/icons-vue';
import type { DictType } from './metadata';
import dictTypeApiModule from '@/api/system/dict-type';
import { asyncRequest } from '@/utils/request-util';
import { successMessage } from '@/element-plus/notification';

defineOptions({
  name: 'DictManagementPage',
});

const router = useRouter();

const dictList = ref<DictType[]>([]);
const total = ref(0);
// 分页相关
const pagination = reactive({
  page: 1,
  size: 10,
});

// 弹窗相关
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const formRef = ref();
const formData = ref<DictType>({
  dictName: '',
  dictKey: '',
  sort: 0,
} as DictType);

onMounted(() => {
  loadDictTypes();
});

watch(() => [pagination.page, pagination.size], () => {
  loadDictTypes();
});

/**
 * 加载字典数据
 */
function loadDictTypes() {
  asyncRequest(dictTypeApiModule.apis.fetchPage, {
    params: {
      page: pagination.page,
      size: pagination.size,
    },
  }).then(res => {
    dictList.value = res.data.data;
    total.value = Number(res.data.total);
  });
}

/**
 * 刷新缓存
 */
function handleRefreshCache() {
  asyncRequest(dictTypeApiModule.apis.refreshCache).then(() => {
    successMessage('刷新成功');
    loadDictTypes();
  });
}

/**
 * 新增字典
 */
function handleAddDict() {
  dialogTitle.value = '新增字典';
  isEdit.value = false;
  formData.value = {
    dictName: '',
    dictKey: '',
    sort: 0,
  } as DictType;
  dialogVisible.value = true;
}

/**
 * 修改字典
 */
function handleEditDict(dict: DictType) {
  dialogTitle.value = '修改字典';
  isEdit.value = true;
  formData.value = { ...dict };
  dialogVisible.value = true;
}

/**
 * 删除字典
 */
function handleDeleteDict(dict: DictType) {
  asyncRequest(dictTypeApiModule.apis.delete, { pathParams: { id: dict.id } }).then(() => {
    successMessage('删除成功');
    loadDictTypes();
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
      ? asyncRequest(dictTypeApiModule.apis.modify, { data: formData.value })
      : asyncRequest(dictTypeApiModule.apis.create, { data: formData.value });

    request.then(() => {
      successMessage(isEdit.value ? '修改成功' : '新增成功');
      dialogVisible.value = false;
      loadDictTypes();
    });
  });
}

/**
 * 点击字典key
 *
 * @param dict 字典
 */
function handleDictKeyClick(dict: DictType) {
  router.push({
    name: 'DictData',
    params: {
      dictKey: dict.dictKey,
    },
  });
}
</script>

<template>
  <div class="dict-management">
    <ElCard class="dict-card">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">字典管理</span>
          <div class="flex gap-2">
            <ElButton :icon="Refresh" type="primary" @click="handleRefreshCache">
              刷新缓存
            </ElButton>
            <ElButton :icon="Plus" type="primary" @click="handleAddDict">
              新增字典
            </ElButton>
          </div>
        </div>
      </template>

      <ElTable :data="dictList" border>
        <ElTableColumn prop="sort" label="排序" width="80" align="center" />
        <ElTableColumn prop="dictName" label="字典名称" />
        <ElTableColumn prop="dictKey" label="字典key">
          <template #default="{ row }">
            <ElLink type="primary" @click="handleDictKeyClick(row)">
              {{ row.dictKey }}
            </ElLink>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="remark" label="备注" />
        <ElTableColumn prop="createTime" label="创建时间" width="180" />
        <ElTableColumn label="操作" width="150">
          <template #default="{ row }">
            <ElButton
              :icon="Edit"
              type="primary"
              size="small"
              link
              @click="handleEditDict(row)"
            >
              修改
            </ElButton>
            <ElPopconfirm title="确定删除吗？" placement="top" @confirm="handleDeleteDict(row)">
              <template #reference>
                <ElButton :icon="Delete" type="danger" size="small" link>
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

    <!-- 字典编辑弹窗 -->
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
          dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
          dictKey: [{ required: true, message: '请输入字典key', trigger: 'blur' }],
        }"
      >
        <ElFormItem label="字典名称" prop="dictName">
          <ElInput v-model="formData.dictName" placeholder="请输入字典名称" />
        </ElFormItem>
        <ElFormItem label="字典key" prop="dictKey">
          <ElInput v-model="formData.dictKey" :disabled="isEdit" placeholder="请输入字典key" />
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
