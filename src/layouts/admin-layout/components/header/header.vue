<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePreferencesStore } from '#/store/modules/preferences'
import { useUserStore } from '#/store/modules/user'
import { useI18n } from '#/locales'
import type { LocaleType } from '#/locales'
import SvgIcon from '#/components/SvgIcon/index.vue'
import { useLayoutBreadcrumbs } from './use-layout-breadcrumbs'

const preferencesStore = usePreferencesStore()
const sidebarEnable = computed(() => preferencesStore.sidebar.enable)
const isDark = computed(() => preferencesStore.isDark)
const router = useRouter()
const userStore = useUserStore()
const { breadcrumbs } = useLayoutBreadcrumbs()
const { t } = useI18n()

async function handleLogout() {
  await userStore.logout()
  router.push('/login')
}

const localeOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
]

function toggleSidebarEnable() {
  preferencesStore.sidebar.enable = !sidebarEnable.value
}

function toggleTheme() {
  preferencesStore.theme.mode = isDark.value ? 'light' : 'dark'
}

function handleLocaleChange(value: string) {
  preferencesStore.locale = value as LocaleType
}

function handleBreadcrumbClick(path?: string) {
  if (path) router.push(path)
}
</script>
<template>
  <a-layout-header>
    <a-flex align="center" h-full gap="small">
      <a-button type="text" shape="circle" :aria-label="t('header.toggleSidebar')" @click="toggleSidebarEnable">
        <template #icon>
          <SvgIcon :name="sidebarEnable ? 'MenuFoldOutlined' : 'MenuUnfoldOutlined'" />
        </template>
      </a-button>
      <a-breadcrumb :items="breadcrumbs">
        <template #itemRender="{ route }">
          <a v-if="route.path" href="javascript:void(0)" @click="handleBreadcrumbClick(route.path)">
            {{ route.title }}
          </a>
          <span v-else>{{ route.title }}</span>
        </template>
      </a-breadcrumb>
      <a-select
        class="ml-auto w-120px"
        :value="preferencesStore.locale"
        :options="localeOptions"
        :aria-label="t('header.language')"
        @change="handleLocaleChange"
      />
      <a-button type="text" shape="circle" :aria-label="t('header.toggleTheme')" @click="toggleTheme">
        <template #icon>
          <SvgIcon :name="isDark ? 'SunOutlined' : 'MoonOutlined'" />
        </template>
      </a-button>
      <a-dropdown>
        <a-flex align="center" class="cursor-pointer gap-2" px-2>
          <a-avatar size="small">
            <template #icon><SvgIcon name="UserOutlined" /></template>
          </a-avatar>
          <span class="max-w-120px truncate">{{ userStore.nickname || t('common.login') }}</span>
        </a-flex>
        <template #overlay>
          <a-menu>
            <a-menu-item key="logout" @click="handleLogout">
              <SvgIcon name="LogoutOutlined" />
              {{ t('common.logout') }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-flex>
  </a-layout-header>
</template>
