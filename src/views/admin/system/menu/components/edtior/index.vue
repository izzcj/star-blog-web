<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import type { MenuTree } from '../../metadata';
import IconSelector from '@/components/icon-selector/index.vue';

interface Props {
  // 菜单数据
  modelValue: Menu;
  // 菜单树数据
  menuTree: MenuTree[];
  // 是否为编辑模式
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: Menu];
}>();

// 表单引用
const formRef = ref<FormInstance>();

// 表单数据
const formData = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value);
  },
});

// 父级菜单选项（过滤掉当前节点及其子节点，防止循环依赖）
const parentMenuOptions = computed(() => {
  if (!props.isEdit || !formData.value.id) {
    return props.menuTree;
  }

  // 递归过滤函数：移除当前节点及其所有子节点
  function filterMenuTree(menus: MenuTree[], excludeId: string): MenuTree[] {
    return menus
      .filter(menu => menu.id !== excludeId)
      .map(menu => ({
        ...menu,
        children: menu.children ? filterMenuTree(menu.children, excludeId) : [],
      }));
  }

  return filterMenuTree(props.menuTree, formData.value.id);
});

// 顶级菜单选项（用于树形选择器的根节点）
const parentMenuTreeData = computed(() => {
  return [
    {
      id: '',
      name: '顶级菜单',
      parentId: '0',
      component: '',
      uri: '',
      icon: '',
      topLevel: true,
      keepAlive: false,
      hidden: false,
      common: true,
      children: parentMenuOptions.value,
    } as MenuTree,
  ];
});

// 表单验证规则
const rules: FormRules<Menu> = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  component: [
    { required: true, message: '请输入组件名称', trigger: 'blur' },
    {
      pattern: /^[A-Z][a-zA-Z0-9]*$/,
      message: '组件名称必须使用 PascalCase 格式（首字母大写）',
      trigger: 'blur',
    },
  ],
  uri: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
  ],
  redirectUri: [
    {
      pattern: /^(\/[\w/-]*)?$/,
      message: '重定向路径格式不正确',
      trigger: 'blur',
    },
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
    { type: 'number', message: '排序号必须是数字', trigger: 'blur' },
  ],
};

// 验证表单
async function validate(): Promise<boolean> {
  if (!formRef.value) {
    return false;
  }
  try {
    await formRef.value.validate();
    return true;
  } catch {
    return false;
  }
}

// 重置表单
function resetFields() {
  formRef.value?.resetFields();
}

// 暴露方法给父组件
defineExpose({
  validate,
  resetFields,
});
</script>

<template>
  <ElForm
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
  >
    <ElFormItem label="父级菜单" prop="parentId">
      <ElTreeSelect
        v-model="formData.parentId"
        :data="parentMenuTreeData"
        :props="{ label: 'name', value: 'id' }"
        check-strictly
        :render-after-expand="false"
        placeholder="请选择父级菜单（不选则为根菜单）"
        clearable
        filterable
        class="w-full"
      />
    </ElFormItem>

    <ElFormItem label="菜单名称" prop="name">
      <ElInput
        v-model="formData.name"
        placeholder="请输入菜单名称"
        clearable
      />
    </ElFormItem>

    <ElFormItem label="组件名称" prop="component">
      <ElInput
        v-model="formData.component"
        placeholder="例如：SystemUser（PascalCase格式）"
        clearable
      />
      <div class="text-xs text-gray-500 mt-1">
        组件名称用于路由命名，必须使用 PascalCase 格式（首字母大写）
      </div>
    </ElFormItem>

    <ElFormItem label="路由路径" prop="uri">
      <ElInput
        v-model="formData.uri"
        placeholder="例如：/system/user"
        clearable
      />
      <div class="text-xs text-gray-500 mt-1">
        路由路径需要对应 views 目录下的组件路径
      </div>
    </ElFormItem>

    <ElFormItem label="重定向路径" prop="redirectUri">
      <ElInput
        v-model="formData.redirectUri"
        placeholder="可选，例如：/system/user/list"
        clearable
      />
    </ElFormItem>

    <ElFormItem label="菜单图标" prop="icon">
      <IconSelector v-model="formData.icon" />
    </ElFormItem>

    <ElFormItem label="排序号" prop="sort">
      <ElInputNumber
        v-model="formData.sort"
        :min="0"
        :max="9999"
        :step="1"
        controls-position="right"
        class="w-full"
      />
    </ElFormItem>

    <ElRow>
      <ElCol :span="12">
        <ElFormItem label="顶级菜单">
          <ElSwitch v-model="formData.topLevel" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem label="是否缓存">
          <ElSwitch v-model="formData.keepAlive" />
        </ElFormItem>
      </ElCol>
    </ElRow>

    <ElRow>
      <ElCol :span="12">
        <ElFormItem label="是否启用">
          <ElSwitch v-model="formData.enabled" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem label="是否隐藏">
          <ElSwitch v-model="formData.hidden" />
        </ElFormItem>
      </ElCol>
    </ElRow>

    <ElFormItem label="公共菜单">
      <ElSwitch v-model="formData.common" />
    </ElFormItem>

    <ElFormItem label="备注" prop="remark">
      <ElInput
        v-model="formData.remark"
        type="textarea"
        :rows="3"
        placeholder="请输入备注信息"
        maxlength="200"
        show-word-limit
      />
    </ElFormItem>
  </ElForm>
</template>

<style scoped lang="scss">

</style>
