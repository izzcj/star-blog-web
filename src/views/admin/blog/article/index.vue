<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Delete, Edit, Position } from '@element-plus/icons-vue';
import type { Article } from '@/components/article/metadata';
import articleApiModule from '@/api/blog/article';
import { asyncRequest } from '@/utils/request-util';
import { successNotification } from '@/element-plus/notification';

defineOptions({
  name: 'ArticleManagementPage',
});

const router = useRouter();
const articleList = ref<Article[]>([]);
const loading = ref(false);
const total = ref(0);
const pagination = reactive({
  page: 1,
  size: 10,
});

onMounted(() => {
  fetchArticleList();
});

watch(() => [pagination.page, pagination.size], () => {
  fetchArticleList();
});

/**
 * 获取文章列表
 *
 */
function fetchArticleList() {
  loading.value = true;
  asyncRequest(articleApiModule.apis.fetchPage, {
    params: {
      page: pagination.page,
      size: pagination.size,
    },
  })
    .then(res => {
      articleList.value = res.data.data;
      total.value = Number(res.data.total);
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 编辑文章
 *
 * @param article 文章信息
 */
function editArticle(article: Article) {
  router.push(`/admin/blog/article/edit/${article.id}`);
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
      fetchArticleList();
    });
}

/**
 * 切换置顶状态
 *
 * @param article 文章信息
 */
function toggleTop(article: Article) {
  asyncRequest(articleApiModule.apis.top, {
    pathParams: { id: article.id },
  })
    .then(() => {
      successNotification(
        `${article.top ? '取消置顶' : '置顶'}成功`,
        '成功',
      );
      fetchArticleList();
    });
}

/**
 * 删除文章
 *
 * @param article 文章信息
 */
function deleteArticle(article: Article) {
  asyncRequest(articleApiModule.apis.delete, { pathParams: { id: article.id } }).then(() => {
    successNotification('删除成功', '成功');
    fetchArticleList();
  });
}
</script>

<template>
  <div class="blog-management-page">
    <ElCard class="min-h-full">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">文章管理</span>
          <ElButton type="primary" @click="router.push('/admin/blog/article/create')">
            写文章
          </ElButton>
        </div>
      </template>

      <ElTable
        v-loading="loading"
        :data="articleList"
        stripe
        class="w-full"
      >
        <ElTableColumn prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <ElTableColumn prop="typeName" label="类型" width="100" />
        <ElTableColumn prop="viewCount" label="浏览量" width="100" />
        <ElTableColumn prop="createByName" label="作者" width="120" />
        <ElTableColumn prop="publishTime" label="发布时间" width="180" />
        <ElTableColumn label="是否置顶" width="100">
          <template #default="{ row }">
            <ElSwitch
              v-model="row.top"
              :disabled="row.status === 'PUBLISHED'"
              @change="toggleTop(row)"
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
              :disabled="row.status === 'PUBLISHED'"
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
.blog-management-page {
  :deep(.el-card__body) {
    padding: 20px;
  }
}
</style>
