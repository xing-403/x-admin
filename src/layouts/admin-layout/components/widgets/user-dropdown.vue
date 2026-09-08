<script setup lang="ts">
import { useI18n, type LocaleType } from '#/locales';
import { useUserStore } from '#/store/modules/user';
import { FullscreenExitOutlined, FullscreenOutlined, IdcardOutlined, LogoutOutlined } from '@antdv-next/icons';
import { computed } from 'vue';

import { useRouter } from 'vue-router';
import { usePreferencesStore, type ThemeMode } from '#/store/modules/preferences';
import { useSystemStore } from '#/store/modules/system';
import { useFullscreen } from '@vueuse/core';
import { Modal } from 'antdv-next';

const { t } = useI18n()
const preferencesStore = usePreferencesStore()
const userStore = useUserStore()
const systemStore = useSystemStore()
const router = useRouter()

const { isFullscreen, toggle: fullScreenToggle } = useFullscreen()
const [modal, ContextHolder] = Modal.useModal()
async function handleLogout() {
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

function handleProfile() {
  router.push('/account/profile')
}
const PRESET_COLORS = computed(() => [
  { key: 'default', label: t('theme.themes.default'), color: '#165dff' },
  { key: 'cyan', label: t('theme.themes.cyan'), color: '#008699' },
  { key: 'purple', label: t('theme.themes.purple'), color: '#722ed1' },
  { key: 'carbon', label: t('theme.themes.carbon'), color: '#36454F' },
  { key: 'forest', label: t('theme.themes.forest'), color: '#007860' },
  { key: 'redbiz', label: t('theme.themes.redbiz'), color: '#b83333' },
]);

const items = computed(() => {
  return [
    {
      label: t('common.profile'),
      key: 'profile',
      icon: IdcardOutlined,
      show: true
    },
    {
      label: isFullscreen.value ? t('common.unFullscreen') : t('common.fullscreen'),
      key: 'fullscreen',
      icon: isFullscreen.value ? FullscreenExitOutlined : FullscreenOutlined,
      show: systemStore.isXs
    },
    {
      key: 'language',
      label: t('header.language'),
      children: [
        {
          key: 'zh-CN',
          label: '简体中文',
        },
        {
          key: 'en-US',
          label: 'English',
        },
      ],
      show: systemStore.isXs
    },
    {
      key: 'theme-color',
      label: t('header.themeColor'),
      children: PRESET_COLORS.value,
      show: systemStore.isXs
    },
    {
      key: 'theme',
      label: t('header.toggleTheme'),
      children: [
        {
          key: 'light',
          label: t('theme.light'),
        },
        {
          key: 'dark',
          label: t('theme.dark'),
        },
        {
          key: 'auto',
          label: t('theme.auto'),
        },
      ],
      show: systemStore.isXs
    },
    {
      label: t('common.logout'),
      key: 'logout',
      icon: LogoutOutlined,
      show: systemStore.isXs
    },
  ].filter(item => item.show)
})

function handleLocaleChange(value: string) {
  preferencesStore.locale = value as LocaleType
}


function handleThemeColor(key: string) {
  preferencesStore.theme.color = key;
}

function handleThemeMode(key: string) {
  preferencesStore.theme.mode = key as ThemeMode;
}

function handleClickUserDropDown(info: any) {
  const { keyPath } = info
  switch (keyPath[0]) {
    case 'profile':
      handleProfile()
      break
    case 'language':
      handleLocaleChange(keyPath[1])
      break
    case 'theme-color':
      handleThemeColor(keyPath[1])
      break
    case "theme":
      handleThemeMode(keyPath[1])
      break
    case 'logout':
      handleLogout()
      break
    case 'fullscreen':
      fullScreenToggle()
      break
  }
}

</script>

<template>
  <ContextHolder />
  <a-dropdown :menu="{ items, onClick: handleClickUserDropDown }">
    <a-avatar cursor-pointer :src="userStore.userInfo?.user?.avatarUrl || undefined">
      <template #icon>
        <SvgIcon name="UserOutlined" />
      </template>
    </a-avatar>
    <template #popupRender="menu">
      <div w-220px b-rd-8px mt-5 style="background: var(--color-primary-30);">
        <a-flex p-3 gap="middle" align="center">
          <a-avatar :size="54" :src="userStore.userInfo?.user?.avatarUrl || undefined">
            <template #icon>
              <SvgIcon name="UserOutlined" />
            </template>
          </a-avatar>
          <a-flex vertical gap="small">
            <span> {{ userStore.nickname }}</span>
            <a-tag v-if="userStore.userInfo?.user.roles.length" color="blue">
              {{ userStore.userInfo?.user.roles[0].roleName }}
            </a-tag>
          </a-flex>
        </a-flex>
        <component :is="menu" />
      </div>
    </template>
  </a-dropdown>

</template>
