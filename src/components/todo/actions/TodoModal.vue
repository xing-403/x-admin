<script setup lang="ts">
import {
  addItem,
  updateItem,
  type TodoItemBo,
  type TodoItemVo,
} from '#/api/todo';
import { useI18n } from '#/locales';
import { message, type FormInstance, type Rule } from 'antdv-next';
import { reactive, ref } from 'vue';

const props = defineProps<{ groupId: number }>();
const emits = defineEmits<{ saved: [] }>();

const { t } = useI18n();

const itemModalOpen = ref(false);
const itemModalTitle = ref('');
const itemFormRef = ref<FormInstance>();
const itemEditId = ref<number | null>(null);
const itemForm = reactive<TodoItemBo & { _status: string }>({
  todoName: '',
  todoDesc: '',
  deadline: '',
  groupId: 0,
  status: '0',
  _status: '0',
});

const itemRules: Record<string, Rule[]> = {
  todoName: [{ required: true, message: t('todo.nameRequired'), trigger: 'blur' }],
};

function open(it?: TodoItemVo) {
  itemEditId.value = it?.todoId ?? null;
  itemForm.todoName = it?.todoName ?? '';
  itemForm.todoDesc = it?.todoDesc ?? '';
  itemForm.deadline = it?.deadline ?? '';
  itemForm.groupId = it?.groupId ?? props.groupId;
  itemForm._status = it?.status ?? '0';
  itemModalTitle.value = it ? t('todo.editItem') : t('todo.newItem');
  itemModalOpen.value = true;
}

async function submitItem() {
  try {
    await itemFormRef.value?.validate();
  } catch {
    return;
  }
  const payload: TodoItemBo = {
    todoName: itemForm.todoName,
    todoDesc: itemForm.todoDesc,
    deadline: itemForm.deadline,
    groupId: itemForm.groupId,
    status: itemForm._status,
  };
  try {
    if (itemEditId.value != null) {
      await updateItem({ ...payload, todoId: itemEditId.value });
    } else {
      await addItem(payload);
    }
    message.success(t('todo.save'));
    itemModalOpen.value = false;
    emits('saved');
  } catch {
    // 拦截器已提示
  }
}

defineExpose({ open });
</script>
<template>
  <a-modal v-model:open="itemModalOpen" :title="itemModalTitle" @ok="submitItem">
    <a-form ref="itemFormRef" :model="itemForm" :rules="itemRules" layout="vertical">
      <a-form-item :label="t('todo.name')" name="todoName">
        <a-input v-model:value="itemForm.todoName" :placeholder="t('todo.namePlaceholder')" />
      </a-form-item>
      <a-form-item :label="t('todo.desc')" name="todoDesc">
        <a-textarea
          v-model:value="itemForm.todoDesc"
          :placeholder="t('todo.descPlaceholder')"
          :rows="3"
        />
      </a-form-item>
      <a-form-item :label="t('todo.deadline')" name="deadline">
        <a-date-picker
          v-model:value="itemForm.deadline"
          show-time
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="t('todo.deadlinePlaceholder')"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item :label="t('todo.status')" name="_status">
        <a-switch v-model:checked="itemForm._status" checked-value="1" un-checked-value="0" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
