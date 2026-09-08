<script setup lang="ts">
import {
  listGroups,
  listItems,
  updateItemStatus,
  type TodoGroupVo,
  type TodoItemVo,
} from '#/api/todo';
import { useI18n } from '#/locales';
import { message } from 'antdv-next';
import { computed, onMounted, ref, watch } from 'vue';

const { t } = useI18n();


const groups = ref<TodoGroupVo[]>([]);
const groupTabItems = computed(() => groups.value.map(item => ({ key: item.groupId, label: item.groupName })))
const selectedGroupId = ref<string>('');
const groupLoading = ref(false);
const items = ref<TodoItemVo[]>([]);
const itemLoading = ref(false);

function loadTodoList() {
  itemLoading.value = true
  listItems(selectedGroupId.value).then((res) => {
    items.value = res
  }).finally(() => {
    itemLoading.value = false
  })
}

async function loadGroups() {
  groupLoading.value = true;
  listGroups().then((res) => {
    groups.value = res
    if (!selectedGroupId.value && res.length) {
      selectedGroupId.value = res[0].groupId
    }
  }).finally(() => {
    groupLoading.value = false;
  })
}

async function toggle(todoId: string, checked: boolean) {
  const next = checked ? '1' : '0';
  try {
    await updateItemStatus(todoId, next);
    message.success(t(next === '1' ? 'todo.done' : 'todo.undone'));
    loadTodoList()
  } catch {
    // 失败保留原状态，拦截器已提示
  }
}
watch(selectedGroupId, loadTodoList)


onMounted(loadGroups);
</script>

<template>
  <a-card :loading="itemLoading || groupLoading" h-346px
    :styles="{ body: { padding: '0px' }, header: { padding: '0 10px' } }" :tab-list="groupTabItems"
    :active-tab-key="selectedGroupId" :tab-props="{ size: 'medium' }" @tab-change="(key) => selectedGroupId = key">
    <a-empty mt-10 v-if="!itemLoading && items.length === 0" :description="t('todo.emptyItem')" />
    <a-listy :items="items" :row-key="(item: TodoItemVo) => item.todoId" :height="300">
      <template #itemRender="item">
        <a-flex gap="small" align="center" justify="space-between">
          <a-typography-text>
            {{ item.todoName }}
          </a-typography-text>
          <a-switch :checked="item.status" checked-value="1" un-checked-value="0"
            @change="(checked: boolean) => toggle(item.todoId, checked)" />
        </a-flex>
      </template>
    </a-listy>
  </a-card>
</template>
