<script setup lang="ts">
import { listGroupTree, removeGroups, updateGroup, type TodoGroupVo } from '#/api/todo';
import { useI18n } from '#/locales';
import { message } from 'antdv-next';
import TodoGroupModal from '#/components/todo/actions/TodoGroupModal.vue';
import { onMounted, ref } from 'vue';
import type { TreeEmits } from 'antdv-next/dist/tree/Tree';

const { t } = useI18n();
const groups = ref<TodoGroupVo[]>([]);
const selectedGroupId = defineModel<string | null>({ required: true });

const todoGroupModalRef = ref<InstanceType<typeof TodoGroupModal>>();

/** 平铺分组树 */
function flatten(list: TodoGroupVo[]): TodoGroupVo[] {
  const out: TodoGroupVo[] = [];
  const walk = (l: TodoGroupVo[]) => {
    for (const g of l) {
      out.push(g);
      if (g.children) {
        walk(g.children);
      }
    }
  };
  walk(list);
  return out;
}

function openGroupModal(g?: TodoGroupVo, parent?: TodoGroupVo | null) {
  todoGroupModalRef.value?.open(g, parent);
}

async function deleteGroup(g: TodoGroupVo) {
  if (g.children && g.children.length) {
    message.warning(t('todo.deleteGroupHasChildren'));
    return;
  }
  removeGroups([g.groupId]).then(() => {
    message.success(t('todo.save'));
    if (selectedGroupId.value === g.groupId) {
      selectedGroupId.value = null;
    }
    loadGroups()
  })
}

/** 展开指定分组的所有祖先，保证新建的节点可见 */
function expandAncestors(targetId: string) {
  const path: string[] = [];
  const walk = (l: TodoGroupVo[], ancestors: string[]): boolean => {
    for (const g of l) {
      if (g.groupId === targetId) {
        path.push(...ancestors);
        return true;
      }
      if (walk(g.children ?? [], [...ancestors, g.groupId])) {
        return true;
      }
    }
    return false;
  };
  walk(groups.value, []);
}

async function loadGroups(targetId?: string) {
  groups.value = await listGroupTree();
  const all = flatten(groups.value);
  const find = all.find((item) => item.groupId === selectedGroupId.value);
  if (!find && all.length) {
    selectedGroupId.value = all[0].groupId;
  } else if (!find) {
    selectedGroupId.value = null;
  }
  if (targetId) {
    expandAncestors(targetId);
  }
}
const handleDrag: TreeEmits['drop'] = (info) => {
  const group = info.dragNode
  const parentGroup = info.node
  const orderNum = info.dropPosition
  const parentGroupId = (info.dropToGap ? parentGroup.parentGroupId : parentGroup.groupId).toString()
  const { groupId, groupName } = group

  updateGroup({ groupId, groupName, parentGroupId, orderNum }).then(() => {
    loadGroups()
  })
}
function handleChangeTodoGroupName(groupId: string, groupName: string) {
  const group = flatten(groups.value).find(item => item.groupId === groupId)
  if (group && group.groupName !== groupName) {
    updateGroup({ groupId, groupName }).then(() => {
      loadGroups()
    });
  }
}
function handleSelectKey(keys: any[]) {
  console.log(keys)
  if (keys.length) {
    selectedGroupId.value = keys[0]
  }
}
onMounted(() => {
  loadGroups();
});
</script>
<template>
  <a-card :title="t('todo.groupTitle')" :styles="{ body: { padding: '5px' } }">
    <template #extra>
      <a-button type="primary" size="small" @click="openGroupModal()">
        <template #icon>
          <SvgIcon name="PlusOutlined" />
        </template>
        {{ t('todo.newGroup') }}
      </a-button>
    </template>
    <a-empty v-if="groups.length === 0" :description="t('todo.emptyGroup')" />
    <a-tree v-else draggable block-node :fieldNames="{ key: 'groupId' }"
      :selected-keys="selectedGroupId ? [selectedGroupId] : []" :tree-data="groups" @drop="handleDrag"
      @select="handleSelectKey">
      <template #titleRender="node">
        <a-flex justify="space-between" align="center" gap="small">
          <a-flex flex="1" align="center">
            <a-typography-text :editable="{
              onChange: (value: string) => handleChangeTodoGroupName(node.groupId, value),
            }">{{ node.groupName }}</a-typography-text>
          </a-flex>
          <a-flex>
            <a-tooltip :title="t('todo.editGroup')">
              <a-button variant="link" color="orange" size="small"
                @click.stop="openGroupModal(node as unknown as TodoGroupVo)">
                <template #icon>
                  <SvgIcon name="EditOutlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-popconfirm :title="t('todo.deleteGroupConfirm')" @confirm="deleteGroup(node as unknown as TodoGroupVo)">
              <a-tooltip :title="t('common.delete')">
                <a-button type="link" size="small" danger @click.stop>
                  <template #icon>
                    <SvgIcon name="DeleteOutlined" />
                  </template>
                </a-button>
              </a-tooltip>
            </a-popconfirm>
          </a-flex>
        </a-flex>
      </template>
    </a-tree>
  </a-card>
  <TodoGroupModal ref="todoGroupModalRef" @saved="loadGroups" />
</template>
