<script setup lang="ts">
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue';
import type { MenuTree, MenuQueryParams } from './metadata';
import MenuEditor from './components/edtior/index.vue';
import menuApiModule from '@/api/system/menu';
import { asyncRequest } from '@/utils/request-util';
import { successMessage } from '@/element-plus/notification';

// 加载状态
const loading = ref(false);

// 菜单树数据
const menuTreeData = ref<MenuTree[]>([]);

// 查询参数
const queryParams = reactive<MenuQueryParams>({
  name: '',
});

// 对话框控制
const dialogVisible = ref(false);
const dialogTitle = ref('新增菜单');
const isEdit = ref(false);

// 表单引用
const menuFormRef = ref<InstanceType<typeof MenuEditor>>();

// 初始表单数据
const initialFormData: Menu = {
  id: '',
  parentId: '0',
  name: '',
  component: '',
  uri: '',
  redirectUri: '',
  icon: '',
  topLevel: false,
  keepAlive: true,
  hidden: false,
  enabled: true,
  common: true,
  sort: 0,
  remark: '',
};

// 表单数据
const formData = ref<Menu>({ ...initialFormData });

// 过滤后的菜单树
const filteredMenuTree = computed(() => {
  if (!queryParams.name) {
    return menuTreeData.value;
  }

  // 递归过滤菜单树
  function filterTree(menus: MenuTree[]): MenuTree[] {
    return menus
      .map(menu => {
        const matchName = !queryParams.name || menu.name.includes(queryParams.name);

        if (matchName) {
          return {
            ...menu,
            children: menu.children ? filterTree(menu.children) : [],
          };
        }

        // 如果当前节点不匹配，但子节点有匹配的，也要保留当前节点
        if (menu.children) {
          const filteredChildren = filterTree(menu.children);
          if (filteredChildren.length > 0) {
            return {
              ...menu,
              children: filteredChildren,
            };
          }
        }

        return null;
      })
      .filter(Boolean) as Menu[];
  }

  return filterTree(menuTreeData.value);
});

/**
 * 加载菜单树
 */
async function loadMenuTree() {
  loading.value = true;
  asyncRequest<Menu[]>(menuApiModule.apis.fetchTreeList)
    .then(res => {
      menuTreeData.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 查询菜单
 */
function handleQuery() {
  // 树形结构通常是前端过滤，不需要重新请求
  // 已通过 filteredMenuTree 计算属性实现
}

/**
 * 重置查询条件
 */
function handleReset() {
  queryParams.name = '';
}

/**
 * 新增菜单
 *
 * @param parentMenu 父级菜单
 */
function handleAdd(parentMenu?: Menu) {
  isEdit.value = false;
  dialogTitle.value = parentMenu ? `新增子菜单（父级：${parentMenu.name}）` : '新增菜单';
  formData.value = {
    ...initialFormData,
    parentId: parentMenu?.id ?? '0',
    sort: 0,
  };
  dialogVisible.value = true;
}

/**
 * 修改菜单
 *
 * @param menu 菜单
 */
async function handleEdit(menu: Menu) {
  isEdit.value = true;
  dialogTitle.value = '编辑菜单';

  // 获取菜单详情
  loading.value = true;
  try {
    const response = await asyncRequest<Menu>(menuApiModule.apis.fetchOne, {
      params: { id: menu.id },
    });
    const detail = response.data;

    formData.value = {
      id: detail.id,
      parentId: detail.parentId ?? 0,
      name: detail.name,
      component: detail.component,
      uri: detail.uri,
      redirectUri: detail.redirectUri,
      icon: detail.icon,
      topLevel: detail.topLevel,
      keepAlive: detail.keepAlive,
      hidden: detail.hidden,
      enabled: detail.enabled,
      common: detail.common,
      sort: 0,
      remark: '',
    };

    dialogVisible.value = true;
  } catch (error) {
    console.error('获取菜单详情失败:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 删除菜单
 *
 * @param menu 菜单
 */
async function handleDelete(menu: Menu) {
  try {
    loading.value = true;
    await asyncRequest(menuApiModule.apis.delete, {
      params: { id: menu.id },
    });

    successMessage('删除成功！');
    await loadMenuTree();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除菜单失败:', error);
    }
  } finally {
    loading.value = false;
  }
}

/**
 * 提交表单
 */
async function handleSubmit() {
  // 验证表单
  const valid = await menuFormRef.value?.validate();
  if (!valid) {
    return;
  }

  loading.value = true;
  try {
    if (isEdit.value) {
      // 编辑菜单
      await asyncRequest(menuApiModule.apis.modify, {
        data: formData.value,
      });
      successMessage('修改成功！');
    } else {
      // 新增菜单
      await asyncRequest(menuApiModule.apis.create, {
        data: formData.value,
      });
      successMessage('新增成功！');
    }

    dialogVisible.value = false;
    await loadMenuTree();
  } catch (error) {
    console.error('提交失败:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 关闭对话框
 */
function handleDialogClose() {
  menuFormRef.value?.resetFields();
  formData.value = { ...initialFormData };
}

// 初始化加载
onMounted(() => {
  loadMenuTree();
});
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-3">
      <!-- 查询表单 -->
      <ElForm :model="queryParams">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
            <ElFormItem label="菜单名称">
              <ElInput
                v-model="queryParams.name"
                placeholder="请输入菜单名称"
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
      <div class="mb-4 flex justify-end">
        <ElButton :icon="Plus" type="success" @click="handleAdd()">
          新增
        </ElButton>
      </div>

      <!-- 菜单树形表格 -->
      <ElTable
        v-loading="loading"
        :data="filteredMenuTree"
        row-key="id"
        border
        max-height="600px"
        :tree-props="{ children: 'children' }"
        class="mt-4"
      >
        <ElTableColumn prop="name" label="菜单名称" min-width="200" />

        <ElTableColumn prop="component" label="组件名称" min-width="150" />

        <ElTableColumn prop="uri" label="路由路径" min-width="200" show-overflow-tooltip />

        <ElTableColumn prop="icon" label="图标" width="100" align="center">
          <template #default="{ row }">
            <IconRender v-if="row.icon" :icon="row.icon" size="18px" />
          </template>
        </ElTableColumn>

        <ElTableColumn prop="topLevel" label="顶级菜单" width="100" align="center">
          <template #default="{ row }">
            <ElTag v-if="row.topLevel" type="success" size="small">
              是
            </ElTag>
            <ElTag v-else type="info" size="small">
              否
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="keepAlive" label="Keep-alive" width="110" align="center">
          <template #default="{ row }">
            <ElTag v-if="row.keepAlive" type="success" size="small">
              是
            </ElTag>
            <ElTag v-else type="info" size="small">
              否
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="hidden" label="隐藏" width="80" align="center">
          <template #default="{ row }">
            <ElTag v-if="row.hidden" type="warning" size="small">
              是
            </ElTag>
            <ElTag v-else type="success" size="small">
              否
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="common" label="公共菜单" width="110" align="center">
          <template #default="{ row }">
            <ElTag v-if="row.hidden" type="warning" size="small">
              是
            </ElTag>
            <ElTag v-else type="success" size="small">
              否
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <ElButton
              :icon="Plus"
              type="primary"
              link
              size="small"
              @click="handleAdd(row)"
            >
              新增
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
    </ElCard>

    <!-- 新增/编辑对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @closed="handleDialogClose"
    >
      <MenuEditor
        ref="menuFormRef"
        v-model="formData"
        :menu-tree="menuTreeData"
        :is-edit="isEdit"
      />

      <template #footer>
        <ElButton @click="dialogVisible = false">
          取消
        </ElButton>
        <ElButton type="primary" :loading="loading" @click="handleSubmit">
          确定
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
</style>
