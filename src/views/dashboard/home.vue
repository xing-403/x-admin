<script lang="ts" setup>
import TodoQuickPanel from '#/components/todo/TodoQuickPanel.vue';

</script>

<template>
  <a-row :gutter="[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]">
    <a-col :xs="24" :sm="12" :md="12" :lg="8" :span="6">
      <TodoQuickPanel />
    </a-col>
  </a-row>
</template>
