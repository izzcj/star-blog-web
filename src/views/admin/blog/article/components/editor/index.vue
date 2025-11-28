<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { Check, Refresh } from '@element-plus/icons-vue';
import type { ArticleDetail } from '@/components/article/metadata';
import articleApiModule from '@/api/blog/article';
import tagApiModule from '@/api/blog/tag';
import { asyncRequest } from '@/utils/request-util';
import { successNotification } from '@/element-plus/notification';
import DataOptionType from '@/enum/data-option-type';

defineOptions({
  name: 'ArticleEditor',
});

const route = useRoute();
const router = useRouter();

const formRef = ref<FormInstance>();
const loading = ref(false);

// 修改初始表单数据结构，使 tags 只存储 ID 数组
const initialFormData: Omit<ArticleDetail, 'typeName' | 'viewCount' | 'top' | 'publishTime' | 'createByName' | 'tags'> & { tagIds: string[] } = {
  id: '',
  type: '',
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  tagIds: [],
};

// 文章表单数据
const articleForm = ref({
  ...initialFormData,
});

const tagOptions = ref<DataOption[]>([]);

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
    { required: true, message: '请输入文章内容', trigger: 'blur' },
  ],
});

onMounted(() => {
  const blogId = route.params.id as string;
  if (blogId) {
    fetchArticleDetail(blogId);
  }
  loadTagOptions();
});

/**
 * 加载标签选项
 */
function loadTagOptions() {
  asyncRequest<DataOption[]>(tagApiModule.apis.fetchOptions).then(res => {
    tagOptions.value = res.data;
  });
}

/**
 * 获取文章详情
 *
 * @param id 文章ID
 */
function fetchArticleDetail(id: string) {
  loading.value = true;
  asyncRequest<ArticleDetail>(articleApiModule.apis.fetchDetail, { pathParams: { id } })
    .then(res => {
      // 转换 tags 数据，只保留 ID
      articleForm.value = {
        ...res.data,
        tagIds: res.data.tags.map(tag => tag.id as string),
      };
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
      saveArticle();
    }
  });
}

/**
 * 保存文章
 */
function saveArticle() {
  loading.value = true;
  console.log('articleForm:', articleForm);
  asyncRequest(
    articleForm.value.id ? articleApiModule.apis.modify : articleApiModule.apis.create,
    {
      data: {
        ...articleForm.value,
      },
    },
  )
    .then(() => {
      successNotification('保存成功', '成功');
      router.push('/admin/blog/article');
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
    <ElCard shadow="never" class="blog-card h-full flex flex-col flex-1">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">
            {{ articleForm.id ? '编辑文章' : '写文章' }}
          </span>
          <div>
            <ElButton
              type="primary"
              :icon="Check"
              :loading="loading"
              @click="submitForm"
            >
              保存
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
          :model="articleForm"
          :rules="rules"
          label-position="top"
          label-width="80px"
          class="max-w-[80%] mx-auto"
        >
          <ElRow :guid="20" justify="space-between">
            <ElCol :span="7">
              <!-- 标题 -->
              <ElFormItem label="标题" prop="title">
                <ElInput
                  v-model="articleForm.title"
                  placeholder="请输入标题"
                  clearable
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="7">
              <!-- 分类 -->
              <ElFormItem label="分类" prop="type">
                <VenusSelect
                  v-model:value="articleForm.type"
                  :option-type="DataOptionType.DICT"
                  option-key="article-type"
                  placeholder="请选择分类"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="7">
              <!-- 标签 -->
              <ElFormItem label="标签" prop="tags">
                <VenusSelect
                  v-model:value="articleForm.tagIds"
                  :option-type="DataOptionType.CONST"
                  :option-key="tagOptions"
                  placeholder="请选择标签"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                />
              </ElFormItem>
            </ElCol>
          </ElRow>

          <!-- 摘要 -->
          <ElFormItem label="摘要" prop="summary">
            <ElInput
              v-model="articleForm.summary"
              type="textarea"
              :rows="3"
              placeholder="请输入摘要"
              maxlength="200"
              show-word-limit
            />
          </ElFormItem>

          <!-- 封面图 -->
          <ElFormItem label="封面图">
            <VenusUpload v-model:value="articleForm.coverImage" />
          </ElFormItem>

          <!-- 内容 -->
          <ElFormItem class="" label="内容" prop="content">
            <VenusMdEditor v-model:value="articleForm.content" />
          </ElFormItem>
        </ElForm>
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.blog-card {
  :deep(.el-card) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 0;
  }
}
</style>
