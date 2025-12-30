<script setup lang="ts">
import { Delete, Edit, Plus, Refresh, Search, View } from '@element-plus/icons-vue';
import type { FormRules } from 'element-plus';
import type { Notice, NoticeQueryParams } from './metadata';
import noticeApiModule from '@/api/system/notice';
import { asyncRequest } from '@/utils/request-util';
import { successMessage } from '@/element-plus/notification';
import DataOptionType from '@/enums/data-option-type';

defineOptions({
  name: 'NoticeManagementPage',
});

// 查询条件
const queryParams = reactive<NoticeQueryParams>({
  type: '',
  title: '',
  published: undefined,
});

// 通知列表
const noticeList = ref<Notice[]>([]);
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
const formData = ref<Notice>({
  type: '',
  title: '',
  content: '',
  published: false,
  publishedTime: '',
} as Notice);

// 预览相关
const previewDialogVisible = ref(false);
const previewData = ref<Notice | null>(null);

// 表单验证规则
const rules: FormRules<Notice> = {
  type: [
    { required: true, message: '请选择通知分类', trigger: 'change' },
  ],
  title: [
    { required: true, message: '请输入通知标题', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入通知内容', trigger: 'blur' },
  ],
};

const loading = ref(false);

onMounted(() => {
  loadNotices();
});

watch(() => [pagination.page, pagination.size], () => {
  loadNotices();
});

/**
 * 加载通知列表
 */
function loadNotices() {
  loading.value = true;
  asyncRequest<PageData<Notice>>(noticeApiModule.apis.fetchPage, {
    params: {
      type: queryParams.type || undefined,
      title: queryParams.title || undefined,
      published: queryParams.published,
      page: pagination.page,
      size: pagination.size,
    },
  })
    .then(res => {
      noticeList.value = res.data.data;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 查询
 */
function handleQuery() {
  pagination.page = 1;
  loadNotices();
}

/**
 * 重置查询条件
 */
function handleReset() {
  queryParams.type = '';
  queryParams.title = '';
  queryParams.published = undefined;
  handleQuery();
}

/**
 * 新增通知
 */
function handleAdd() {
  dialogTitle.value = '新增通知';
  isEdit.value = false;
  formData.value = {
    type: '',
    title: '',
    content: '',
    published: false,
    publishedTime: '',
  } as Notice;
  dialogVisible.value = true;
}

/**
 * 修改通知
 */
function handleEdit(notice: Notice) {
  dialogTitle.value = '修改通知';
  isEdit.value = true;
  formData.value = { ...notice };
  dialogVisible.value = true;
}

/**
 * 删除通知
 */
function handleDelete(notice: Notice) {
  asyncRequest(noticeApiModule.apis.delete, { pathParams: { id: notice.id } }).then(() => {
    successMessage('删除成功');
    loadNotices();
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
      ? asyncRequest(noticeApiModule.apis.modify, { data: formData.value })
      : asyncRequest(noticeApiModule.apis.create, { data: formData.value });

    request.then(() => {
      successMessage(isEdit.value ? '修改成功' : '新增成功');
      dialogVisible.value = false;
      loadNotices();
    });
  });
}

/**
 * 切换发布状态
 */
function handleTogglePublish(notice: Notice) {
  const newStatus = !notice.published;
  asyncRequest(noticeApiModule.apis.togglePublished, { pathParams: { id: notice.id } }).then(() => {
    successMessage(newStatus ? '发布成功' : '取消发布成功');
    loadNotices();
  });
}

/**
 * 预览通知
 */
function handlePreview(notice: Notice) {
  previewData.value = notice;
  previewDialogVisible.value = true;
}
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-3">
      <!-- 查询表单 -->
      <ElForm :model="queryParams">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
            <ElFormItem label="通知分类">
              <VenusSelect
                v-model:value="queryParams.type"
                :option-type="DataOptionType.DICT"
                option-key="notice-type"
                placeholder="请选择通知分类"
              />
            </ElFormItem>
            <ElFormItem label="通知标题">
              <ElInput
                v-model="queryParams.title"
                placeholder="请输入通知标题"
                clearable
                @keyup.enter="handleQuery"
              />
            </ElFormItem>
            <ElFormItem label="发布状态">
              <ElSelect
                v-model="queryParams.published"
                placeholder="请选择发布状态"
                clearable
              >
                <ElOption label="已发布" :value="true" />
                <ElOption label="未发布" :value="false" />
              </ElSelect>
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
        <ElButton :icon="Plus" type="success" @click="handleAdd">
          新增
        </ElButton>
      </div>

      <!-- 通知列表表格 -->
      <ElTable v-loading="loading" :data="noticeList" border max-height="600px">
        <ElTableColumn prop="title" label="通知标题" min-width="200" show-overflow-tooltip />
        <ElTableColumn prop="type" label="通知分类" width="120" />
        <ElTableColumn prop="published" label="发布状态" width="100" align="center">
          <template #default="{ row }">
            <ElTag :type="row.published ? 'success' : 'info'">
              {{ row.published ? '已发布' : '未发布' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="publishedTime" label="发布时间" width="180" />
        <ElTableColumn prop="createTime" label="创建时间" width="180" />
        <ElTableColumn label="操作" width="280" align="center" fixed="right">
          <template #default="{ row }">
            <ElButton
              :icon="View"
              type="info"
              link
              size="small"
              @click="handlePreview(row)"
            >
              预览
            </ElButton>
            <ElButton
              :icon="Edit"
              type="primary"
              link
              size="small"
              @click="handleEdit(row)"
            >
              修改
            </ElButton>
            <ElButton
              type="warning"
              link
              size="small"
              @click="handleTogglePublish(row)"
            >
              {{ row.published ? '取消发布' : '发布' }}
            </ElButton>
            <ElPopconfirm title="确定删除吗？" placement="top" @confirm="handleDelete(row)">
              <template #reference>
                <ElButton :icon="Delete" type="danger" link size="small">
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

    <!-- 通知编辑弹窗 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      @close="formRef?.resetFields()"
    >
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="90px"
      >
        <ElFormItem label="通知标题" prop="title">
          <ElInput v-model="formData.title" placeholder="请输入通知标题" />
        </ElFormItem>
        <ElFormItem label="通知分类" prop="type">
          <VenusSelect
            v-model:value="formData.type"
            :option-type="DataOptionType.DICT"
            option-key="notice-type"
            placeholder="请选择通知分类"
          />
        </ElFormItem>
        <ElFormItem label="通知内容" prop="content">
          <VenusVdMdEditor v-model:value="formData.content" :height="500" />
        </ElFormItem>
        <ElFormItem label="是否发布" prop="published">
          <ElSwitch v-model="formData.published" />
        </ElFormItem>
        <ElFormItem label="备注" prop="remark">
          <ElInput
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
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

    <!-- 预览弹窗 -->
    <ElDialog
      v-model="previewDialogVisible"
      width="800px"
      :title="previewData?.title || ''"
    >
      <VenusVdMdEditor v-if="previewData" v-model:value="previewData.content" :height="500" :preview="true" />
      <template #footer>
        <ElButton @click="previewDialogVisible = false">
          关闭
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
</style>
