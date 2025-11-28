<script setup lang="ts">
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue';
import type { FormRules } from 'element-plus';
import type { Tag, TagQueryParams } from './metadata';
import tagApiModule from '@/api/blog/tag';
import { asyncRequest } from '@/utils/request-util';
import { successMessage } from '@/element-plus/notification';

defineOptions({
  name: 'TagManagementPage',
});

// 查询条件
const queryForm = reactive<TagQueryParams>({
  name: '',
});

// 标签列表
const tagList = ref<Tag[]>([]);
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
const formData = ref<Tag>({
  name: '',
  color: '#409EFF',
  description: '',
} as Tag);

// 表单验证规则
const rules: FormRules<Tag> = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  color: [
    { required: true, message: '请选择标签颜色', trigger: 'change' },
  ],
};

onMounted(() => {
  loadTags();
});

watch(() => [pagination.page, pagination.size], () => {
  loadTags();
});

/**
 * 加载标签列表
 */
function loadTags() {
  asyncRequest(tagApiModule.apis.fetchPage, {
    params: {
      page: pagination.page,
      size: pagination.size,
      name: queryForm.name || undefined,
    },
  }).then(res => {
    tagList.value = res.data.data;
    total.value = Number(res.data.total);
  });
}

/**
 * 查询
 */
function handleQuery() {
  pagination.page = 1;
  loadTags();
}

/**
 * 重置查询条件
 */
function handleReset() {
  queryForm.name = '';
  handleQuery();
}

/**
 * 新增标签
 */
function handleAddTag() {
  dialogTitle.value = '新增标签';
  isEdit.value = false;
  formData.value = {
    name: '',
    color: '#409EFF',
    description: '',
  } as Tag;
  dialogVisible.value = true;
}

/**
 * 修改标签
 */
function handleEditTag(tag: Tag) {
  dialogTitle.value = '修改标签';
  isEdit.value = true;
  formData.value = { ...tag };
  dialogVisible.value = true;
}

/**
 * 删除标签
 */
function handleDeleteTag(tag: Tag) {
  asyncRequest(tagApiModule.apis.delete, { pathParams: { id: tag.id } }).then(() => {
    successMessage('删除成功');
    loadTags();
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
      ? asyncRequest(tagApiModule.apis.modify, { data: formData.value })
      : asyncRequest(tagApiModule.apis.create, { data: formData.value });

    request.then(() => {
      successMessage(isEdit.value ? '修改成功' : '新增成功');
      dialogVisible.value = false;
      loadTags();
    });
  });
}
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-3">
      <!-- 搜索栏 -->
      <ElForm :model="queryForm">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
            <ElFormItem label="标签名称">
              <ElInput
                v-model="queryForm.name"
                placeholder="请输入标签名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </ElFormItem>
          </div>
          <div class="flex items-center gap-2">
            <ElFormItem>
              <ElButton :icon="Search" type="primary" @click="handleQuery">
                查询
              </ElButton>
              <ElButton :icon="Refresh" @click="handleReset">
                重置
              </ElButton>
            </ElFormItem>
          </div>
        </div>
      </ElForm>
    </ElCard>

    <ElCard shadow="never">
      <!-- 操作按钮 -->
      <div class="mb-4 flex justify-end">
        <ElButton :icon="Plus" type="success" @click="handleAddTag">
          新增
        </ElButton>
      </div>

      <!-- 标签列表表格 -->
      <ElTable :data="tagList" border>
        <ElTableColumn prop="name" label="标签名称" />
        <ElTableColumn prop="color" label="标签颜色" width="200">
          <template #default="{ row }">
            <ElTag :color="row.color" effect="dark">
              {{ row.name }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="description" label="描述" show-overflow-tooltip />
        <ElTableColumn prop="createTime" label="创建时间" width="180" />
        <ElTableColumn label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <ElButton
              :icon="Edit"
              type="primary"
              link
              size="small"
              @click="handleEditTag(row)"
            >
              修改
            </ElButton>
            <ElPopconfirm title="确定删除吗？" placement="top" @confirm="handleDeleteTag(row)">
              <template #reference>
                <ElButton
                  :icon="Delete"
                  type="danger"
                  link
                  size="small"
                >
                  删除
                </ElButton>
              </template>
            </ElPopconfirm>
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页组件 -->
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

    <!-- 标签编辑弹窗 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="formRef?.resetFields()"
    >
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="90px"
      >
        <ElFormItem label="标签名称" prop="name">
          <ElInput v-model="formData.name" placeholder="请输入标签名称" />
        </ElFormItem>
        <ElFormItem label="标签颜色" prop="color">
          <ElColorPicker v-model="formData.color" :show-alpha="false" />
        </ElFormItem>
        <ElFormItem label="描述" prop="description">
          <ElInput
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
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
