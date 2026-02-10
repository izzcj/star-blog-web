<script setup lang="ts">
defineOptions({
  name: 'ArticleSkeleton',
});

withDefaults(defineProps<Props>(), {
  isFeatured: false,
});

interface Props {
  isFeatured?: boolean;
}
</script>

<template>
  <div
    class="neumorphic rounded-lg md:rounded-xl overflow-hidden" :class="[
      isFeatured ? 'featured-card' : '',
    ]"
  >
    <div
      class="flex" :class="[
        isFeatured ? 'flex-col md:flex-row' : 'flex-col',
      ]"
    >
      <!-- 封面骨架 -->
      <div
        class="animate-skeleton" :class="[
          isFeatured ? 'w-full md:w-[55%] aspect-video md:aspect-auto md:min-h-[300px]' : 'aspect-video',
        ]"
      />

      <!-- 内容骨架 -->
      <div
        class="p-4 md:p-6 space-y-3 flex flex-col" :class="[
          isFeatured ? 'md:w-[45%]' : 'flex-1',
        ]"
      >
        <!-- 标题骨架 -->
        <div
          class="animate-skeleton rounded-md" :class="[
            isFeatured ? 'h-7 md:h-8' : 'h-6',
          ]"
        />
        <div
          class="animate-skeleton rounded-md" :class="[
            isFeatured ? 'h-7 md:h-8 w-3/4' : 'h-6 w-5/6',
          ]"
        />

        <!-- 摘要骨架 -->
        <div class="space-y-2 pt-1">
          <div
            class="animate-skeleton rounded-md" :class="[
              isFeatured ? 'h-4 md:h-5' : 'h-4',
            ]"
          />
          <div
            class="animate-skeleton rounded-md" :class="[
              isFeatured ? 'h-4 md:h-5 w-11/12' : 'h-4 w-5/6',
            ]"
          />
          <div
            v-if="isFeatured"
            class="animate-skeleton rounded-md h-4 md:h-5 w-4/5"
          />
        </div>

        <!-- 底部信息骨架 -->
        <div class="flex items-center gap-3 md:gap-4 pt-2 mt-auto">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full animate-skeleton" />
            <div class="w-16 h-4 animate-skeleton rounded-md" />
          </div>
          <div class="w-16 h-4 animate-skeleton rounded-md" />
          <div class="w-20 h-4 animate-skeleton rounded-md" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
