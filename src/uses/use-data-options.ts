import { asyncRequest } from '@/utils/request-util';
import dictDataApiModule from '@/api/system/dict-data';
import enumApiModule from '@/api/enum';
import type DataOptionType from '@/enum/data-option-type';

/**
 * 数据选项加载 Composable
 *
 * @param optionType 选项类型
 * @param optionKey  选项key
 * @param autoLoad   是否在参数变化时自动加载，默认 true
 */
export function useLoadDataOptions<T extends DataOption | DataOptionsGroup>(
  optionType: DataOptionType,
  optionKey: string | T[] | undefined,
  autoLoad = true,
) {
  const data: Ref<T[]> = ref([]);
  const loading = ref(false);
  const error = ref<ApiResponse | null>(null);

  // 缓存上次请求参数，避免重复加载
  let lastParams = { type: '', key: '' };
  // 防竞态请求 ID
  let currentRequestId = 0;

  // 请求映射表
  const loaders: Record<string, (key: any) => Promise<{ data: T[] }>> = {
    DICT: (key: string) =>
      asyncRequest(dictDataApiModule.apis.fetchOptions, { params: { dictKey: key } }),
    ENUM: (key: string) =>
      asyncRequest(enumApiModule.apis.fetchOptions, { params: { class: key } }),
    CONST: (list: T[]) =>
      Promise.resolve({
        data: list.map((item: any) => {
          // 如果已经是分组结构，直接返回
          if ('options' in item && Array.isArray(item.options)) {
            return {
              label: item.label,
              key: item.key ?? item.label,
              options: item.options.map((opt: any) => ({
                label: opt.label ?? opt.value ?? opt,
                value: opt.value ?? opt.label ?? opt,
              })),
            } as DataOptionsGroup;
          }
          // 否则按普通选项处理
          return {
            label: item.label ?? item.value ?? item,
            value: item.value ?? item.label ?? item,
          } as DataOption;
        }),
      } as { data: T[] }),
  };

  // 加载数据函数
  const loadData = async () => {
    if (!optionType || !optionKey) {
      data.value = [];
      return;
    }

    const keyString = JSON.stringify(optionKey);
    // 参数相同不重复加载
    if (lastParams.type === optionType && lastParams.key === keyString) {
      return;
    }
    lastParams = { type: optionType, key: keyString };

    const loader = loaders[optionType];
    if (!loader) {
      console.warn(`[useLoadDataOptions] 未知的数据类型: ${optionType}`);
      data.value = [];
      return;
    }

    const requestId = ++currentRequestId;
    loading.value = true;
    error.value = null;
    try {
      const res = await loader(optionKey as any);

      // 若在等待期间参数已更新，则放弃旧请求结果
      if (requestId !== currentRequestId) {
        return;
      }

      data.value = res.data || [];
    } catch (err: any) {
      if (requestId !== currentRequestId) {
        return;
      }

      error.value = {
        message: err?.message || '加载失败',
        code: err?.code,
        data: err,
      };
      data.value = [];
    } finally {
      if (requestId === currentRequestId) {
        loading.value = false;
      }
    }
  };

  // 首次加载数据
  void loadData();

  // 自动监听参数变化
  if (autoLoad) {
    watch(
      () => [optionType, optionKey],
      () => {
        void loadData();
      },
      { deep: true },
    );
  }

  return {
    data: computed(() => data.value ?? []),
    loading,
    error,
    loadData,
  };
}
