<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { frameworkConfig } from '@/config/framework.config';
import { useAuthenticationStore } from '@/stores/authentication-store';
import CommonRouterPath from '@/enum/common-router-path';

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
  <div class="body venus-center">
    <ElCard class="loginForm venus-center">
      <ElTabs>
        <ElTabPane label="登录">
          <ElForm ref="formRef" :model="loginData" :rules="rules">
            <ElFormItem label="账号" prop="account">
              <ElInput v-model="loginData.account" placeholder="请输入账号" />
            </ElFormItem>
            <ElFormItem label="密码" prop="password">
              <ElInput v-model="loginData.password" placeholder="请输入密码" type="password" />
            </ElFormItem>
          </ElForm>
          <ElButton class="login-button" @click="login(formRef)">
            登录
          </ElButton>
        </ElTabPane>
        <ElTabPane v-if="false" label="注册">
          <ElButton>
            注册
          </ElButton>
        </ElTabPane>
      </ElTabs>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.body {
  height: 100%;
  width: 100%;
}

.loginForm {
  height: 40vh;
  width: 30vh;
  margin-left: 20%;
  .login-button {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
