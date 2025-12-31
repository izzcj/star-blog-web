<script setup lang="ts">
import { Check, Delete, Plus } from '@element-plus/icons-vue';
import type { FormRules } from 'element-plus';
import type { SystemConfig } from './metadata';
import ConfigItem from './components/config-item.vue';
import { useLoadDataOptions } from '@/uses/use-data-options';
import DataOptionType from '@/enums/data-option-type';
import { asyncRequest } from '@/utils/request-util';
import { systemConfigApiModule } from '@/api/system/system-config';
import SystemConfigType from '@/enums/systme-config-type';
import { successMessage } from '@/element-plus/notification';

defineOptions({
  name: 'SystemConfigPage',
});

const currentConfigCategory = ref('');
const optionType = computed(() => DataOptionType.DICT);
const optionKey = computed(() => 'system-config-category');
// 获取配置类型字典
const { data: configCategoryOptions } = useLoadDataOptions(optionType, optionKey);

// 控制新增配置对话框显示状态
const dialogVisible = ref(false);
// 新增配置表单数据
const formRef = ref();
const loading = ref(false);

type SystemConfigFormData = Omit<SystemConfig, 'id' | 'deletable' | 'createTime' | 'updateTime'>;
const formData = ref<SystemConfigFormData>({
  category: '',
  sort: null,
  name: '',
  type: SystemConfigType.TEXT,
  key: '',
  value: null,
  dataSourceType: null,
  dataSourceConfig: null,
});

// 表单验证规则
const rules: FormRules<SystemConfigFormData> = {
  name: [
    { required: true, message: '请输入配置名称', trigger: 'blur' },
  ],
  key: [
    { required: true, message: '请输入配置key', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择配置类型', trigger: 'change' },
  ],
};

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
  loading.value = true;
  asyncRequest<SystemConfig[]>(systemConfigApiModule.apis.fetchList, {
    params: {
      category: currentConfigCategory.value,
    },
  })
    .then(res => {
      systemConfigs.value = res.data.map(config => {
        if (config.type === SystemConfigType.MULTI_SELECT || config.type === SystemConfigType.CHECKBOX) {
          if (config.value) {
            config.value = JSON.parse(config.value);
          }
        }
        return config;
      });
    })
    .finally(() => {
      loading.value = false;
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
  const submitData = { ...config };
  if (submitData.type === SystemConfigType.MULTI_SELECT || config.type === SystemConfigType.CHECKBOX) {
    if (submitData.value) {
      submitData.value = JSON.stringify(submitData.value);
    }
  }
  // 检查是否是新增的配置项（没有id）
  if (!config.id) {
    // 新增配置项
    asyncRequest(systemConfigApiModule.apis.create, { data: submitData }).then(() => {
      successMessage('新增成功');
      loadSystemConfigs();
    });
  } else {
    // 更新已存在的配置项
    asyncRequest(systemConfigApiModule.apis.modify, { data: submitData }).then(() => {
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
  asyncRequest(systemConfigApiModule.apis.delete, { pathParams: { id: config.id } }).then(() => {
    successMessage('删除成功');
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
              <ElButton :icon="Plus" type="success" @click="clickAddConfig">
                新增
              </ElButton>
            </div>
          </template>
          <ElTable v-loading="loading" :data="systemConfigs" max-height="700px">
            <ElTableColumn label="序号" prop="sort" width="80px" />
            <ElTableColumn label="配置项" prop="name" width="150px" />
            <ElTableColumn label="配置值" prop="value" min-width="400px">
              <template #default="{ row }">
                <ConfigItem
                  :key="row.id"
                  v-model:value="row.value"
                  :type="row.type"
                  :label="row.name"
                  :data-source-type="row.dataSourceType"
                  :data-source-config="row.dataSourceConfig"
                />
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" width="180px" fixed="right">
              <template #default="{ row }">
                <ElButton size="small" :icon="Check" @click="saveConfig(row)">
                  保存
                </ElButton>
                <ElPopconfirm v-if="row.deletable" title="确定删除吗？" placement="top" @confirm="deleteConfig(row)">
                  <template #reference>
                    <ElButton size="small" :icon="Delete" type="danger">
                      删除
                    </ElButton>
                  </template>
                </ElPopconfirm>
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
        :rules="rules"
        label-width="100px"
      >
        <ElFormItem label="配置名称" prop="name">
          <ElInput v-model="formData.name" placeholder="请输入配置名称" />
        </ElFormItem>
        <ElFormItem label="配置键名" prop="key">
          <ElInput v-model="formData.key" placeholder="请输入配置键名" />
        </ElFormItem>
        <ElFormItem label="排序" prop="sort">
          <ElInputNumber v-model="formData.sort" placeholder="请输入排序" />
        </ElFormItem>
        <ElFormItem label="配置类型" prop="type">
          <VenusSelect
            v-model:value="formData.type"
            :option-type="DataOptionType.ENUM"
            option-key="com.ale.starblog.admin.system.enums.SystemConfigType"
            placeholder="请选择配置类型"
          />
        </ElFormItem>
        <ElFormItem v-show="hasDataSource" label="数据源类型">
          <VenusSelect
            v-model:value="formData.dataSourceType"
            :option-type="DataOptionType.ENUM"
            option-key="com.ale.starblog.admin.system.enums.SystemConfigDataSourceType"
            placeholder="请选择数据源类型"
          />
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
