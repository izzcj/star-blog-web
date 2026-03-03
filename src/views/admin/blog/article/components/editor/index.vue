<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { Back, Check, Refresh, Setting } from '@element-plus/icons-vue';
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
const drawerVisible = ref(false);

const initialFormData: Omit<ArticleDetail, 'categoryName' | 'viewCount' | 'publishTime' | 'createBy' | 'createByName' | 'tags'> & { tagIds: string[] } = {
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
  <div>
    <ElForm
      ref="formRef"
      :model="articleForm"
      :rules="rules"
      hide-required-asterisk
    >
      <!-- 顶部工具栏 -->
      <div class="flex py-4 pr-5 items-center justify-between">
        <div class="flex items-center">
          <ElButton :icon="Back" text circle @click="handleBack" />
          <ElFormItem prop="title" class="!mb-0 !rounded-3xl">
            <ElInput
              v-model="articleForm.title"
              class="article-title-input !w-lg"
              placeholder="输入文章标题..."
              size="large"
            />
          </ElFormItem>
        </div>
        <div class="flex items-center gap-2">
          <ElButton
            :icon="Setting"
            round
            @click="drawerVisible = true"
          >
            文章设置
          </ElButton>
          <ElPopconfirm title="未保存数据将会丢失，确认清空吗？" placement="bottom-end" @confirm="resetForm">
            <template #reference>
              <ElButton :icon="Refresh" round>
                清空
              </ElButton>
            </template>
          </ElPopconfirm>
          <ElButton
            type="primary"
            :icon="Check"
            :loading="loading"
            round
            @click="submitForm"
          >
            保存
          </ElButton>
        </div>
      </div>

      <!-- 编辑器主体区域 -->
      <ElFormItem prop="content">
        <VenusByteMdEditor v-model:value="articleForm.content" />
      </ElFormItem>

      <!-- 文章设置抽屉 -->
      <ElDrawer
        v-model="drawerVisible"
        title="文章设置"
        direction="rtl"
        size="600px"
        :append-to-body="true"
      >
        <div class="py-0 px-4">
          <ElRow :guid="20">
            <ElCol :span="12">
              <!-- 分类 -->
              <ElFormItem label="分类" prop="category" class="w-11/12">
                <VenusSelect
                  v-model:value="articleForm.category"
                  :option-type="DataOptionType.DICT"
                  option-key="article-category"
                  placeholder="请选择分类"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <!-- 标签 -->
              <ElFormItem label="标签" prop="tags" class="w-11/12">
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

          <!-- 封面图 -->
          <ElFormItem label="封面" prop="coverImage">
            <VenusUpload v-model:value="articleForm.coverImage" />
          </ElFormItem>

          <!-- 摘要 -->
          <ElFormItem label="摘要" prop="summary">
            <ElInput
              v-model="articleForm.summary"
              type="textarea"
              :rows="4"
              placeholder="请输入文章摘要..."
              maxlength="200"
              show-word-limit
            />
          </ElFormItem>
        </div>
      </ElDrawer>
    </ElForm>
  </div>
</template>

<style scoped lang="scss">
.article-title-input {
  :deep(.el-input__wrapper) {
    border-radius: 30px;
  }
}
</style>
