<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import SmartIconRender from '@/components/icon-render/index.vue';
import type { IconItem } from '@/utils/icon-util';
import { searchIcons } from '@/utils/icon-util';

interface Props {
  icons: IconItem[];
  type: 'ep' | 'svg';
  modelValue: string;
}

defineOptions({
  name: 'IconPanel',
});

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// 搜索关键词
const searchKeyword = ref('');

// 内部选中的图标
const selectedIcon = ref(props.modelValue);

// 容器引用
const containerRef = ref<HTMLElement>();

// 监听外部值变化
watch(() => props.modelValue, newValue => {
  selectedIcon.value = newValue;
});

/**
 * 过滤后的图标列表
 */
const filteredIcons = ref<IconItem[]>(props.icons);

/**
 * 防抖搜索函数
 */
const debouncedSearch = useDebounceFn(() => {
  filteredIcons.value = searchIcons(props.icons, searchKeyword.value);
}, 300);

/**
 * 监听搜索关键词变化
 */
watch(searchKeyword, () => {
  debouncedSearch();
});

/**
 * 监听图标列表变化
 */
watch(() => props.icons, newIcons => {
  filteredIcons.value = searchIcons(newIcons, searchKeyword.value);
}, { immediate: true });

/**
 * 每行显示的图标数量（基于容器宽度动态计算）
 */
const iconsPerRow = ref(18);

/**
 * 更新每行图标数量
 */
function updateIconsPerRow() {
  if (containerRef.value) {
    const containerWidth = containerRef.value.scrollWidth;
    const iconItemWidth = 50;
    iconsPerRow.value = Math.max(1, Math.floor(containerWidth / iconItemWidth));
  }
}

/**
 * 监听容器宽度变化
 */
onMounted(() => {
  updateIconsPerRow();
  window.addEventListener('resize', updateIconsPerRow);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIconsPerRow);
});

/**
 * 行数据接口
 */
interface IconRow {
  rowIndex: number;
  icons: IconItem[];
}

/**
 * 将一维图标数组转换为二维行数组
 */
const iconRows = computed<IconRow[]>(() => {
  const rows: IconRow[] = [];
  const icons = filteredIcons.value;
  const perRow = iconsPerRow.value;

  for (let i = 0; i < icons.length; i += perRow) {
    rows.push({
      rowIndex: i,
      icons: icons.slice(i, i + perRow),
    });
  }

  return rows;
});

/**
 * 选择图标
 */
function selectIcon(iconName: string) {
  selectedIcon.value = iconName;
  emit('update:modelValue', iconName);
}

/**
 * 格式化图标值用于渲染
 */
function formatIconForRender(iconName: string): string {
  return props.type === 'ep' ? `ep:${iconName}` : `svg:${iconName}`;
}
</script>

<template>
  <div ref="containerRef" class="icon-panel">
    <!-- 搜索框 -->
    <ElInput
      v-model="searchKeyword"
      placeholder="搜索图标名称..."
      clearable
      class="mb-4"
    >
      <template #prefix>
        <ElIcon>
          <Search />
        </ElIcon>
      </template>
    </ElInput>

    <!-- 虚拟滚动图标网格 -->
    <div v-if="iconRows.length > 0" class="icon-scroller-wrapper">
      <RecycleScroller
        :items="iconRows"
        :item-size="60"
        :buffer="200"
        key-field="rowIndex"
        class="icon-scroller"
      >
        <template #default="{ item }">
          <div class="icon-row">
            <div
              v-for="icon of item.icons"
              :key="icon.name"
              class="icon-item"
              :class="{ 'is-selected': selectedIcon === icon.name }"
              @click="selectIcon(icon.name)"
            >
              <ElTooltip :content="icon.displayName || icon.name" placement="top">
                <div class="icon-wrapper">
                  <SmartIconRender
                    :icon-value="formatIconForRender(icon.name)"
                    size="24px"
                    class="icon"
                  />
                </div>
              </ElTooltip>
            </div>
          </div>
        </template>
      </RecycleScroller>
    </div>

    <!-- 空状态提示 -->
    <div v-else class="no-result">
      没有找到匹配的图标
    </div>
  </div>
</template>

<style scoped lang="scss">
.icon-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.icon-scroller-wrapper {
  flex: 1;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
}

.icon-scroller {
  height: 100%;
  max-height: 400px;
}

.icon-row {
  display: flex;
  gap: 6px;
  padding: 6px;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
  min-height: 40px;

  &:hover {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.is-selected {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-8);
    box-shadow: 0 0 0 2px var(--el-color-primary-light-5);
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .icon {
    color: var(--el-text-color-primary);
  }
}

.no-result {
  padding: 40px;
  text-align: center;
  color: var(--el-text-color-secondary);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
</style>
