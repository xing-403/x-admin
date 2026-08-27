<script setup lang="ts">
import { useI18n } from '#/locales';
import { useUserStore } from '#/store/modules/user';
import { UserOutlined } from '@antdv-next/icons';
import type { MenuItemType } from 'antdv-next';

import { useRouter } from 'vue-router';

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

async function handleLogout() {
  await userStore.logout()
  router.push('/login')
}

const items: MenuItemType[] = [
  {
    label: t('common.logout'),
    key: 'layout',
    icon: UserOutlined,
  }
]
function handleClickUserDropDown({ key }: any) {
  switch (key) {
    case 'layout':
      handleLogout()
      break
  }

}

</script>

<template>
  <a-dropdown :menu="{ items, onClick: handleClickUserDropDown }">
    <a-avatar cursor-pointer>
      <template #icon>
        <SvgIcon name="UserOutlined" />
      </template>
    </a-avatar>
    <template #popupRender="menu">
      <div w-180px style="background: var(--background);border-radius: 4px ;">
        <a-flex p-3 gap="small">
          <a-avatar size="large">
            <template #icon>
              <SvgIcon name="UserOutlined" />
            </template>
          </a-avatar>
          <a-flex vertical>
            <span> {{ userStore.nickname }}</span>

            <span> {{ userStore.roles[0] }}</span>
          </a-flex>
        </a-flex>
        <component :is="menu" />
      </div>
    </template>
  </a-dropdown>

</template>
