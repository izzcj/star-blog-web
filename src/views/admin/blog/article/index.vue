<script setup lang="ts">
import { Delete, Edit, Position, Refresh, Search } from '@element-plus/icons-vue';
import type { ArticleQueryParams } from '@/views/admin/blog/article/metadata';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';
import { successNotification } from '@/element-plus/notification';
import DataOptionType from '@/enums/data-option-type';

defineOptions({
  name: 'ArticleManagementPage',
});

const router = useRouter();
const articleList = ref<Article[]>([]);
const queryParams = reactive<ArticleQueryParams>({
  category: '',
  title: '',
  status: '',
});

const loading = ref(false);
const total = ref(0);
const pagination = reactive({
  page: 1,
  size: 10,
});

onMounted(() => {
  loadArticleList();
});

watch(() => [pagination.page, pagination.size], () => {
  loadArticleList();
});

/**
 * 加载文章列表
 *
 */
function loadArticleList() {
  loading.value = true;
  asyncRequest<PageData<Article>>(articleApiModule.apis.fetchPage, {
    params: {
      type: queryParams.category || undefined,
      title: queryParams.title || undefined,
      status: queryParams.status || undefined,
      page: pagination.page,
      size: pagination.size,
    },
  })
    .then(res => {
      articleList.value = res.data.data;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 查询
 */
function handleQuery() {
  pagination.page = 1;
  loadArticleList();
}

/**
 * 重置查询条件
 */
function handleReset() {
  queryParams.title = '';
  queryParams.status = '';
  queryParams.category = '';
  loadArticleList();
}

/**
 * 编辑文章
 *
 * @param article 文章信息
 */
function editArticle(article: Article) {
  router.push({
    name: 'ArticleEdit',
    params: {
      id: article.id,
    },
  });
}

/**
 * 发布文章
 *
 * @param article 文章信息
 */
function publishArticle(article: Article) {
  asyncRequest(articleApiModule.apis.publish, {
    pathParams: { id: article.id },
  })
    .then(() => {
      successNotification('发布成功', '成功');
      loadArticleList();
    });
}

/**
 * 切换置顶状态
 *
 * @param article 文章信息
 */
const toggleTop = debounce((article: Article) => {
  asyncRequest(articleApiModule.apis.toggleTop, {
    pathParams: {
      id: article.id,
    },
  })
    .then(() => {
      successNotification(
        `${article.top ? '取消置顶' : '置顶'}成功`,
        '成功',
      );
      loadArticleList();
    });
}, 300);

/**
 * 切换推荐状态
 *
 * @param article 文章信息
 */
const toggleRecommend = debounce((article: Article) => {
  asyncRequest(articleApiModule.apis.toggleRecommend, {
    pathParams: {
      id: article.id,
    },
  })
    .then(() => {
      successNotification(
        `${article.recommended ? '取消推荐' : '推荐'}成功`,
        '成功',
      );
      loadArticleList();
    });
}, 300);

/**
 * 删除文章
 *
 * @param article 文章信息
 */
function deleteArticle(article: Article) {
  asyncRequest(articleApiModule.apis.delete, { pathParams: { id: article.id } }).then(() => {
    successNotification('删除成功', '成功');
    loadArticleList();
  });
}
</script>

<template>
  <div>
    <ElCard shadow="never" class="mb-3">
      <ElForm :model="queryParams">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
            <ElFormItem label="标题">
              <ElInput
                v-model="queryParams.title"
                placeholder="请输入标题"
                clearable
                @keyup.enter="handleQuery"
              />
            </ElFormItem>
            <ElFormItem label="分类">
              <VenusSelect
                v-model:value="queryParams.category"
                :option-type="DataOptionType.DICT"
                option-key="article-category"
                placeholder="请选择分类"
                clearable
              />
            </ElFormItem>
            <ElFormItem label="状态">
              <VenusSelect
                v-model:value="queryParams.status"
                :option-type="DataOptionType.ENUM"
                option-key="com.ale.starblog.admin.blog.enums.ArticleStatus"
                placeholder="请选择状态"
                clearable
              />
            </ElFormItem>
          </div>
          <div class="flex items-center gap-2">
            <ElFormItem>
              <ElButton :icon="Search" type="primary" @click="handleQuery">
                查询
              </ElButton>
              <ElButton :icon="Refresh" @click="handleReset">
                重置
              </ElButton>
            </ElFormItem>
          </div>
        </div>
      </ElForm>
    </ElCard>
    <ElCard shadow="never">
      <div class="mb-4 flex justify-end">
        <ElButton type="primary" @click="router.push('/admin/blog/article/create')">
          写文章
        </ElButton>
      </div>

      <ElTable v-loading="loading" :data="articleList" border max-height="600px">
        <ElTableColumn prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <ElTableColumn prop="categoryName" label="分类" width="100" />
        <ElTableColumn prop="viewCount" label="浏览量" width="100" />
        <ElTableColumn prop="createByName" label="作者" width="120" />
        <ElTableColumn prop="publishTime" label="发布时间" width="180" />
        <ElTableColumn label="是否置顶" width="100">
          <template #default="{ row }">
            <ElSwitch
              v-model="row.top"
              :disabled="row.status !== 'published'"
              @change="toggleTop(row)"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="是否推荐" width="100">
          <template #default="{ row }">
            <ElSwitch
              v-model="row.recommended"
              :disabled="row.status !== 'published'"
              @change="toggleRecommend(row)"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <ElButton
              :icon="Edit"
              link
              type="primary"
              size="small"
              @click="editArticle(row)"
            >
              修改
            </ElButton>
            <ElButton
              :icon="Position"
              link
              type="primary"
              size="small"
              :disabled="row.status === 'published'"
              @click="publishArticle(row)"
            >
              发布
            </ElButton>
            <ElPopconfirm title="确定删除吗？" placement="top" @confirm="deleteArticle(row)">
              <template #reference>
                <ElButton :icon="Delete" type="danger" link size="small">
                  删除
                </ElButton>
              </template>
            </ElPopconfirm>
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="flex justify-end mt-4">
        <ElPagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="total"
          :page-sizes="[10, 20, 50]"
          :hide-on-single-page="false"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
</style>
