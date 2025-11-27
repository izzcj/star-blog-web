<script setup lang="ts">
import { ElTree } from 'element-plus';
import type { MenuTree } from '@/views/admin/system/menu/metadata';
import roleApiModule from '@/api/system/role';
import menuApiModule from '@/api/system/menu';
import { asyncRequest } from '@/utils/request-util';
import { successMessage } from '@/element-plus/notification';

interface Props {
  // 当前角色ID
  roleId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  // 权限变更通知
  permissionChanged: [];
}>();

// 当前激活的Tab
const activeTab = ref('menu');

// 菜单树数据
const menuTreeData = ref<MenuTree[]>([]);
const menuTreeRef = ref<InstanceType<typeof ElTree>>();
const checkedMenuIds = ref<string[]>([]);
const loading = ref(false);

// ElTree 配置
const treeProps = {
  children: 'children',
  label: 'name',
};

onMounted(() => {
  loadData();
});

/**
 * 加载数据
 */
async function loadData() {
  loading.value = true;
  try {
    // 并行请求菜单树和角色已分配菜单
    const [menuTreeRes, roleMenusRes] = await Promise.all([
      asyncRequest(menuApiModule.apis.fetchTreeList),
      asyncRequest(roleApiModule.apis.fetchMenuPermissions, {
        pathParams: { id: props.roleId },
      }),
    ]);

    // 设置菜单树数据
    menuTreeData.value = menuTreeRes.data || [];

    // 设置已选中的菜单ID
    checkedMenuIds.value = roleMenusRes.data || [];
  } finally {
    loading.value = false;
  }
}

/**
 * 提交保存
 */
function handleSubmit() {
  if (!menuTreeRef.value) {
    return;
  }

  // 获取选中的节点ID（包括半选中的父节点）
  const checkedKeys = menuTreeRef.value.getCheckedKeys(false) as string[];
  const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys() as string[];
  const allMenuIds = [...checkedKeys, ...halfCheckedKeys];

  loading.value = true;
  asyncRequest(roleApiModule.apis.saveMenuPermissions, {
    pathParams: { id: props.roleId },
    data: allMenuIds,
  })
    .then(() => {
      successMessage('权限设置成功');
      emit('permissionChanged');
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div v-loading="loading" class="role-permission">
    <ElTabs v-model="activeTab">
      <ElTabPane label="菜单权限" name="menu">
        <div class="menu-permission-content">
          <ElTree
            ref="menuTreeRef"
            :data="menuTreeData"
            :props="treeProps"
            :default-checked-keys="checkedMenuIds"
            node-key="id"
            show-checkbox
            :check-strictly="false"
          />
        </div>
      </ElTabPane>
      <ElTabPane label="数据权限" name="data" disabled>
        <div class="data-permission-content">
          <!-- 数据权限暂未实现 -->
        </div>
      </ElTabPane>
    </ElTabs>

    <div class="permission-footer">
      <ElButton type="primary" :loading="loading" @click="handleSubmit">
        确定
      </ElButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.role-permission {
  .menu-permission-content {
    max-height: 500px;
    overflow-y: auto;
    padding: 10px 0;
  }

  .data-permission-content {
    padding: 20px;
    text-align: center;
    color: var(--el-text-color-secondary);
  }

  .permission-footer {
    margin-top: 20px;
    text-align: right;
    padding-top: 20px;
    border-top: 1px solid var(--el-border-color-light);
  }
}
</style>
