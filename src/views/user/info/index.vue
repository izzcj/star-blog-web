<script setup lang="ts">
import CommonRouterPath from '@/enum/common-router-path';
import { useAuthenticationStore } from '@/stores/authentication-store';
import { successNotification } from '@/element-plus/notification';

defineOptions({
  name: 'UserInfoPage',
});

const authenticationStore = useAuthenticationStore();
const router = useRouter();
const avatar = ref('https://www.zmtc.com/wp-content/uploads/2023/0308/20230308090400294.jpg');
/**
 * 个人信息点击事件
 */
function clickUserInfo() {
  router.push('/user/info');
}

/**
 * 登录点击事件
 */
function clickLogin() {
  router.push(CommonRouterPath.LOGIN);
}

/**
 * 退出登录点击事件
 */
function clickLogout() {
  authenticationStore.logout().then(message => {
    successNotification(message);
  });
}
</script>

<template>
  <div class="cursor-pointer pt-[5px] venus-center">
    <ElDropdown v-if="authenticationStore.isLoggedIn">
      <ElAvatar :size="50" :src="avatar" />
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem @click="clickUserInfo">
            个人信息
          </ElDropdownItem>
          <ElDropdownItem @click="clickLogout">
            退出登录
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
    <ElAvatar v-else :size="50" @click="clickLogin">
      登录
    </ElAvatar>
  </div>
</template>

<style scoped lang="scss">
</style>
