<script setup lang="ts">
import {
  listItems,
  removeItems,
  updateItemStatus,
  type TodoItemVo,
} from '#/api/todo';
import { useI18n } from '#/locales';
import { message, Modal } from 'antdv-next';
import TodoModal from '#/components/todo/actions/TodoModal.vue';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{ groupId: string | null }>();

const { t } = useI18n();

const items = ref<TodoItemVo[]>([]);
const itemLoading = ref(false);
const todoModalRef = ref<InstanceType<typeof TodoModal>>();

const doneCount = computed(() => items.value.filter((i) => i.status === '1').length);

async function loadItems(groupId: string) {
  itemLoading.value = true;
  try {
    items.value = await listItems(groupId);
  } catch {
    // 异常已由请求拦截器统一提示
  } finally {
    itemLoading.value = false;
  }
}

function openItemModal(it?: TodoItemVo) {
  if (!props.groupId) return;
  todoModalRef.value?.open(it);
}
const [deleteModal, DeleteContextHolder] = Modal.useModal()
async function deleteItem(it: TodoItemVo) {
  deleteModal.confirm({
    title: t('todo.deleteItemConfirm'),
    okText: t('todo.delete'),
    cancelText: t('todo.cancel'),
    onOk: async () => {
      await removeItems([it.todoId]);
      message.success(t('todo.delete'));
      if (props.groupId != null)
        await loadItems(props.groupId);
    },
  })

}

async function toggleStatus(it: TodoItemVo) {
  const next = it.status === '0' ? '1' : '0';
  try {
    await updateItemStatus(it.todoId, next);
    it.status = next;
    message.success(t(next === '1' ? 'todo.done' : 'todo.undone'));
  } catch {
    // 失败保留原状态，拦截器已提示
  }
}

watch(
  () => props.groupId,
  (id) => {
    if (id != null) {
      loadItems(id);
    } else {
      items.value = [];
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (props.groupId != null) loadItems(props.groupId);
});
</script>
<template>
  <a-card w-full>
    <template #title class="panel-header">
      <span>
        {{ t('todo.title') }}
        <span v-if="groupId" class="panel-sub">{{ doneCount }}/{{ items.length }}</span>
      </span>
    </template>
    <template #extra>
      <a-button type="primary" :disabled="!groupId" @click="openItemModal()">
        <template #icon>
          <SvgIcon name="PlusOutlined" />
        </template>
        {{ t('todo.newItem') }}
      </a-button>
    </template>
    <a-spin :spinning="itemLoading">
      <a-empty v-if="!itemLoading && items.length === 0" :description="t('todo.emptyItem')" />
      <a-row :gutter="[16, 24]" overflow-auto>
        <a-col v-for="it in [...items, ...items]" :xs="24" :sm="24" :md="24" :lg="24" :xl="12" :xxl="8">
          <a-card min-w-240px :key="it.todoId">
            <a-descriptions :column="1">
              <template #title>
                <a-typography-text :delete="it.status === '1'">
                  {{ it.todoName }}
                </a-typography-text>
              </template>
              <template #extra>
                <a-button @click="toggleStatus(it)" :color="it.status === '0' ? 'default' : 'green'" variant="link">
                  {{ it.status === '1' ? t('todo.done') : t('todo.undone') }}
                </a-button>
              </template>
              <a-descriptions-item label="描述">
                {{ it.todoDesc }}
              </a-descriptions-item>
              <a-descriptions-item label="截至">
                {{ it.deadline }}
              </a-descriptions-item>
            </a-descriptions>
            <template #actions>
              <a-button @click="openItemModal(it)" color="orange" variant="link">
                <template #icon>
                  <SvgIcon name="EditOutlined" />
                </template>
                {{ t('todo.editItem') }}
              </a-button>
              <a-button @click="deleteItem(it)" color="danger" variant="link">
                <template #icon>
                  <SvgIcon name="DeleteOutlined" />
                </template>
                {{ t('common.delete') }}
              </a-button>
            </template>
          </a-card>
        </a-col>

      </a-row>
    </a-spin>
  </a-card>

  <DeleteContextHolder></DeleteContextHolder>
  <TodoModal v-if="groupId != null" ref="todoModalRef" :group-id="groupId" @saved="loadItems(groupId!)" />
</template>
