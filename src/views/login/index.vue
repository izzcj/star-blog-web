<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { frameworkConfig } from '@/config/framework.config';
import { useAuthenticationStore } from '@/stores/authentication-store';
import CommonRouterPath from '@/enum/common-router-path';
import loginBg from '@/assets/image/login-bg.png';

defineOptions({
  name: 'LoginPage',
});

const router = useRouter();
const route = useRoute();
const redirectUri = route.query.redirect;

const formRef = shallowRef<FormInstance>();
const authenticationStore = useAuthenticationStore();

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

const loginData = reactive<LoginData>({
  account: '',
  password: '',
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
      try {
        await authenticationStore.login(loginData);
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
      }
    }
  });
}
</script>

<template>
  <ElImage :src="loginBg" class="h-dvh w-dvw fixed" fit="cover" :z-index="-1" />
  <ElContainer class="h-dvh w-dvw relative opacity-100">
    <ElHeader>
      <div class="min-h-full">
        <ElButton class="bg-transparent text-white border-[0px]" @click="router.back()">
          返回
        </ElButton>
      </div>
    </ElHeader>
    <ElMain>
      <div class="venus-center min-h-full pt-5 md:ml-[20%]">
        <ElCard class="w-[80dvw] bg-white/80 backdrop-blur-xs z-10 md:w-[20dvw]">
          <ElTabs class="p-6 text-2xl">
            <ElTabPane label="登录">
              <ElForm ref="formRef" :model="loginData" :rules="rules" :hide-required-asterisk="true" class="pt-5">
                <ElFormItem prop="account">
                  <ElInput v-model="loginData.account" placeholder="请输入账号" class="h-10">
                    <template #prefix>
                      <ElIcon>
                        <User />
                      </ElIcon>
                    </template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem prop="password">
                  <ElInput v-model="loginData.password" placeholder="请输入密码" type="password" class="h-10">
                    <template #prefix>
                      <ElIcon>
                        <Lock />
                      </ElIcon>
                    </template>
                  </ElInput>
                </ElFormItem>
                <ElFormItem>
                  <ElButton class="h-10 w-full mt-[20px]" @click="login(formRef)">
                    登录
                  </ElButton>
                </ElFormItem>
              </ElForm>
            </ElTabPane>
            <ElTabPane v-if="false" label="注册">
              <ElButton>
                注册
              </ElButton>
            </ElTabPane>
          </ElTabs>
        </ElCard>
      </div>
    </ElMain>
    <ElFooter>
      <div class="min-h-full" />
    </ElFooter>
  </ElContainer>
</template>

<style scoped lang="scss">
:deep(.el-tabs__item) {
  font-size: 20px !important;
}
</style>
