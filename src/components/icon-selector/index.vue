<script setup lang="ts">
import * as ElementPlusIcons from '@element-plus/icons-vue';
import { ArrowDown, Search } from '@element-plus/icons-vue';
import SmartIconRender from './components/SmartIconRender.vue';
import IconPanel from './components/IconPanel.vue';
import type { IconType } from '@/utils/icon-utils';
import {
  parseIconValue,
  formatIconValue,
  getLocalSvgIcons,
  convertToIconItems,
} from '@/utils/icon-utils';

interface Props {
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// 对话框显示状态
const dialogVisible = ref(false);

// 当前激活的 Tab
const activeTab = ref<IconType>('ep');

// Element Plus 图标列表
const elementPlusIcons = computed(() => {
  const iconNames = Object.keys(ElementPlusIcons).filter(
    // 过滤掉可能的非图标导出
    name => name !== 'Menu',
  );
  return convertToIconItems(iconNames);
});

// 本地 SVG 图标列表
const svgIcons = computed(() => {
  const iconNames = getLocalSvgIcons();
  return convertToIconItems(iconNames);
});

// Element Plus 面板选中的图标名称
const epSelectedIcon = ref('');

// SVG 面板选中的图标名称
const svgSelectedIcon = ref('');

// 监听外部值变化，解析并同步到对应的 Tab
watch(() => props.modelValue, newValue => {
  if (newValue) {
    const parsed = parseIconValue(newValue);
    activeTab.value = parsed.type;

    if (parsed.type === 'ep') {
      epSelectedIcon.value = parsed.name;
      svgSelectedIcon.value = '';
    } else if (parsed.type === 'svg') {
      svgSelectedIcon.value = parsed.name;
      epSelectedIcon.value = '';
    }
  } else {
    epSelectedIcon.value = '';
    svgSelectedIcon.value = '';
  }
}, { immediate: true });

// 当前选中的图标名称（根据当前 Tab）
const currentSelectedIcon = computed(() => {
  return activeTab.value === 'ep' ? epSelectedIcon.value : svgSelectedIcon.value;
});

/**
 * 打开选择器
 */
function openSelector() {
  dialogVisible.value = true;

  // 根据当前值设置初始 Tab 和选中状态
  if (props.modelValue) {
    const parsed = parseIconValue(props.modelValue);
    activeTab.value = parsed.type;
  }
}

/**
 * 确认选择
 */
function confirmSelection() {
  const selectedName = currentSelectedIcon.value;

  if (selectedName) {
    const formattedValue = formatIconValue(activeTab.value, selectedName);
    emit('update:modelValue', formattedValue);
  }

  dialogVisible.value = false;
}

/**
 * 清空选择
 */
function clearSelection() {
  epSelectedIcon.value = '';
  svgSelectedIcon.value = '';
  emit('update:modelValue', '');
  dialogVisible.value = false;
}
</script>

<template>
  <div class="icon-selector">
    <!-- 触发器：显示当前选中的图标 -->
    <ElInput
      :model-value="modelValue"
      placeholder="请选择图标"
      readonly
      @click="openSelector"
    >
      <template #prefix>
        <SmartIconRender v-if="modelValue" :icon-value="modelValue" size="18px" />
        <ElIcon v-else>
          <Search />
        </ElIcon>
      </template>
      <template #suffix>
        <ElIcon class="cursor-pointer hover:text-primary">
          <ArrowDown />
        </ElIcon>
      </template>
    </ElInput>

    <!-- 图标选择对话框 -->
    <ElDialog
      v-model="dialogVisible"
      title="选择图标"
      width="800px"
      :close-on-click-modal="false"
    >
      <!-- Tab 切换 -->
      <ElTabs v-model="activeTab" class="icon-tabs">
        <!-- Element Plus 图标 Tab -->
        <ElTabPane label="Element Plus 图标" name="ep">
          <IconPanel
            v-model="epSelectedIcon"
            :icons="elementPlusIcons"
            type="ep"
            :page-size="50"
          />
        </ElTabPane>

        <!-- 本地 SVG 图标 Tab -->
        <ElTabPane label="本地 SVG 图标" name="svg">
          <IconPanel
            v-model="svgSelectedIcon"
            :icons="svgIcons"
            type="svg"
            :page-size="50"
          />
        </ElTabPane>
      </ElTabs>

      <!-- 底部操作按钮 -->
      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            <span v-if="currentSelectedIcon">
              已选择：<strong>{{ activeTab }}:{{ currentSelectedIcon }}</strong>
            </span>
            <span v-else>请选择一个图标</span>
          </div>
          <div>
            <ElButton @click="clearSelection">
              清空
            </ElButton>
            <ElButton @click="dialogVisible = false">
              取消
            </ElButton>
            <ElButton
              type="primary"
              :disabled="!currentSelectedIcon"
              @click="confirmSelection"
            >
              确定
            </ElButton>
          </div>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.icon-selector {
  :deep(.el-input__inner) {
    cursor: pointer;
  }
}

.icon-tabs {
  :deep(.el-tabs__content) {
    min-height: 450px;
  }
}
</style>
