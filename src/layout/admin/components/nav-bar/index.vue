<script setup lang="ts">
import Logo from '@/layout/components/nav-bar/logo/index.vue';
import { useUserInfoStore } from '@/stores/user-info-store';

defineOptions({
  name: 'AdminNavBar',
});

const logType = ref('TEXT');
const logText = ref('StarBlog');
const userInfoStore = useUserInfoStore();
const avatar = ref(userInfoStore.avatar);
const router = useRouter();

/**
 * 进入首页
 */
function toHome() {
  router.push('/home');
}
</script>

<template>
  <ElRow>
    <ElCol>
      <Logo :type="logType" :logo="logText" />
    </ElCol>
    <ElCol>
      <ElDropdown>
        <ElAvatar :size="50" :src="avatar" />
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="toHome">
              返回首页
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </ElCol>
  </ElRow>
</template>

<style scoped lang="scss">

</style>
