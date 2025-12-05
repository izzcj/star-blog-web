<script setup lang="ts">
import { Check, Close, Delete, Refresh, Search } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import type { CommentQueryParams } from './metadata';
import commentApiModule from '@/api/blog/comment';
import { asyncRequest } from '@/utils/request-util';
import { successMessage, warningMessage } from '@/element-plus/notification';
import DataOptionType from '@/enums/data-option-type';

defineOptions({
  name: 'CommentManagementPage',
});

// 查询条件
const queryForm = reactive<CommentQueryParams>({
  status: '',
  createTimeBegin: '',
  createTimeEnd: '',
});

// 时间范围（临时状态，绑定DatePicker）
const timeRange = ref<[string, string] | null>(null);

// 评论列表
const commentList = ref<CommentDetail[]>([]);
const total = ref(0);

// 分页相关
const pagination = reactive({
  page: 1,
  size: 10,
});

// 表格选择状态
const selectedComments = ref<CommentDetail[]>([]);

// 状态标签样式映射
const statusTypeMap: Record<string, 'warning' | 'success' | 'danger'> = {
  PENDING: 'warning',
  PASS: 'success',
  REJECT: 'danger',
};

onMounted(() => {
  loadComments();
});

watch(() => [pagination.page, pagination.size], () => {
  loadComments();
});

watch(timeRange, val => {
  if (val && val.length === 2) {
    queryForm.createTimeBegin = val[0];
    queryForm.createTimeEnd = val[1];
  } else {
    queryForm.createTimeBegin = '';
    queryForm.createTimeEnd = '';
  }
});

/**
 * 加载评论列表
 */
function loadComments() {
  asyncRequest(commentApiModule.apis.fetchPage, {
    params: {
      page: pagination.page,
      size: pagination.size,
      status: queryForm.status || undefined,
      createTimeBegin: queryForm.createTimeBegin || undefined,
      createTimeEnd: queryForm.createTimeEnd || undefined,
    },
  }).then(res => {
    commentList.value = res.data.data;
    total.value = Number(res.data.total);
  });
}

/**
 * 查询
 */
function handleQuery() {
  pagination.page = 1;
  loadComments();
}

/**
 * 重置查询条件
 */
function handleReset() {
  queryForm.status = '';
  queryForm.createTimeBegin = '';
  queryForm.createTimeEnd = '';
  timeRange.value = null;
  handleQuery();
}

/**
 * 表格多选变化
 */
function handleSelectionChange(selection: CommentDetail[]) {
  selectedComments.value = selection;
}

/**
 * 单条审批通过
 */
function handlePass(comment: CommentDetail) {
  handleBatchAudit([comment.id], 'PASS');
}

/**
 * 单条审批驳回
 */
function handleReject(comment: CommentDetail) {
  handleRejectWithReason([comment.id]);
}

/**
 * 批量审批通过
 */
function handleBatchPass() {
  if (selectedComments.value.length === 0) {
    warningMessage('请选择要审批的评论');
    return;
  }
  const ids = selectedComments.value.map(c => c.id);
  handleBatchAudit(ids, 'PASS');
}

/**
 * 批量审批驳回
 */
function handleBatchReject() {
  if (selectedComments.value.length === 0) {
    warningMessage('请选择要审批的评论');
    return;
  }
  const ids = selectedComments.value.map(c => c.id);
  handleRejectWithReason(ids);
}

/**
 * 批量审批（内部方法）
 */
function handleBatchAudit(ids: string[], status: string, rejectReason?: string) {
  asyncRequest(commentApiModule.apis.batchAudit, {
    data: {
      ids,
      status,
      rejectReason,
    },
  }).then(() => {
    successMessage('审批成功');
    selectedComments.value = [];
    loadComments();
  });
}

/**
 * 驳回并填写原因（内部方法）
 */
function handleRejectWithReason(ids: string[]) {
  ElMessageBox.prompt('请输入驳回原因', '驳回评论', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '驳回原因不能为空',
  }).then(({ value }) => {
    handleBatchAudit(ids, 'REJECT', value);
  })
    .catch(() => {
    // 用户取消
    });
}

/**
 * 删除评论
 */
function handleDelete(comment: CommentDetail) {
  asyncRequest(commentApiModule.apis.delete, {
    params: { id: comment.id },
  }).then(() => {
    successMessage('删除成功');
    loadComments();
  });
}

/**
 * 判断当前行是否可以选择
 */
function isRowSelectable(row: CommentDetail): boolean {
  return row.status == 'PEDDING';
}
</script>

<template>
  <div>
    <!-- 查询表单卡片 -->
    <ElCard shadow="never" class="mb-3">
      <ElForm :model="queryForm">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
            <!-- 状态筛选 -->
            <ElFormItem label="状态">
              <VenusSelect
                v-model:value="queryForm.status"
                :option-type="DataOptionType.ENUM"
                option-key="com.ale.starblog.admin.blog.enums.CommentStatus"
                placeholder="请选择状态"
                clearable
              />
            </ElFormItem>

            <!-- 时间范围 -->
            <ElFormItem label="创建时间">
              <ElDatePicker
                v-model="timeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </ElFormItem>
          </div>

          <!-- 查询按钮 -->
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

    <!-- 数据表格卡片 -->
    <ElCard shadow="never">
      <!-- 批量操作按钮 -->
      <div class="mb-4 flex justify-end gap-2">
        <ElButton :icon="Check" type="success" @click="handleBatchPass">
          批量通过
        </ElButton>
        <ElButton :icon="Close" type="warning" @click="handleBatchReject">
          批量驳回
        </ElButton>
      </div>

      <!-- 数据表格 -->
      <ElTable
        :data="commentList"
        border
        @selection-change="handleSelectionChange"
      >
        <!-- 多选列 -->
        <ElTableColumn type="selection" width="55" align="center" :selectable="isRowSelectable" />

        <!-- 评论内容 -->
        <ElTableColumn prop="content" label="评论内容" min-width="200" show-overflow-tooltip />

        <!-- 评论用户头像 -->
        <ElTableColumn prop="userAvatar" label="头像" width="80">
          <template #default="{ row }">
            <VenusAvatar v-model:value="row.userAvatar" :disabled="true" size="auto" />
          </template>
        </ElTableColumn>

        <!-- 评论用户昵称 -->
        <ElTableColumn prop="userName" label="昵称" width="120" />

        <!-- 状态 -->
        <ElTableColumn prop="status" label="状态" width="100">
          <template #default="{ row }">
            <ElTag :type="statusTypeMap[row.status]">
              {{ row.statusName }}
            </ElTag>
          </template>
        </ElTableColumn>

        <!-- 创建时间 -->
        <ElTableColumn prop="createTime" label="创建时间" width="180" />

        <!-- 操作列 -->
        <ElTableColumn label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <!-- 待审核状态显示审批按钮 -->
            <template v-if="row.status === 'PENDING'">
              <ElButton
                :icon="Check"
                type="success"
                link
                size="small"
                @click="handlePass(row)"
              >
                通过
              </ElButton>
              <ElButton
                :icon="Close"
                type="warning"
                link
                size="small"
                @click="handleReject(row)"
              >
                驳回
              </ElButton>
            </template>

            <!-- 删除按钮 -->
            <ElPopconfirm
              title="确定删除吗？"
              placement="top"
              @confirm="handleDelete(row)"
            >
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
  </div>
</template>

<style scoped lang="scss">
</style>
