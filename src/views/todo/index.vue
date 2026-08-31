<script setup lang="ts">
import TodoGroup from '#/components/todo/TodoGroup.vue';
import TodoList from '#/components/todo/TodoList.vue';
import { useSystemStore } from '#/store/modules/system';
import { ref } from 'vue';

defineOptions({ name: 'Todo' });

const systemStore = useSystemStore()

const selectGroupId = ref<string | null>(null);
</script>

<template>
  <Page>
    <a-flex gap="small" :vertical="systemStore.isXs || systemStore.isSm">
      <TodoGroup v-model="selectGroupId" />
      <TodoList :group-id="selectGroupId" />
    </a-flex>
  </Page>
</template>
