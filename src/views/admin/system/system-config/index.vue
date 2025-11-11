<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import type { SystemConfig } from './metadata';
import ConfigItem from './components/config-item.vue';
import { useLoadDataOptions } from '@/uses/use-data-options';
import DataOptionType from '@/enum/data-option-type';
import { asyncRequest } from '@/utils/request-util';
import { systemConfigApiModule } from '@/api/system/system-config';
import SystemConfigType from '@/enum/systme-config-type';
import { successMessage } from '@/element-plus/notification';

defineOptions({
  name: 'SystemConfigPage',
});

const currentConfigCategory = ref('');
// 获取配置类型字典
const { data: configCategoryOptions } = useLoadDataOptions(DataOptionType.DICT, 'system-config-category');

// 控制新增配置对话框显示状态
const dialogVisible = ref(false);
// 新增配置表单数据
const formRef = ref();
const formData = ref<Omit<SystemConfig, 'id' | 'createTime' | 'updateTime'>>({
  category: '',
  sort: null,
  name: '',
  type: SystemConfigType.TEXT,
  key: '',
  value: null,
  dataSourceType: null,
  dataSourceConfig: null,
});

const hasDataSource = computed(() => {
  return formData.value.type === SystemConfigType.SELECT
    || formData.value.type === SystemConfigType.MULTI_SELECT
    || formData.value.type === SystemConfigType.RADIO
    || formData.value.type === SystemConfigType.CHECKBOX;
});

watch(
  () => configCategoryOptions.value,
  newOptions => {
    if (!isEmpty(newOptions) && !currentConfigCategory.value) {
      currentConfigCategory.value = newOptions[0].value;
    }
  },
  { immediate: true },
);

const systemConfigs = ref<SystemConfig[]>([]);

watch(
  () => currentConfigCategory.value,
  _ => {
    loadSystemConfigs();
  },
);

/**
 * 加载系统配置项
 */
function loadSystemConfigs() {
  asyncRequest(systemConfigApiModule.apis.fetchList, { params: { category: currentConfigCategory.value } }).then(res => {
    systemConfigs.value = res.data;
  });
}

/**
 * 处理配置类别改变
 *
 * @param category 选中类别
 */
function handleConfigCategoryChange(category: string) {
  currentConfigCategory.value = category;
}

/**
 * 保存配置项
 *
 * @param config 配置项
 */
function saveConfig(config: SystemConfig) {
  // 检查是否是新增的配置项（没有id）
  if (!config.id) {
    // 新增配置项
    asyncRequest(systemConfigApiModule.apis.create, { data: config }).then(() => {
      successMessage('新增成功');
      loadSystemConfigs();
    });
  } else {
    // 更新已存在的配置项
    asyncRequest(systemConfigApiModule.apis.modify, { data: config }).then(() => {
      successMessage('保存成功');
    });
  }
}

/**
 * 删除配置项
 *
 * @param config 配置项
 */
function deleteConfig(config: SystemConfig) {
  ElMessageBox.confirm('确定要删除该配置项吗？', '提示', {
    type: 'warning',
  }).then(() => {
    asyncRequest(systemConfigApiModule.apis.delete, { params: { id: config.id } }).then(() => {
      successMessage('删除成功');
    });
    loadSystemConfigs();
  });
}

/**
 * 新增配置点击事件
 */
function clickAddConfig() {
  // 初始化表单数据
  formData.value = {
    category: currentConfigCategory.value,
    sort: null,
    name: '',
    type: SystemConfigType.TEXT,
    key: '',
    value: null,
    dataSourceType: null,
    dataSourceConfig: null,
  };
  dialogVisible.value = true;
}

/**
 * 提交新增配置表单
 */
function submitForm() {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      asyncRequest(systemConfigApiModule.apis.create, { data: formData.value }).then(() => {
        successMessage('新增成功');
        dialogVisible.value = false;
        loadSystemConfigs();
      });
    }
  });
}
</script>

<template>
  <div>
    <ElRow :gutter="10">
      <ElCol :span="3">
        <ElCard shadow="never" class="h-full">
          <ElEmpty v-if="isEmpty(configCategoryOptions)" description="暂无配置类型" />
          <ul class="p-0 m-0">
            <li
              v-for="item of configCategoryOptions"
              :key="item.value"
              class="px-1 py-1 text-center cursor-pointer list-none rounded transition-colors duration-300 mb-1"
              :class="{ 'bg-blue-100 text-blue-600': currentConfigCategory === item.value,
                        'hover:bg-gray-100': currentConfigCategory !== item.value }"
              @click="handleConfigCategoryChange(item.value)"
            >
              {{ item.label }}
            </li>
          </ul>
        </ElCard>
      </ElCol>
      <ElCol :span="21">
        <ElCard shadow="never" class="h-dvh">
          <template #header>
            <div class="flex justify-between items-center">
              <span>系统配置</span>
              <ElButton type="primary" @click="clickAddConfig">
                新增配置
              </ElButton>
            </div>
          </template>
          <ElTable :data="systemConfigs">
            <ElTableColumn label="序号" prop="sort" width="80px" />
            <ElTableColumn label="配置项" prop="name" width="120px" />
            <ElTableColumn label="配置值" prop="value" min-width="400px">
              <template #default="scope">
                <ConfigItem
                  :key="scope.row.id"
                  v-model:value="scope.row.value"
                  :type="scope.row.type"
                  :label="scope.row.name"
                  :data-source-type="scope.row.dataSourceType"
                  :data-source-config="scope.row.dataSourceConfig"
                />
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" width="180px" fixed="right">
              <template #default="scope">
                <ElButton @click="saveConfig(scope.row)">
                  保存
                </ElButton>
                <ElButton @click="deleteConfig(scope.row)">
                  删除
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 新增配置对话框 -->
    <ElDialog
      v-model="dialogVisible"
      title="新增配置"
      width="600px"
    >
      <ElForm
        ref="formRef"
        :model="formData"
        label-width="100px"
      >
        <ElFormItem label="配置名称" prop="name" required>
          <ElInput v-model="formData.name" placeholder="请输入配置名称" />
        </ElFormItem>
        <ElFormItem label="配置键名" prop="key" required>
          <ElInput v-model="formData.key" placeholder="请输入配置键名" />
        </ElFormItem>
        <ElFormItem label="排序" prop="sort">
          <ElInputNumber v-model="formData.sort" placeholder="请输入排序" />
        </ElFormItem>
        <ElFormItem label="配置类型" prop="type" required>
          <ElSelect v-model="formData.type" placeholder="请选择配置类型">
            <ElOption
              v-for="(label, key) of SystemConfigType"
              :key="key"
              :label="label"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-show="hasDataSource" label="数据源类型">
          <ElSelect v-model="formData.dataSourceType" placeholder="请选择数据源类型">
            <ElOption
              v-for="(label, key) of DataOptionType"
              :key="key"
              :label="label"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-show="hasDataSource" label="数据源配置">
          <ElInput v-model="formData.dataSourceConfig" placeholder="请输入数据源配置" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="dialogVisible = false">取消</ElButton>
          <ElButton type="primary" @click="submitForm">确定</ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
</style>
