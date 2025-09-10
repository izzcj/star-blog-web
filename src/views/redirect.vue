<script setup lang="ts">
const route = useRoute();
const router = useRouter();
onBeforeMount(() => {
  const { params, query: rawQuery } = route;
  const { path } = params;
  let query = {
    ...rawQuery,
  };
  if (typeof path === 'string' && path.includes('?')) {
    const searchParams = new URLSearchParams(path.split('?')[1]);
    const parsedQuery: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      parsedQuery[key] = value;
    });
    query = {
      ...query,
      ...parsedQuery,
    };
  }
  router.replace({
    path: Array.isArray(path) ? path.join('/') : path,
    query,
  });
});
</script>

<template>
  <ElEmpty />
</template>
