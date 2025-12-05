<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { ArrowLeft, Lock, User } from '@element-plus/icons-vue';
import { frameworkConfig } from '@/config/framework.config';
import { useAuthenticationStore } from '@/stores/authentication-store';
import CommonRouterPath from '@/enums/common-router-path';
import LoginType from '@/enums/login-type';
import loginBg from '@/assets/image/login-bg.png';

defineOptions({
  name: 'LoginPage',
});

const router = useRouter();
const route = useRoute();
const redirectUri = route.query.redirect;

const formRef = shallowRef<FormInstance>();
const authenticationStore = useAuthenticationStore();

// 加载状态
const loading = ref(false);

// 记住我状态
const rememberMe = ref(false);

const rules = reactive<FormRules<LoginData>>({
  account: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
});

const loginType = ref(LoginType.ACCOUNT_PASSWORD);

const loginData = reactive<LoginData>({
  account: '',
  password: '',
  loginType: loginType.value,
});

// 组件挂载时检查本地存储
onMounted(() => {
  const savedAccount = localStorage.getItem('rememberedAccount');
  if (savedAccount) {
    loginData.account = savedAccount;
    rememberMe.value = true;
  }
});

/**
 * 登录
 */
function login(formEl: FormInstance | undefined) {
  if (!formEl) {
    return;
  }
  formEl.validate(async valid => {
    if (valid) {
      loading.value = true;
      try {
        await authenticationStore.login(loginData);

        // 处理"记住我"功能
        if (rememberMe.value) {
          localStorage.setItem('rememberedAccount', loginData.account);
        } else {
          localStorage.removeItem('rememberedAccount');
        }

        if (frameworkConfig.loginSuccessRouteName) {
          await router.replace({
            name: frameworkConfig.loginSuccessRouteName,
            ...(redirectUri
              ? {
                  query: {
                    redirect: redirectUri,
                  },
                }
              : {}),
          });
        } else {
          if (redirectUri) {
            await router.replace({
              path: decodeURIComponent(redirectUri as string),
            });
          } else {
            await router.replace({
              path: CommonRouterPath.HOME,
            });
          }
        }
      } catch {
        loading.value = false;
      }
    }
  });
}

/**
 * 忘记密码
 */
function handleForgotPassword() {
  // TODO: 实现忘记密码功能
}
</script>

<template>
  <div class="relative w-dvw h-dvh overflow-hidden flex items-center justify-center">
    <!-- 背景图片 -->
    <ElImage :src="loginBg" class="fixed! top-0 left-0 w-dvw h-dvh" fit="cover" />

    <!-- 渐变蒙版 -->
    <div class="gradient-overlay" />

    <!-- 返回按钮 -->
    <div class="absolute top-5 left-5 z-10">
      <ElButton class="text-white/90! text-base transition duration-300 ease-in-out hover:text-white hover:-translate-x-1" text @click="router.back()">
        <ElIcon class="mr-1">
          <ArrowLeft />
        </ElIcon>
        返回
      </ElButton>
    </div>

    <!-- 主登录卡片 -->
    <div class="w-full flex items-center justify-center p-5 animate-fade-in-up">
      <div class="glass-card glass-card-hover w-full max-w-[450px] px-10 py-12 rounded-3xl max-md:max-w-[90%] max-md:px-7 max-md:py-9 max-sm:px-5 max-sm:py-7 max-sm:rounded-[20px]">
        <!-- 标题区域 -->
        <div class="text-center mb-8 max-sm:mb-6">
          <h1 class="text-[32px] font-bold text-white/95 mb-2 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] max-md:text-[28px] max-sm:text-2xl">
            欢迎回来
          </h1>
          <p class="text-[15px] text-white/75 font-normal m-0 max-md:text-sm">
            登录到您的账户
          </p>
        </div>

        <!-- 登录表单 -->
        <ElForm
          ref="formRef"
          :model="loginData"
          :rules="rules"
          :hide-required-asterisk="true"
          class="w-full"
        >
          <!-- 账号输入框 -->
          <ElFormItem prop="account">
            <ElInput
              v-model="loginData.account"
              placeholder="请输入账号"
              class="login-input"
              size="large"
            >
              <template #prefix>
                <ElIcon class="input-icon">
                  <User />
                </ElIcon>
              </template>
            </ElInput>
          </ElFormItem>

          <!-- 密码输入框 -->
          <ElFormItem prop="password">
            <ElInput
              v-model="loginData.password"
              placeholder="请输入密码"
              type="password"
              class="login-input"
              size="large"
              show-password
            >
              <template #prefix>
                <ElIcon class="input-icon">
                  <Lock />
                </ElIcon>
              </template>
            </ElInput>
          </ElFormItem>

          <!-- 记住我 & 忘记密码 -->
          <div class="flex justify-between items-center -my-2 mb-6">
            <ElCheckbox v-model="rememberMe" class="remember-checkbox">
              记住我
            </ElCheckbox>
            <ElButton text class="forgot-password" @click="handleForgotPassword">
              忘记密码？
            </ElButton>
          </div>

          <!-- 登录按钮 -->
          <ElFormItem>
            <ElButton
              class="login-button"
              size="large"
              :loading="loading"
              @click="login(formRef)"
            >
              {{ loading ? '登录中...' : '登录' }}
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@forward "@/styles/common";
// Element Plus 输入框深层样式覆盖
:deep(.login-input) {
  .el-input__wrapper {
    @extend .glass-input;
    border-radius: 12px;
    padding: 12px 16px;
  }

  .el-input__inner {
    color: rgba(255, 255, 255, 0.95);
    font-size: 15px;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .input-icon {
    color: rgba(255, 255, 255, 0.7);
    font-size: 18px;
  }
}

// Element Plus 复选框深层样式覆盖
:deep(.remember-checkbox) {
  .el-checkbox__label {
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
  }

  .el-checkbox__inner {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);

    &:hover {
      border-color: rgba(22, 119, 255, 0.8);
    }
  }

  .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #1677ff;
    border-color: #1677ff;
  }
}

// 忘记密码链接样式
:deep(.forgot-password) {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  padding: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.85);
    transition: width 0.3s ease;
  }

  &:hover {
    color: rgba(255, 255, 255, 1);

    &::after {
      width: 100%;
    }
  }
}

// Element Plus 登录按钮深层样式
:deep(.login-button) {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #1677ff 0%, #0ea5e9 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow:
    0 4px 16px rgba(22, 119, 255, 0.4),
    0 8px 24px rgba(22, 119, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  // 光泽效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover:not(.is-disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 6px 20px rgba(22, 119, 255, 0.5),
      0 12px 32px rgba(22, 119, 255, 0.3);

    &::before {
      left: 100%;
    }
  }

  &:active:not(.is-disabled) {
    transform: translateY(0);
  }

  &.is-loading {
    opacity: 0.8;
  }
}

// 响应式设计 - 按钮高度调整
@media (max-width: 768px) {
  :deep(.login-button) {
    height: 44px;
    font-size: 15px;
  }
}

// Element Plus 表单项间距
:deep(.el-form-item) {
  margin-bottom: 20px;
}

// Element Plus 按钮样式覆盖
:deep(.el-button.is-text:hover) {
  background-color: transparent;
}
</style>
