<script setup lang="ts">
import { addGroup, updateGroup, type TodoGroupBo, type TodoGroupVo } from '#/api/todo';
import { useI18n } from '#/locales';
import { message, type FormInstance, type Rule } from 'antdv-next';
import { reactive, ref } from 'vue';

const emits = defineEmits<{ saved: [] }>();
const groupModalOpen = ref(false)
const { t } = useI18n();
const groupModalTitle = ref('')
const groupForm = reactive<TodoGroupBo>({ groupName: '' });


const groupFormRef = ref<FormInstance>();
const groupRules: Record<string, Rule[]> = {
  groupName: [{ required: true, message: t('todo.groupNameRequired'), trigger: 'blur' }],
};


const groupEditId = ref<number | null>(null);
function open(group?: TodoGroupVo) {
  groupModalOpen.value = true;

  groupEditId.value = group?.groupId ?? null;
  groupForm.groupName = group?.groupName ?? '';
  groupModalTitle.value = group ? t('todo.editGroup') : t('todo.newGroup');
}
async function submitGroup() {
  try {
    await groupFormRef.value?.validate();
  } catch {
    return;
  }
  try {
    if (groupEditId.value != null) {
      await updateGroup({ groupId: groupEditId.value, groupName: groupForm.groupName });
      message.success(t('todo.save'));
    } else {
      await addGroup({ groupName: groupForm.groupName });
      message.success(t('todo.save'));
    }
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
      <a-form-item :label="t('todo.groupName')" name="groupName">
        <a-input v-model:value="groupForm.groupName" :placeholder="t('todo.groupNamePlaceholder')" />
      </a-form-item>
    </a-form>
  </a-modal>

</template>
