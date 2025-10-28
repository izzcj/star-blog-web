import { bool, func, string } from 'vue-types';

export const venusMdEditorProps = {
  // 是否只读
  isRead: bool().def(false),
  // 值
  value: string(),
  // 值更新函数
  onUpdateValue: func<ConsumerFunction<Undefinable<MaybeArray<string>>>>(),
} as const;
