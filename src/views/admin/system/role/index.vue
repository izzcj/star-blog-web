<script setup lang="ts">
import { Edit, Delete, User, Refresh, Search, Plus, Key } from '@element-plus/icons-vue';
import type { FormRules } from 'element-plus';
import type { Role, RoleQueryParams } from './metadata';
import RoleAuthorization from './components/authorization/index.vue';
import RolePermission from './components/permission/index.vue';
import roleApiModule from '@/api/system/role';
import { asyncRequest } from '@/utils/request-util';
import { successMessage } from '@/element-plus/notification';
import DataOptionType from '@/enum/data-option-type';

defineOptions({
  name: 'RoleManagementPage',
});

// 查询条件
const queryForm = reactive<RoleQueryParams>({
  name: '',
  type: '',
});

// 角色列表
const roleList = ref<Role[]>([]);
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
const formData = ref<Role>({
  name: '',
  type: '',
  sort: 0,
  defaultRole: false,
} as Role);

// 表单验证规则
const rules: FormRules<Role> = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择角色类型', trigger: 'change' },
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
    { type: 'number', message: '排序号必须是数字', trigger: 'blur' },
  ],
};

// 用户授权抽屉相关
const drawerVisible = ref(false);
const currentRole = ref<Role | null>(null);

// 权限设置弹窗相关
const permissionDialogVisible = ref(false);
const currentPermissionRole = ref<Role | null>(null);

onMounted(() => {
  loadRoles();
});

watch(() => [pagination.page, pagination.size], () => {
  loadRoles();
});

/**
 * 加载角色列表
 */
function loadRoles() {
  asyncRequest(roleApiModule.apis.fetchPage, {
    params: {
      page: pagination.page,
      size: pagination.size,
      name: queryForm.name || undefined,
      type: queryForm.type || undefined,
    },
  }).then(res => {
    roleList.value = res.data.data;
    total.value = Number(res.data.total);
  });
}

/**
 * 查询
 */
function handleQuery() {
  pagination.page = 1;
  loadRoles();
}

/**
 * 重置查询条件
 */
function handleReset() {
  queryForm.name = '';
  queryForm.type = '';
  handleQuery();
}

/**
 * 新增角色
 */
function handleAddRole() {
  dialogTitle.value = '新增角色';
  isEdit.value = false;
  formData.value = {
    name: '',
    type: '',
    sort: 0,
    defaultRole: false,
  } as Role;
  dialogVisible.value = true;
}

/**
 * 修改角色
 */
function handleEditRole(role: Role) {
  dialogTitle.value = '修改角色';
  isEdit.value = true;
  formData.value = { ...role };
  dialogVisible.value = true;
}

/**
 * 删除角色
 */
function handleDeleteRole(role: Role) {
  asyncRequest(roleApiModule.apis.delete, { pathParams: { id: role.id } }).then(() => {
    successMessage('删除成功');
    loadRoles();
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
      ? asyncRequest(roleApiModule.apis.modify, { data: formData.value })
      : asyncRequest(roleApiModule.apis.create, { data: formData.value });

    request.then(() => {
      successMessage(isEdit.value ? '修改成功' : '新增成功');
      dialogVisible.value = false;
      loadRoles();
    });
  });
}

/**
 * 打开用户授权抽屉
 */
function handleAuthorize(role: Role) {
  currentRole.value = role;
  drawerVisible.value = true;
}

/**
 * 授权变更处理
 */
function handleAuthorizationChanged() {
  loadRoles();
}

/**
 * 打开权限设置弹窗
 */
function handleSetPermission(role: Role) {
  currentPermissionRole.value = role;
  permissionDialogVisible.value = true;
}

/**
 * 权限变更处理
 */
function handlePermissionChanged() {
  permissionDialogVisible.value = false;
}
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-3">
      <!-- 搜搜栏 -->
      <ElForm :model="queryForm">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
            <ElFormItem label="角色名称">
              <ElInput
                v-model="queryForm.name"
                placeholder="请输入角色名称"
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
        <ElButton :icon="Plus" type="success" @click="handleAddRole">
          新增
        </ElButton>
      </div>

      <!-- 角色列表表格 -->
      <ElTable :data="roleList" border>
        <ElTableColumn prop="sort" label="排序" width="80" align="center" />
        <ElTableColumn prop="name" label="角色名称" />
        <ElTableColumn prop="typeName" label="角色类型" />
        <ElTableColumn prop="defaultRole" label="默认角色" width="100" align="center">
          <template #default="{ row }">
            <ElTag :type="row.defaultRole ? 'success' : 'info'">
              {{ row.defaultRole ? '是' : '否' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="remark" label="备注" show-overflow-tooltip />
        <ElTableColumn prop="createTime" label="创建时间" width="180" />
        <ElTableColumn label="操作" width="300" align="center" fixed="right">
          <template #default="{ row }">
            <ElButton
              :icon="User"
              type="primary"
              link
              size="small"
              :disabled="row.id === '1'"
              @click="handleAuthorize(row)"
            >
              授权用户
            </ElButton>
            <ElButton
              :icon="Key"
              type="warning"
              link
              size="small"
              :disabled="row.id === '1'"
              @click="handleSetPermission(row)"
            >
              设置权限
            </ElButton>
            <ElButton
              :icon="Edit"
              type="primary"
              link
              size="small"
              :disabled="row.defaultRole"
              @click="handleEditRole(row)"
            >
              修改
            </ElButton>
            <ElPopconfirm title="确定删除吗？" placement="top" @confirm="handleDeleteRole(row)">
              <template #reference>
                <ElButton
                  :icon="Delete"
                  type="danger"
                  link
                  size="small"
                  :disabled="row.defaultRole"
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

    <!-- 角色编辑弹窗 -->
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
        <ElFormItem label="角色名称" prop="name">
          <ElInput v-model="formData.name" placeholder="请输入角色名称" />
        </ElFormItem>
        <ElFormItem label="角色类型" prop="type">
          <VenusSelect
            v-model:value="formData.type"
            :option-type="DataOptionType.ENUM"
            option-key="com.ale.starblog.admin.system.enums.RoleType"
            placeholder="请选择角色类型"
          />
        </ElFormItem>
        <ElFormItem label="排序" prop="sort">
          <ElInputNumber v-model="formData.sort" :min="0" controls-position="right" />
        </ElFormItem>
        <ElFormItem label="默认角色" prop="defaultRole">
          <ElSwitch v-model="formData.defaultRole" />
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

    <!-- 用户授权抽屉 -->
    <ElDrawer
      v-model="drawerVisible"
      :title="`用户授权 - ${currentRole?.name}`"
      size="60%"
      direction="rtl"
    >
      <RoleAuthorization
        v-if="currentRole"
        :role-id="currentRole.id!"
        :role-name="currentRole.name"
        @authorization-changed="handleAuthorizationChanged"
      />
    </ElDrawer>

    <!-- 权限设置弹窗 -->
    <ElDialog
      v-model="permissionDialogVisible"
      :title="`权限设置 - ${currentPermissionRole?.name}`"
      width="700px"
    >
      <RolePermission
        v-if="currentPermissionRole"
        :role-id="currentPermissionRole.id!"
        @permission-changed="handlePermissionChanged"
      />
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
</style>
