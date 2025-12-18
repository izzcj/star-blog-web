<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'PasswordStrength',
});

const props = defineProps<Props>();

interface Props {
  password: string;
}

/**
 * 计算密码强度
 * 返回值：0-4
 * 0: 空
 * 1: 弱（仅数字或仅字母）
 * 2: 中等（字母+数字）
 * 3: 强（字母+数字+特殊字符）
 * 4: 很强（字母+数字+特殊字符+长度>12）
 */
const strength = computed(() => {
  const password = props.password;
  if (!password) {
    return 0;
  }

  let score = 0;

  // 长度检查
  if (password.length >= 6) {
    score++;
  }
  if (password.length >= 10) {
    score++;
  }

  // 复杂度检查
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);

  if (hasLowerCase || hasUpperCase) {
    score++;
  }
  if (hasNumber) {
    score++;
  }
  if (hasSpecial) {
    score++;
  }

  // 额外分数：大小写混合
  if (hasLowerCase && hasUpperCase) {
    score++;
  }

  return Math.min(Math.floor(score / 1.5), 4);
});

/**
 * 强度文本
 */
const strengthText = computed(() => {
  switch (strength.value) {
    case 0:
      return '';
    case 1:
      return '弱';
    case 2:
      return '中等';
    case 3:
      return '强';
    case 4:
      return '很强';
    default:
      return '';
  }
});

/**
 * 强度颜色
 */
const strengthColor = computed(() => {
  switch (strength.value) {
    case 0:
      return '#e0e0e0';
    case 1:
      return '#F56C6C';
    case 2:
      return '#E6A23C';
    case 3:
      return '#67C23A';
    case 4:
      return '#13CE66';
    default:
      return '#e0e0e0';
  }
});

/**
 * 强度宽度百分比
 */
const strengthWidth = computed(() => {
  return `${(strength.value / 4) * 100}%`;
});
</script>

<template>
  <div v-if="props.password" class="mt-2 animate-fade-in">
    <div class="flex items-center mb-2 text-[13px]">
      <span class="text-gray-500 mr-2">密码强度：</span>
      <span
        class="font-semibold transition-colors duration-300"
        :style="{ color: strengthColor }"
      >
        {{ strengthText }}
      </span>
    </div>
    <div class="w-full h-1.5 bg-gray-200 rounded overflow-hidden relative">
      <div
        class="h-full rounded relative transition-all duration-300 ease-in-out
               after:absolute after:inset-0
               after:bg-linear-[90deg,#FFFFFF00_0%,#FFFFFF4C_50%,#FFFFFF00_100%]
               after:animate-[shimmer_2s_infinite]
              "
        :style="{
          width: strengthWidth,
          backgroundColor: strengthColor,
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
