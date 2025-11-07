<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import type { Blog } from '@/components/blog/metadata';
import blogApiModule from '@/api/blog/blog';
import { asyncRequest } from '@/utils/request-util';
import { successNotification } from '@/element-plus/notification';

defineOptions({
  name: 'BlogManagementPage',
});

const router = useRouter();
const blogList = ref<Blog[]>([]);
const loading = ref(false);
const total = ref(0);
const pagination = reactive({
  page: 1,
  size: 10,
});

onMounted(() => {
  fetchBlogList();
});

watch(() => [pagination.page, pagination.size], () => {
  fetchBlogList();
});

/**
 * 获取博客列表
 *
 */
function fetchBlogList() {
  loading.value = true;
  asyncRequest(blogApiModule.apis.fetchPage, {
    params: {
      page: pagination.page,
      size: pagination.size,
    },
  })
    .then(res => {
      blogList.value = res.data.data;
      total.value = Number(res.data.total);
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 编辑博客
 *
 * @param blog 博客信息
 */
function editBlog(blog: Blog) {
  router.push(`/admin/blog/edit/${blog.id}`);
}

/**
 * 发布博客
 *
 * @param blog 博客信息
 */
function publishBlog(blog: Blog) {
  asyncRequest(blogApiModule.apis.publish, {
    pathParams: { id: blog.id },
  })
    .then(() => {
      successNotification('博客发布成功', '成功');
      fetchBlogList();
    });
}

/**
 * 切换置顶状态
 *
 * @param blog 博客信息
 */
function toggleTop(blog: Blog) {
  asyncRequest(blogApiModule.apis.top, {
    pathParams: { id: blog.id },
  })
    .then(() => {
      successNotification(
        `${blog.top ? '取消置顶' : '置顶'}成功`,
        '成功',
      );
      fetchBlogList();
    });
}

/**
 * 删除博客
 *
 * @param blog 博客信息
 */
function deleteBlog(blog: Blog) {
  ElMessageBox.confirm(
    `确定要删除博客"${blog.title}"吗？此操作不可恢复！`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      asyncRequest(blogApiModule.apis.delete, {
        pathParams: { id: blog.id },
      })
        .then(() => {
          successNotification('删除成功', '成功');
          fetchBlogList();
        });
    })
    .catch(() => {
      // 用户取消删除
    });
}
</script>

<template>
  <div class="blog-management-page">
    <ElCard class="min-h-full">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">博客管理</span>
          <ElButton type="primary" @click="router.push('/admin/blog/create')">
            写博客
          </ElButton>
        </div>
      </template>

      <ElTable
        v-loading="loading"
        :data="blogList"
        stripe
        class="w-full"
      >
        <ElTableColumn prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <ElTableColumn prop="typeName" label="类型" width="100" />
        <ElTableColumn prop="viewCount" label="浏览量" width="100" />
        <ElTableColumn prop="createByName" label="作者" width="120" />
        <ElTableColumn prop="publishTime" label="发布时间" width="180" />
        <ElTableColumn label="状态" width="100">
          <template #default="{ row }">
            <ElTag v-if="row.top" type="danger">
              置顶
            </ElTag>
            <ElTag v-else type="info">
              普通
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <ElButton link type="primary" size="small" @click="editBlog(row)">
              修改
            </ElButton>
            <ElButton
              link
              type="primary"
              size="small"
              :disabled="row.status === 'PUBLISHED'"
              @click="publishBlog(row)"
            >
              发布
            </ElButton>
            <ElButton
              link
              :type="row.top ? 'warning' : 'primary'"
              size="small"
              @click="toggleTop(row)"
            >
              {{ row.top ? '取消置顶' : '置顶' }}
            </ElButton>
            <ElButton link type="danger" size="small" @click="deleteBlog(row)">
              删除
            </ElButton>
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
