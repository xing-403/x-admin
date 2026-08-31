<script setup lang="ts">
import TodoGroup from '#/components/todo/TodoGroup.vue';
import TodoList from '#/components/todo/TodoList.vue';
import { ref } from 'vue';

defineOptions({ name: 'Todo' });

/** 当前选中的分组 ID，由 TodoGroup 通过 v-model 回写 */
const selectGroupId = ref<string | null>(null);
</script>

<template>
  <Page>
    <div class="todo-wrap">
      <div class="todo-group-col">
        <TodoGroup v-model="selectGroupId" />
      </div>
      <div class="todo-list-col">
        <TodoList :group-id="selectGroupId" />
      </div>
    </div>
  </Page>
</template>

<style lang="css" scoped>
.todo-wrap {
  display: flex;
  gap: 16px;
  min-height: 100%;
  align-items: stretch;
}
.todo-group-col {
  width: 300px;
  flex-shrink: 0;
}
.todo-list-col {
  flex: 1;
  min-width: 0;
}
</style>
