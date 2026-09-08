<script setup lang="ts">
import { useI18n } from '#/locales'
import { useUserStore } from '#/store/modules/user'
import { Modal } from 'antdv-next'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const [modal, ContextHolder] = Modal.useModal()
const router = useRouter()
const { t } = useI18n()
async function toggleLogout() {
  modal.confirm({
    title: t('common.logout'),
    okText: t('common.confirm'),
    cancelText: t('common.cancel'),
    onOk: async () => {
      await userStore.logout()
      router.push('/login')
    }
  })
}
</script>
<template>
  <ContextHolder />
  <a-button @click="toggleLogout" type="text" shape="circle">
    <template #icon>
      <SvgIcon name="LogoutOutlined"></SvgIcon>
    </template>
  </a-button>
</template>
