<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import DataOptionType from '@/enums/data-option-type';
import PasswordStrength from '@/components/password-strength/index.vue';
import VenusAvatar from '@/components/venus/venus-avatar/index.vue';
import VenusSelect from '@/components/venus/venus-select/index.vue';
import { errorNotification, successNotification } from '@/element-plus/notification';
import userProfileApiModule from '@/api/user-profile';
import { useUserInfoStore } from '@/stores/user-info-store';
import { asyncRequest } from '@/utils/request-util';

defineOptions({
  name: 'UserInfo',
});

// Store
const userInfoStore = useUserInfoStore();

// 当前激活的Tab
const activeTab = ref('profile');

// 个人信息表单数据
interface ProfileFormData {
  avatar: string;
  nickname: string;
  sex: string;
  mobile: string;
  email: string;
  remark: string;
}

const formData = reactive<ProfileFormData>({
  avatar: '',
  nickname: '',
  sex: '',
  mobile: '',
  email: '',
  remark: '',
});

// 初始数据副本（用于重置）
let initialFormData: ProfileFormData = {
  avatar: '',
  nickname: '',
  sex: '',
  mobile: '',
  email: '',
  remark: '',
};

// 密码表单数据
interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const passwordForm = reactive<PasswordFormData>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// 加载状态
const loading = ref(false);
const passwordLoading = ref(false);

// 表单引用
const profileFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();

// 个人信息验证规则
const profileRules: FormRules<ProfileFormData> = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为2-20个字符', trigger: 'blur' },
  ],
  mobile: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  email: [
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
  remark: [{ max: 200, message: '简介不能超过200个字符', trigger: 'blur' }],
};

// 密码验证规则
const passwordRules: FormRules<PasswordFormData> = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Z])(?=.*\d)[A-Z\d@$!%*?&]{6,}$/i,
      message: '密码必须包含字母和数字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

/**
 * 加载用户信息
 */
async function loadUserInfo() {
  const userInfo = userInfoStore;
  Object.assign(formData, {
    avatar: userInfo.avatar,
    nickname: userInfo.nickname,
    sex: userInfo.sex,
    mobile: userInfo.mobile || '',
    email: userInfo.email,
    remark: userInfo.remark,
  });

  // 保存初始数据副本
  initialFormData = JSON.parse(JSON.stringify(formData));
}

/**
 * 保存个人信息
 */
async function handleSaveProfile() {
  if (!profileFormRef.value) {
    return;
  }

  try {
    await profileFormRef.value.validate();
    loading.value = true;

    await asyncRequest(userProfileApiModule.apis.modify, {
      data: {
        nickname: formData.nickname,
        sex: formData.sex,
        mobile: formData.mobile,
        email: formData.email,
        avatar: formData.avatar,
        remark: formData.remark,
      },
    });

    successNotification('个人信息保存成功', '成功');

    // 刷新Store中的用户信息
    await userInfoStore.fetchUserInfo();

    // 更新初始数据副本
    initialFormData = JSON.parse(JSON.stringify(formData));
  } catch (error: any) {
    console.error('保存个人信息失败:', error);
    errorNotification('保存个人信息失败', '错误');
  } finally {
    loading.value = false;
  }
}

/**
 * 重置个人信息表单
 */
function handleResetProfile() {
  Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
  profileFormRef.value?.clearValidate();
}

/**
 * 修改密码
 */
async function handleChangePassword() {
  if (!passwordFormRef.value) {
    return;
  }

  try {
    await passwordFormRef.value.validate();
    passwordLoading.value = true;

    await asyncRequest(userProfileApiModule.apis.changePassword, {
      data: {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      },
    });

    successNotification('密码修改成功', '成功');

    // 清空密码表单
    handleResetPassword();
  } catch (error: any) {
    console.error('修改密码失败:', error);
    errorNotification('修改密码失败', '错误');
  } finally {
    passwordLoading.value = false;
  }
}

/**
 * 重置密码表单
 */
function handleResetPassword() {
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  passwordFormRef.value?.clearValidate();
}

// 页面加载时获取用户信息
onMounted(() => {
  loadUserInfo();
});
</script>

<template>
  <div class="mx-auto">
    <ElTabs v-model="activeTab">
      <!-- 个人信息Tab -->
      <ElTabPane label="个人信息" name="profile">
        <!-- 头像 -->
        <div class="mb-2">
          <div class="flex flex-col items-center py-4">
            <VenusAvatar
              v-model:value="formData.avatar"
              :size="120"
              mode="edit"
              :enable-crop="true"
              :name="formData.nickname"
            />
            <div class="mt-4 text-lg font-semibold text-gray-700">
              {{ formData.nickname || '未设置昵称' }}
            </div>
          </div>
        </div>

        <!-- 表单区域 - 单列布局 -->
        <ElForm
          ref="profileFormRef"
          :model="formData"
          :rules="profileRules"
          label-width="80px"
        >
          <ElFormItem label="昵称" prop="nickname">
            <ElInput v-model="formData.nickname" placeholder="请输入昵称" />
          </ElFormItem>
          <ElFormItem label="性别" prop="sex">
            <VenusSelect
              v-model:value="formData.sex"
              :option-type="DataOptionType.DICT"
              option-key="sex"
            />
          </ElFormItem>
          <ElFormItem label="手机号" prop="mobile">
            <ElInput v-model="formData.mobile" placeholder="请输入手机号" />
          </ElFormItem>
          <ElFormItem label="邮箱" prop="email">
            <ElInput v-model="formData.email" placeholder="请输入邮箱" />
          </ElFormItem>
          <ElFormItem label="简介" prop="remark">
            <ElInput
              v-model="formData.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入个人简介"
            />
          </ElFormItem>

          <!-- 操作按钮 - 右对齐 -->
          <ElRow>
            <ElCol :span="24" class="text-right">
              <ElButton @click="handleResetProfile">
                重置
              </ElButton>
              <ElButton type="primary" :loading="loading" @click="handleSaveProfile">
                保存
              </ElButton>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElTabPane>

      <!-- 修改密码Tab -->
      <ElTabPane label="修改密码" name="password">
        <ElForm
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="100px"
          class="max-w-[600px] my-0 mx-auto"
        >
          <ElFormItem label="旧密码" prop="oldPassword">
            <ElInput
              v-model="passwordForm.oldPassword"
              type="password"
              show-password
              placeholder="请输入旧密码"
            />
          </ElFormItem>

          <ElFormItem label="新密码" prop="newPassword">
            <ElInput
              v-model="passwordForm.newPassword"
              type="password"
              show-password
              placeholder="请输入新密码"
            />
            <!-- 密码强度指示器 -->
            <PasswordStrength :password="passwordForm.newPassword" />
          </ElFormItem>

          <ElFormItem label="确认密码" prop="confirmPassword">
            <ElInput
              v-model="passwordForm.confirmPassword"
              type="password"
              show-password
              placeholder="请再次输入新密码"
            />
          </ElFormItem>

          <ElRow>
            <ElCol :span="24" class="text-right">
              <ElButton @click="handleResetPassword">
                重置
              </ElButton>
              <ElButton
                type="primary"
                :loading="passwordLoading"
                @click="handleChangePassword"
              >
                确认修改
              </ElButton>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped lang="scss">
</style>
