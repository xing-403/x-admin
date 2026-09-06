<script setup lang="ts">
import { addGroup, listGroupTree, updateGroup, type TodoGroupBo, type TodoGroupVo } from '#/api/todo';
import { useI18n } from '#/locales';
import { message, type FormInstance, type Rule } from 'antdv-next';
import { nextTick, reactive, ref } from 'vue';

/** 顶级分组父ID */
const ROOT_ID = '0';

const emits = defineEmits<{ saved: [] }>();
const groupModalOpen = ref(false)
const { t } = useI18n();
const groupModalTitle = ref('')
const groupForm = reactive<TodoGroupBo>({ groupName: '', parentGroupId: ROOT_ID });

interface ParentOption {
  key: string;
  title: string;
  children?: ParentOption[];
  disabled?: boolean;
}

const groupFormRef = ref<FormInstance>();
const groupRules: Record<string, Rule[]> = {
  parentGroupId: [{ required: true, message: t('todo.parentGroupIdRequired'), trigger: 'blur' }],
  groupName: [{ required: true, message: t('todo.groupNameRequired'), trigger: 'blur' }],
};

/** 上级分组下拉数据（含虚拟顶级节点） */
const parentOptions = ref<ParentOption[]>([]);

const groupEditId = ref<string | null>(null);

/** 将分组树转换为下拉选项，disabledIds 中的节点不可选（自身及子孙） */
function buildOptions(list: TodoGroupVo[], disabledIds: Set<string>): ParentOption[] {
  return (list ?? []).map((g) => {
    const children = buildOptions(g.children ?? [], disabledIds);
    const node: ParentOption = {
      key: g.groupId,
      title: g.groupName,
      disabled: disabledIds.has(g.groupId),
    };
    if (children.length) {
      node.children = children;
    }
    return node;
  });
}

/** 递归收集自身及所有子孙ID */
function collectDescendantIds(list: TodoGroupVo[], out: Set<string>) {
  for (const g of list ?? []) {
    out.add(g.groupId);
    collectDescendantIds(g.children ?? [], out);
  }
}

/**
 * 打开分组弹窗
 * @param group  编辑的分组，为空表示新增
 * @param parent 新增时的默认上级分组
 */
async function open(group?: TodoGroupVo, parent?: TodoGroupVo | null) {
  groupModalOpen.value = true;

  groupEditId.value = group?.groupId ?? null;
  groupForm.groupName = group?.groupName ?? '';
  groupForm.orderNum = group?.orderNum ?? 99999;
  groupModalTitle.value = group
    ? t('todo.editGroup')
    : parent
      ? t('todo.newSubGroup')
      : t('todo.newGroup');

  // 编辑时，自身及其子孙都不能作为上级分组，避免形成环路
  const disabledIds = new Set<string>();
  if (group) {
    disabledIds.add(group.groupId);
    collectDescendantIds(group.children ?? [], disabledIds);
  }
  const tree = await listGroupTree();
  parentOptions.value = [
    { key: ROOT_ID, title: t('todo.topGroup'), children: buildOptions(tree, disabledIds) },
  ];

  groupForm.parentGroupId = group?.parentGroupId ?? parent?.groupId ?? ROOT_ID;

  await nextTick();
  groupFormRef.value?.clearValidate();
}

async function submitGroup() {
  try {
    await groupFormRef.value?.validate();
  } catch {
    return;
  }
  try {
    const payload: TodoGroupBo = {
      groupName: groupForm.groupName,
      parentGroupId: groupForm.parentGroupId ?? ROOT_ID,
      orderNum: groupForm.orderNum,
    };
    if (groupEditId.value != null) {
      await updateGroup({ ...payload, groupId: groupEditId.value });
    } else {
      await addGroup(payload);
    }
    message.success(t('todo.save'));
    groupModalOpen.value = false;
    emits('saved');
  } catch {
    // 拦截器已提示
  }
}

defineExpose({
  open,
})
</script>

<template>

  <!-- 分组弹窗 -->
  <a-modal v-model:open="groupModalOpen" :title="groupModalTitle" @ok="submitGroup">
    <a-form ref="groupFormRef" :model="groupForm" :rules="groupRules" layout="vertical">
      <a-form-item :label="t('todo.parentGroup')" name="parentGroupId">
        <a-tree-select v-model:value="groupForm.parentGroupId" :tree-data="parentOptions"
          :field-names="{ children: 'children', label: 'title', value: 'key' }" :tree-default-expand-all="true"
          :placeholder="t('todo.parentGroupPlaceholder')" allow-clear style="width: 100%" />
      </a-form-item>
      <a-form-item :label="t('todo.groupName')" name="groupName">
        <a-input v-model:value="groupForm.groupName" :placeholder="t('todo.groupNamePlaceholder')" />
      </a-form-item>
    </a-form>
  </a-modal>

</template>
