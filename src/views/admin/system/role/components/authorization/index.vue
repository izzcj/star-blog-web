<script setup lang="ts">
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue';
import userApiModule from '@/api/system/user';
import { asyncRequest } from '@/utils/request-util';
import { successMessage } from '@/element-plus/notification';

interface Props {
  // 当前角色ID
  roleId: string;
  // 角色名称
  roleName: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  // 授权变更通知
  authorizationChanged: [];
}>();

// 已授权用户相关
const authorizedQueryForm = reactive({
  nickname: '',
});
const authorizedUsers = ref<User[]>([]);
const authorizedTotal = ref(0);
const authorizedPagination = reactive({
  page: 1,
  size: 10,
});
const selectedAuthorizedUserIds = ref<number[]>([]);

// 未授权用户相关
const selectUserDialogVisible = ref(false);
const unauthorizedQueryForm = reactive({
  nickname: '',
});
const unauthorizedUsers = ref<User[]>([]);
const unauthorizedTotal = ref(0);
const unauthorizedPagination = reactive({
  page: 1,
  size: 10,
});
const selectedUnauthorizedUserIds = ref<number[]>([]);

// 监听角色ID变化，重新加载数据
watch(() => props.roleId, () => {
  loadAuthorizedUsers();
}, { immediate: true });

// 监听已授权用户分页变化
watch(() => [authorizedPagination.page, authorizedPagination.size], () => {
  loadAuthorizedUsers();
});

// 监听未授权用户分页变化
watch(() => [unauthorizedPagination.page, unauthorizedPagination.size], () => {
  loadUnauthorizedUsers();
});

/**
 * 加载已授权用户列表
 */
function loadAuthorizedUsers() {
  asyncRequest<PageData<User>>(userApiModule.apis.fetchAllocatedPage, {
    pathParams: { roleId: props.roleId },
    params: {
      page: authorizedPagination.page,
      size: authorizedPagination.size,
      nickname: authorizedQueryForm.nickname || undefined,
    },
  }).then(res => {
    authorizedUsers.value = res.data.data;
    authorizedTotal.value = Number(res.data.total);
  });
}

/**
 * 查询已授权用户
 */
function handleAuthorizedQuery() {
  authorizedPagination.page = 1;
  loadAuthorizedUsers();
}

/**
 * 重置已授权用户查询条件
 */
function handleAuthorizedReset() {
  authorizedQueryForm.nickname = '';
  handleAuthorizedQuery();
}

/**
 * 已授权用户选择变化
 */
function handleAuthorizedSelectionChange(rows: any[]) {
  selectedAuthorizedUserIds.value = rows.map(row => row.id);
}

/**
 * 单个移除授权
 */
function handleRemoveOne(user: any) {
  asyncRequest(userApiModule.apis.cancelAuthorization, {
    data: {
      roleId: props.roleId,
      userIds: [user.id],
    },
  }).then(() => {
    successMessage('取消授权成功');
    loadAuthorizedUsers();
    emit('authorizationChanged');
  });
}

/**
 * 批量移除授权
 */
function handleBatchRemove() {
  if (selectedAuthorizedUserIds.value.length === 0) {
    return;
  }

  asyncRequest(userApiModule.apis.cancelAuthorization, {
    data: {
      roleId: props.roleId,
      userIds: selectedAuthorizedUserIds.value,
    },
  }).then(() => {
    successMessage('移除成功');
    selectedAuthorizedUserIds.value = [];
    loadAuthorizedUsers();
    emit('authorizationChanged');
  });
}

/**
 * 打开选择用户弹框
 */
function handleOpenSelectUser() {
  unauthorizedPagination.page = 1;
  unauthorizedPagination.size = 10;
  unauthorizedQueryForm.nickname = '';
  selectedUnauthorizedUserIds.value = [];
  loadUnauthorizedUsers();
  selectUserDialogVisible.value = true;
}

/**
 * 加载未授权用户列表
 */
function loadUnauthorizedUsers() {
  asyncRequest<PageData<User>>(userApiModule.apis.fetchUnallocatedPage, {
    pathParams: { roleId: props.roleId },
    params: {
      page: unauthorizedPagination.page,
      size: unauthorizedPagination.size,
      nickname: unauthorizedQueryForm.nickname || undefined,
    },
  }).then(res => {
    unauthorizedUsers.value = res.data.data;
    unauthorizedTotal.value = Number(res.data.total);
  });
}

/**
 * 查询未授权用户
 */
function handleUnauthorizedQuery() {
  unauthorizedPagination.page = 1;
  loadUnauthorizedUsers();
}

/**
 * 重置未授权用户查询条件
 */
function handleUnauthorizedReset() {
  unauthorizedQueryForm.nickname = '';
  handleUnauthorizedQuery();
}

/**
 * 未授权用户选择变化
 */
function handleUnauthorizedSelectionChange(rows: any[]) {
  selectedUnauthorizedUserIds.value = rows.map(row => row.id);
}

/**
 * 批量授权用户
 */
function handleBatchAuthorize() {
  if (selectedUnauthorizedUserIds.value.length === 0) {
    return;
  }

  asyncRequest(userApiModule.apis.authorization, {
    data: {
      roleId: props.roleId,
      userIds: selectedUnauthorizedUserIds.value,
    },
  }).then(() => {
    successMessage('授权成功');
    selectUserDialogVisible.value = false;
    selectedUnauthorizedUserIds.value = [];
    loadAuthorizedUsers();
    emit('authorizationChanged');
  });
}
</script>

<template>
  <div class="role-user-authorization">
    <!-- 查询区域 -->
    <ElForm :model="authorizedQueryForm" inline class="mb-4">
      <ElFormItem label="用户名称">
        <ElInput
          v-model="authorizedQueryForm.nickname"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter="handleAuthorizedQuery"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton :icon="Search" type="primary" @click="handleAuthorizedQuery">
          查询
        </ElButton>
        <ElButton :icon="Refresh" @click="handleAuthorizedReset">
          重置
        </ElButton>
      </ElFormItem>
    </ElForm>

    <!-- 操作按钮区域 -->
    <div class="mb-4 flex gap-2">
      <ElButton :icon="Plus" type="primary" @click="handleOpenSelectUser">
        新增授权
      </ElButton>
      <ElPopconfirm title="确定移除吗？" placement="top" @confirm="handleBatchRemove">
        <template #reference>
          <ElButton :icon="Delete" type="danger" :disabled="selectedAuthorizedUserIds.length === 0">
            批量移除({{ selectedAuthorizedUserIds.length }})
          </ElButton>
        </template>
      </ElPopconfirm>
    </div>

    <!-- 已授权用户列表 -->
    <ElTable
      :data="authorizedUsers"
      border
      max-height="500px"
      @selection-change="handleAuthorizedSelectionChange"
    >
      <ElTableColumn type="selection" width="55" />
      <ElTableColumn prop="account" label="账号" />
      <ElTableColumn prop="nickname" label="昵称" />
      <ElTableColumn prop="email" label="邮箱" show-overflow-tooltip />
      <ElTableColumn prop="createTime" label="创建时间" width="180" />
      <ElTableColumn label="操作" width="120" align="center">
        <template #default="{ row }">
          <ElPopconfirm title="确定移除吗？" placement="top" @confirm="handleRemoveOne(row)">
            <template #reference>
              <ElButton :icon="Delete" type="danger" link size="small">
                移除
              </ElButton>
            </template>
          </ElPopconfirm>
        </template>
      </ElTableColumn>
    </ElTable>

    <!-- 分页组件 -->
    <div class="flex justify-end mt-4">
      <ElPagination
        v-model:current-page="authorizedPagination.page"
        v-model:page-size="authorizedPagination.size"
        :total="authorizedTotal"
        :page-sizes="[10, 20, 50]"
        :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>

    <!-- 选择用户弹框 -->
    <ElDialog
      v-model="selectUserDialogVisible"
      title="选择用户"
      width="900px"
      append-to-body
    >
      <!-- 查询区域 -->
      <ElForm :model="unauthorizedQueryForm" inline class="mb-4">
        <ElFormItem label="用户名称">
          <ElInput
            v-model="unauthorizedQueryForm.nickname"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter="handleUnauthorizedQuery"
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton :icon="Search" type="primary" @click="handleUnauthorizedQuery">
            查询
          </ElButton>
          <ElButton :icon="Refresh" @click="handleUnauthorizedReset">
            重置
          </ElButton>
        </ElFormItem>
      </ElForm>

      <!-- 未授权用户列表 -->
      <ElTable
        :data="unauthorizedUsers"
        border
        @selection-change="handleUnauthorizedSelectionChange"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn prop="account" label="账号" />
        <ElTableColumn prop="nickname" label="昵称" />
        <ElTableColumn prop="email" label="邮箱" show-overflow-tooltip />
        <ElTableColumn prop="createTime" label="创建时间" width="180" />
      </ElTable>

      <!-- 分页组件 -->
      <div class="flex justify-end mt-4">
        <ElPagination
          v-model:current-page="unauthorizedPagination.page"
          v-model:page-size="unauthorizedPagination.size"
          :total="unauthorizedTotal"
          :page-sizes="[10, 20, 50]"
          :hide-on-single-page="false"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>

      <template #footer>
        <ElButton @click="selectUserDialogVisible = false">
          取消
        </ElButton>
        <ElButton
          type="primary"
          :disabled="selectedUnauthorizedUserIds.length === 0"
          @click="handleBatchAuthorize"
        >
          确定授权({{ selectedUnauthorizedUserIds.length }})
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.role-user-authorization {
  padding: 0 20px;
}
</style>
