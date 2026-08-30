<script setup lang="ts">
import { listGroups, removeGroups, type TodoGroupVo } from '#/api/todo';
import { useI18n } from '#/locales';
import { message } from 'antdv-next';
import TodoGroupModal from '#/components/todo/actions/TodoGroupModal.vue';
import { onMounted, ref } from 'vue';

const { t } = useI18n();
const emits = defineEmits<{ saved: [] }>();
const groupLoading = ref(false);
const groups = ref<TodoGroupVo[]>([]);
const selectedGroupId = defineModel<number | null>();

const todoGroupModalRef = ref<InstanceType<typeof TodoGroupModal>>();

function openGroupModal(g?: TodoGroupVo) {
  todoGroupModalRef.value?.open(g);
}

async function selectGroup(g: TodoGroupVo) {
  selectedGroupId.value = g.groupId;
}

async function deleteGroup(g: TodoGroupVo) {
  try {
    await removeGroups([g.groupId]);
    message.success(t('todo.save'));
    if (selectedGroupId.value === g.groupId) {
      selectedGroupId.value = null;
    }
    await loadGroups();
  } catch {
    // 拦截器已提示
  }
}

async function loadGroups() {
  groupLoading.value = true;
  try {
    groups.value = await listGroups();
    const find = groups.value.find((item) => item.groupId === selectedGroupId.value);
    if (!find && groups.value.length) {
      selectedGroupId.value = groups.value[0].groupId;
    } else if (!find) {
      selectedGroupId.value = null;
    }
  } catch {
    // 异常已由请求拦截器统一提示
  } finally {
    groupLoading.value = false;
  }
}

onMounted(() => {
  loadGroups();
});
</script>
<template>
  <a-spin :spinning="groupLoading">
    <a-card :title="t('todo.groupTitle')">
      <template #extra>
        <a-button type="primary" size="small" @click="openGroupModal()">
          <template #icon>
            <SvgIcon :name="'ep:plus'" />
          </template>
          {{ t('todo.newGroup') }}
        </a-button>
      </template>
      <a-empty v-if="!groupLoading && groups.length === 0" :description="t('todo.emptyGroup')" />
      <div v-else class="group-list">
        <div v-for="group in groups" :key="group.groupId" class="group-list__item"
          :class="[selectedGroupId === group.groupId && 'selected-group']" @click="selectGroup(group)">
          <a-flex justify="space-between" align="center" gap="small">
            <a-flex flex="1" align="center">
              <span class="group-name">{{ group.groupName }}</span>
            </a-flex>
            <a-flex>
              <a-button type="text" size="small" @click.stop="openGroupModal(group)">
                {{ t('todo.editGroup') }}
              </a-button>
              <a-popconfirm :title="t('todo.deleteGroupConfirm')" @confirm="deleteGroup(group)">
                <a-button type="text" size="small" danger>
                  {{ t('common.delete') }}
                </a-button>
              </a-popconfirm>
            </a-flex>
          </a-flex>
        </div>
      </div>
    </a-card>
  </a-spin>
  <TodoGroupModal ref="todoGroupModalRef" @saved="loadGroups" />
</template>
<style lang="css" scoped>
.group-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.group-list__item {
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.group-list__item:hover {
  background: var(--muted);
}

.group-list__item.selected-group {
  background: var(--primary);
}

.group-name {
  font-weight: 500;
  color: var(--foreground);
}
</style>
