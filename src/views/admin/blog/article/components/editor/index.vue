<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { Back, Check, Refresh } from '@element-plus/icons-vue';
import articleApiModule from '@/api/blog/article';
import tagApiModule from '@/api/blog/tag';
import { asyncRequest } from '@/utils/request-util';
import { successNotification } from '@/element-plus/notification';
import DataOptionType from '@/enums/data-option-type';

defineOptions({
  name: 'ArticleEditor',
});

const props = defineProps<{
  id?: string;
}>();

const router = useRouter();

const formRef = ref<FormInstance>();
const loading = ref(false);

const initialFormData: Omit<ArticleDetail, 'categoryName' | 'viewCount' | 'publishTime' | 'createByName' | 'tags'> & { tagIds: string[] } = {
  id: '',
  category: '',
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  top: false,
  recommended: false,
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
  category: [
    { required: true, message: '请选择分类', trigger: 'change' },
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
  ],
});

onMounted(() => {
  const blogId = props.id;
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
      router.push({ name: 'ArticleManagement' });
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置表单
 */
function resetForm() {
  articleForm.value = {
    ...initialFormData,
  };
}

/**
 * 返回
 */
function handleBack() {
  router.go(-1);
}
</script>

<template>
  <ElCard shadow="never" body-class="max-h-[80dvh] custom-scrollbar overflow-y-auto">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <ElButton :icon="Back" text @click="handleBack" />
        </div>
        <div>
          <ElButton
            type="primary"
            :icon="Check"
            :loading="loading"
            @click="submitForm"
          >
            保存
          </ElButton>
          <ElPopconfirm title="未保存数据将会丢失，确认清空吗？" placement="top" @confirm="resetForm">
            <template #reference>
              <ElButton :icon="Refresh" class="ml-2">
                清空
              </ElButton>
            </template>
          </ElPopconfirm>
        </div>
      </div>
    </template>

    <div>
      <ElForm
        ref="formRef"
        :model="articleForm"
        :rules="rules"
        label-width="80px"
        class="max-w-[80%] mx-auto"
      >
        <ElRow :guid="20">
          <ElCol :span="8">
            <!-- 标题 -->
            <ElFormItem label="标题" prop="title">
              <ElInput
                v-model="articleForm.title"
                placeholder="请输入标题"
                clearable
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <!-- 分类 -->
            <ElFormItem label="分类" prop="category">
              <VenusSelect
                v-model:value="articleForm.category"
                :option-type="DataOptionType.DICT"
                option-key="article-category"
                placeholder="请选择分类"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
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

        <ElRow :guid="20">
          <ElCol :span="8">
            <ElFormItem label="置顶" prop="top">
              <ElSwitch v-model="articleForm.top" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="推荐" prop="recommended">
              <ElSwitch v-model="articleForm.recommended" />
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
</template>

<style scoped lang="scss">
</style>
