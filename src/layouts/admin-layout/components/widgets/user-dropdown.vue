<script setup lang="ts">
import { useI18n } from '#/locales';
import { useUserStore } from '#/store/modules/user';
import { IdcardOutlined, LogoutOutlined } from '@antdv-next/icons';
import type { MenuItemType } from 'antdv-next';

import { useRouter } from 'vue-router';

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

async function handleLogout() {
  await userStore.logout()
  router.push('/login')
}

function handleProfile() {
  router.push('/account/profile')
}

const items: MenuItemType[] = [
  {
    label: t('common.profile'),
    key: 'profile',
    icon: IdcardOutlined,
  },
  {
    label: t('common.logout'),
    key: 'logout',
    icon: LogoutOutlined,
  },
]
function handleClickUserDropDown({ key }: any) {
  switch (key) {
    case 'profile':
      handleProfile()
      break
    case 'logout':
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
