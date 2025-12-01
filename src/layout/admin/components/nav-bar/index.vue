<script setup lang="ts">
import { useUserInfoStore } from '@/stores/user-info-store';
import CommonRouterPath from '@/enum/common-router-path';

defineOptions({
  name: 'AdminNavBar',
});

const userInfoStore = useUserInfoStore();
const avatar = ref(userInfoStore.avatar);
const router = useRouter();

/**
 * 进入首页
 */
function toHome() {
  router.push(CommonRouterPath.HOME);
}
</script>

<template>
  <ElCard shadow="never">
    <ElRow>
      <ElCol :span="2" :offset="22">
        <div class="cursor-pointer pt-[5px] venus-center">
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
        </div>
      </ElCol>
    </ElRow>
  </ElCard>
</template>

<style scoped lang="scss">

</style>
