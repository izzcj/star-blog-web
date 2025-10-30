<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { Refresh, UploadFilled } from '@element-plus/icons-vue';
import type { BlogDetail } from '../../metadata';
import blogApiModule from '@/api/blog/blog';
import { asyncRequest } from '@/utils/request-util';
import { successNotification } from '@/element-plus/notification';

defineOptions({
  name: 'BlogEditor',
});

const route = useRoute();
const router = useRouter();

const formRef = ref<FormInstance>();
const loading = ref(false);

// 博客表单数据
const blogForm = reactive({
  id: undefined as string | undefined,
  type: '',
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  tags: [] as string[],
});

// 表单验证规则
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
  ],
  summary: [
    { required: false, message: '请输入摘要', trigger: 'blur' },
    { max: 200, message: '摘要长度不能超过 200 个字符', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择分类', trigger: 'change' },
  ],
  content: [
    { required: true, message: '请输入博客内容', trigger: 'blur' },
  ],
});

onMounted(() => {
  const blogId = route.params.id as string;
  if (blogId) {
    fetchBlogDetail(blogId);
  }
});

/**
 * 获取博客详情
 *
 * @param id 博客ID
 */
function fetchBlogDetail(id: string) {
  loading.value = true;
  asyncRequest(blogApiModule.apis.detail, { pathParams: { id } })
    .then(res => {
      const blog = res.data as BlogDetail;
      blogForm.id = blog.id;
      blogForm.title = blog.title;
      blogForm.type = blog.type;
      blogForm.summary = blog.summary;
      blogForm.content = blog.content;
      blogForm.coverImage = blog.coverImage;
      // 简化处理标签
      blogForm.tags = blog.tags.map((tag: any) => tag.name || tag);
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 提交表单
 */
function submitForm() {
  if (!formRef.value) {
    return;
  }

  formRef.value.validate(valid => {
    if (valid) {
      saveBlog();
    }
  });
}

/**
 * 保存博客
 */
function saveBlog() {
  loading.value = true;
  asyncRequest(
    blogForm.id ? blogApiModule.apis.modify : blogApiModule.apis.create,
    {
      data: {
        ...blogForm,
        // 简化处理标签
        tags: blogForm.tags.map(tag => ({ name: tag })),
      },
    },
  )
    .then(() => {
      successNotification('保存成功', '成功');
      router.push('/admin/blog');
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置表单
 */
function resetForm() {
  if (formRef.value) {
    formRef.value.resetFields();
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <ElCard class="blog-card h-full flex flex-col flex-1">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">
            {{ blogForm.id ? '编辑博客' : '写博客' }}
          </span>
          <div>
            <ElButton
              type="primary"
              :icon="UploadFilled"
              :loading="loading"
              @click="submitForm"
            >
              发布
            </ElButton>
            <ElButton
              :icon="Refresh"
              class="ml-2"
              @click="resetForm"
            >
              重置
            </ElButton>
          </div>
        </div>
      </template>

      <div class="overflow-y-auto pb-[30px]">
        <ElForm
          ref="formRef"
          :model="blogForm"
          :rules="rules"
          label-position="top"
          label-width="80px"
          class="max-w-[80%] mx-auto"
        >
          <!-- 标题 -->
          <ElFormItem label="标题" prop="title">
            <ElInput
              v-model="blogForm.title"
              placeholder="请输入博客标题"
              clearable
            />
          </ElFormItem>

          <!-- 摘要 -->
          <ElFormItem label="摘要" prop="summary">
            <ElInput
              v-model="blogForm.summary"
              type="textarea"
              :rows="3"
              placeholder="请输入博客摘要"
              maxlength="200"
              show-word-limit
            />
          </ElFormItem>

          <!-- 标签 -->
          <ElFormItem label="分类" prop="type">
            <VenusSelect
              v-model:value="blogForm.type"
              option-type="dict"
              option-key="blog_type"
              placeholder="请选择分类"
            />
          </ElFormItem>

          <!-- 封面图 -->
          <ElFormItem label="封面图">
            <VenusUpload v-model:value="blogForm.coverImage" :multiple="false" :max="1" />
          </ElFormItem>

          <!-- 内容 -->
          <ElFormItem class="" label="内容" prop="content">
            <VenusMdEditor v-model:value="blogForm.content" />
          </ElFormItem>
        </ElForm>
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.blog-card {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 0;
  }
}
</style>
