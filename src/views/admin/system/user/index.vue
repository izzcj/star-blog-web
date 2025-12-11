<script setup lang="ts">
import { Delete, Edit, Key, Plus, Refresh, Search } from '@element-plus/icons-vue';
import type { FormRules } from 'element-plus';
import type { UserQueryParams } from './metadata';
import userApiModule from '@/api/system/user';
import roleApiModule from '@/api/system/role';
import { asyncRequest } from '@/utils/request-util';
import { successMessage } from '@/element-plus/notification';
import DataOptionType from '@/enums/data-option-type';
import { useUploadInfoStore } from '@/stores/upload-info-state';

defineOptions({
  name: 'UserManagementPage',
});

// 查询条件
const queryForm = reactive<UserQueryParams>({
  account: '',
  nickname: '',
  mobile: '',
  sex: '',
});

// 用户列表
const userList = ref<User[]>([]);
const total = ref(0);
const loading = ref(false);

// 分页相关
const pagination = reactive({
  page: 1,
  size: 10,
});

// 角色选项
const roleOptions = ref<DataOption[]>([]);

// 上传信息 Store
const uploadInfoStore = useUploadInfoStore();

// 新增/编辑弹窗
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const formRef = ref();
const formData = ref<User>({
  id: '',
  account: '',
  nickname: '',
  sex: '',
  avatar: '',
  mobile: '',
  email: '',
  sort: 0,
  roleIds: [],
  password: '',
  confirmPassword: '',
  remark: '',
} as User);

// 记录初始头像值，用于判断是否需要清理
const initialAvatar = ref<string>('');

// 表单验证规则
const rules = computed<FormRules<User>>(() => ({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^\w+$/, message: '仅支持字母、数字和下划线', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' },
  ],
  mobile: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
  ],
}));

onMounted(() => {
  loadUsers();
  loadRoleOptions();
});

/**
 * 加载用户列表
 */
function loadUsers() {
  loading.value = true;
  asyncRequest<PageData<User>>(userApiModule.apis.fetchPage, {
    params: {
      page: pagination.page,
      size: pagination.size,
      account: queryForm.account || undefined,
      nickname: queryForm.nickname || undefined,
      mobile: queryForm.mobile || undefined,
      sex: queryForm.sex || undefined,
    },
  })
    .then(res => {
      userList.value = res.data.data;
      total.value = Number(res.data.total);
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 加载角色选项
 */
function loadRoleOptions() {
  asyncRequest<DataOption[]>(roleApiModule.apis.fetchOptions).then(res => {
    roleOptions.value = res.data;
  });
}

/**
 * 查询
 */
function handleQuery() {
  loadUsers();
}

/**
 * 重置查询条件
 */
function handleReset() {
  queryForm.account = '';
  queryForm.nickname = '';
  queryForm.mobile = '';
  queryForm.sex = '';
  handleQuery();
}

/**
 * 新增用户
 */
function handleAddUser() {
  dialogTitle.value = '新增用户';
  isEdit.value = false;
  formData.value = {
    id: '',
    account: '',
    nickname: '',
    sex: '',
    avatar: '',
    mobile: '',
    email: '',
    sort: 0,
    roleIds: [],
    password: '',
    confirmPassword: '',
    remark: '',
  } as User;
  initialAvatar.value = '';
  dialogVisible.value = true;
}

/**
 * 修改用户
 */
function handleEditUser(user: User) {
  dialogTitle.value = '修改用户';
  isEdit.value = true;
  formData.value = { ...user };
  initialAvatar.value = user.avatar || '';
  dialogVisible.value = true;
}

/**
 * 删除用户
 */
function handleDeleteUser(user: User) {
  asyncRequest(userApiModule.apis.delete, { pathParams: { id: user.id } }).then(() => {
    successMessage('删除成功');
    loadUsers();
  });
}

/**
 * 重置密码
 */
function handleResetPassword(user: User) {
  asyncRequest(userApiModule.apis.resetPassword, { pathParams: { id: user.id } }).then(() => {
    successMessage('重置密码成功');
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
      ? asyncRequest(userApiModule.apis.modify, { data: formData.value })
      : asyncRequest(userApiModule.apis.create, { data: formData.value });

    request.then(() => {
      successMessage(isEdit.value ? '修改成功' : '新增成功');
      dialogVisible.value = false;
      loadUsers();
    });
  });
}

/**
 * 处理头像取消操作
 * 当对话框关闭且头像有变更时清理临时文件
 */
async function handleAvatarCancel() {
  if (!formData.value.avatar || formData.value.avatar === initialAvatar.value) {
    return;
  }

  try {
    await uploadInfoStore.removeTempObject('minio', formData.value.avatar);
    formData.value.avatar = initialAvatar.value;
  } catch (error) {
    console.error('清理临时头像失败:', error);
  }
}

/**
 * 处理对话框关闭
 */
function handleDialogClose() {
  handleAvatarCancel();
  formRef.value?.resetFields();
}
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-3">
      <!-- 搜索栏 -->
      <ElForm :model="queryForm">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
            <ElFormItem label="账号">
              <ElInput
                v-model="queryForm.account"
                placeholder="请输入账号"
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
        <ElButton :icon="Plus" type="success" @click="handleAddUser">
          新增
        </ElButton>
      </div>

      <!-- 用户列表表格 -->
      <ElTable v-loading="loading" :data="userList" border>
        <ElTableColumn prop="sort" label="排序" width="80" align="center" />
        <ElTableColumn prop="avatar" label="头像" width="80" align="center">
          <template #default="{ row }">
            <VenusAvatar v-model:value="row.avatar" :disabled="true" size="auto" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="account" label="账号" />
        <ElTableColumn prop="nickname" label="昵称" />
        <ElTableColumn prop="sexName" label="性别" width="80" align="center" />
        <ElTableColumn prop="mobile" label="手机号" />
        <ElTableColumn prop="email" label="邮箱" show-overflow-tooltip />
        <ElTableColumn prop="createTime" label="创建时间" width="180" />
        <ElTableColumn label="操作" width="300" align="center" fixed="right">
          <template #default="{ row }">
            <ElButton
              :icon="Edit"
              type="primary"
              link
              size="small"
              @click="handleEditUser(row)"
            >
              修改
            </ElButton>
            <ElPopconfirm title="确定重置密码吗？" placement="top" @confirm="handleResetPassword(row)">
              <template #reference>
                <ElButton
                  :icon="Key"
                  type="warning"
                  link
                  size="small"
                >
                  重置密码
                </ElButton>
              </template>
            </ElPopconfirm>
            <ElPopconfirm title="确定删除吗？" placement="top" @confirm="handleDeleteUser(row)">
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
          @current-change="loadUsers"
          @size-change="loadUsers"
        />
      </div>
    </ElCard>

    <!-- 用户编辑弹窗 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="90px"
      >
        <ElFormItem label="头像" prop="avatar">
          <VenusAvatar
            v-model:value="formData.avatar"
            size="default"
            name="默认"
            :on-cancel="handleAvatarCancel"
          />
        </ElFormItem>
        <ElFormItem label="账号" prop="account">
          <ElInput
            v-model="formData.account"
            placeholder="请输入账号"
            :disabled="isEdit"
          />
        </ElFormItem>
        <ElFormItem label="昵称" prop="nickname">
          <ElInput v-model="formData.nickname" placeholder="请输入昵称" />
        </ElFormItem>
        <ElFormItem label="性别" prop="sex">
          <VenusSelect
            v-model:value="formData.sex"
            :option-type="DataOptionType.DICT"
            option-key="sex"
            placeholder="请选择性别"
          />
        </ElFormItem>
        <ElFormItem label="手机号" prop="mobile">
          <ElInput v-model="formData.mobile" placeholder="请输入手机号" />
        </ElFormItem>
        <ElFormItem label="邮箱" prop="email">
          <ElInput v-model="formData.email" placeholder="请输入邮箱" />
        </ElFormItem>
        <ElFormItem label="角色" prop="roleIds">
          <VenusSelect
            v-model:value="formData.roleIds"
            :option-type="DataOptionType.CONST"
            :option-key="roleOptions"
            placeholder="请选择角色"
            multiple
            collapse-tags
            collapse-tags-tooltip
          />
        </ElFormItem>
        <ElFormItem label="排序" prop="sort">
          <ElInputNumber v-model="formData.sort" :min="0" controls-position="right" />
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
  </div>
</template>

<style scoped lang="scss">
</style>
