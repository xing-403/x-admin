<script setup lang="ts">
import {
  listItems,
  removeItems,
  updateItemStatus,
  type TodoItemVo,
} from '#/api/todo';
import { useI18n } from '#/locales';
import { message } from 'antdv-next';
import TodoModal from '#/components/todo/actions/TodoModal.vue';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{ groupId: number | null }>();

const { t } = useI18n();

const items = ref<TodoItemVo[]>([]);
const itemLoading = ref(false);
const todoModalRef = ref<InstanceType<typeof TodoModal>>();

const doneCount = computed(() => items.value.filter((i) => i.status === '1').length);

async function loadItems(groupId: number) {
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

async function deleteItem(it: TodoItemVo) {
  try {
    await removeItems([it.todoId]);
    message.success(t('todo.save'));
    if (props.groupId != null) await loadItems(props.groupId);
  } catch {
    // 拦截器已提示
  }
}

async function toggleStatus(it: TodoItemVo, checked: boolean | string) {
  const next = typeof checked === 'string' ? checked : checked ? '1' : '0';
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
  <section class="panel item-panel">
    <header class="panel-header">
      <span class="panel-title">
        {{ t('todo.title') }}
        <span v-if="groupId" class="panel-sub">{{ doneCount }}/{{ items.length }}</span>
      </span>
      <a-button type="primary" :disabled="!groupId" @click="openItemModal()">
        + {{ t('todo.newItem') }}
      </a-button>
    </header>
    <div class="panel-body item-body">
      <a-spin :spinning="itemLoading">
        <a-empty v-if="!itemLoading && items.length === 0" :description="t('todo.emptyItem')" />
        <div v-else class="item-grid">
          <div
            v-for="it in items"
            :key="it.todoId"
            class="item-card"
            :class="{ done: it.status === '1' }"
          >
            <div class="item-top">
              <a-switch
                :checked="it.status === '1'"
                size="small"
                @change="(v) => toggleStatus(it, v)"
              />
              <span class="item-name" :class="{ done: it.status === '1' }">
                {{ it.todoName }}
              </span>
            </div>
            <p v-if="it.todoDesc" class="item-desc">{{ it.todoDesc }}</p>
            <div v-if="it.deadline" class="item-meta">
              {{ t('todo.deadline') }}：{{ it.deadline }}
            </div>
            <div class="item-actions">
              <a-button type="link" size="small" @click="openItemModal(it)">
                {{ t('todo.editItem') }}
              </a-button>
              <a-popconfirm :title="t('todo.deleteItemConfirm')" @confirm="deleteItem(it)">
                <a-button type="link" size="small" danger>
                  {{ t('common.delete') }}
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
    <TodoModal
      v-if="groupId != null"
      ref="todoModalRef"
      :group-id="groupId"
      @saved="loadItems(groupId!)"
    />
  </section>
</template>
<style lang="css" scoped>
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--background);
  border-radius: 8px;
  overflow: hidden;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #eee);
}
.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}
.panel-sub {
  margin-left: 8px;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted-foreground);
}
.panel-body {
  flex: 1;
  padding: 16px 20px;
  overflow: auto;
}
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.item-card {
  border: 1px solid var(--border, #eee);
  border-radius: 8px;
  padding: 14px 16px;
  background: var(--background);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow 0.2s;
}
.item-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.item-card.done {
  opacity: 0.6;
}
.item-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.item-name {
  font-weight: 600;
  color: var(--foreground);
}
.item-name.done {
  text-decoration: line-through;
}
.item-desc {
  margin: 0;
  font-size: 13px;
  color: var(--muted-foreground);
  line-height: 1.5;
}
.item-meta {
  font-size: 12px;
  color: var(--muted-foreground);
}
.item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  margin-top: auto;
}
</style>
