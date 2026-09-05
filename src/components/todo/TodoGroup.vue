<script setup lang="ts">
import { listGroupTree, removeGroups, updateGroup, type TodoGroupVo } from '#/api/todo';
import { useI18n } from '#/locales';
import { message } from 'antdv-next';
import TodoGroupModal from '#/components/todo/actions/TodoGroupModal.vue';
import { computed, onMounted, ref } from 'vue';
import type { TreeEmits } from 'antdv-next/dist/tree/Tree';

interface GroupNode {
  key: string;
  title: string;
  data: TodoGroupVo;
  children?: GroupNode[];
}

const { t } = useI18n();
const groups = ref<TodoGroupVo[]>([]);
const selectedGroupId = defineModel<string | null>({ required: true });
const expandedKeys = ref<string[]>([]);
/** 是否已做过首次自动展开 */
const autoExpanded = ref(false);

const todoGroupModalRef = ref<InstanceType<typeof TodoGroupModal>>();

/** 平铺分组树 */
function flatten(list: TodoGroupVo[]): TodoGroupVo[] {
  const out: TodoGroupVo[] = [];
  const walk = (l: TodoGroupVo[]) => {
    for (const g of l ?? []) {
      out.push(g);
      walk(g.children ?? []);
    }
  };
  walk(list);
  return out;
}

/** 分组树 -> a-tree 数据 */
function toTreeData(list: TodoGroupVo[]): GroupNode[] {
  return (list ?? []).map((g) => {
    const children = toTreeData(g.children ?? []);
    const node: GroupNode = { key: g.groupId, title: g.groupName, data: g };
    // 空 children 会让节点多出展开箭头，故仅在有子节点时挂载
    if (children.length) {
      node.children = children;
    }
    return node;
  });
}

const treeData = computed<GroupNode[]>(() => toTreeData(groups.value));

function openGroupModal(g?: TodoGroupVo, parent?: TodoGroupVo | null) {
  todoGroupModalRef.value?.open(g, parent);
}

async function deleteGroup(g: TodoGroupVo) {
  if (g.children && g.children.length) {
    message.warning(t('todo.deleteGroupHasChildren'));
    return;
  }
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

/** 展开指定分组的所有祖先，保证新建的节点可见 */
function expandAncestors(targetId: string) {
  const path: string[] = [];
  const walk = (l: TodoGroupVo[], ancestors: string[]): boolean => {
    for (const g of l ?? []) {
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
  for (const id of path) {
    if (!expandedKeys.value.includes(id)) {
      expandedKeys.value = [...expandedKeys.value, id];
    }
  }
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
  if (!autoExpanded.value && all.length) {
    expandedKeys.value = all.map((item) => item.groupId);
    autoExpanded.value = true;
  }
  if (targetId) {
    expandAncestors(targetId);
  }
}
const handleDrag: TreeEmits['drop'] = (info) => {
  const group = info.dragNode.data
  const parentGroup = info.node.data
  const orderNum = info.dropPosition
  const parentGroupId = (info.dropToGap ? parentGroup.parentGroupId : parentGroup.groupId).toString()
  const { groupId, groupName } = group

  updateGroup({ groupId, groupName, parentGroupId, orderNum }).then(() => {
    loadGroups()
  })
}

function handleSelectKey(keys: any[]) {
  selectedGroupId.value = keys.length ? keys[0] : null;
}
onMounted(() => {
  loadGroups();
});
</script>
<template>
  <a-card min-w-280px :title="t('todo.groupTitle')">
    <template #extra>
      <a-button type="primary" size="small" @click="openGroupModal()">
        <template #icon>
          <SvgIcon name="PlusOutlined" />
        </template>
        {{ t('todo.newGroup') }}
      </a-button>
    </template>
    <a-empty v-if="treeData.length === 0" :description="t('todo.emptyGroup')" />
    <a-tree v-else draggable block-node v-model:expanded-keys="expandedKeys" :tree-data="treeData" @drop="handleDrag"
      @select="handleSelectKey">
      <template #titleRender="node">
        <a-flex justify="space-between" align="center" gap="small">
          <a-flex flex="1" align="center">
            <a-typography-text ellipsis>{{ node.title }}</a-typography-text>
          </a-flex>
          <a-flex>
            <a-tooltip :title="t('todo.editGroup')">
              <a-button variant="link" color="orange" size="small" @click.stop="openGroupModal(node.data)">
                <template #icon>
                  <SvgIcon name="EditOutlined" />
                </template>
              </a-button>
            </a-tooltip>
            <a-popconfirm :title="t('todo.deleteGroupConfirm')" @confirm="deleteGroup(node.data)">
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
