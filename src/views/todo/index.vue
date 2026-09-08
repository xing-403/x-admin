<script setup lang="ts">
import TodoGroup from '#/components/todo/TodoGroup.vue';
import TodoList from '#/components/todo/TodoList.vue';
import { ref } from 'vue';

defineOptions({ name: 'Todo' });


const selectGroupId = ref<string | null>(null);
</script>

<template>
  <a-row :gutter="[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]">
    <a-col :xs="24" :md="12" :lg="8" :xl="6" :span="4">
      <TodoGroup v-model="selectGroupId" />
    </a-col>
    <a-col :xs="24" :md="12" :lg="16" :xl="18" :span="20">
      <TodoList :group-id="selectGroupId" />
    </a-col>
  </a-row>
</template>
