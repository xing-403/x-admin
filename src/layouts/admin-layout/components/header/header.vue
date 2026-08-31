<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePreferencesStore } from '#/store/modules/preferences'
import { useI18n } from '#/locales'
import SvgIcon from '#/components/SvgIcon/index.vue'
import { useLayoutBreadcrumbs } from './use-layout-breadcrumbs'
import Language from '../widgets/language.vue'
import Theme from '../widgets/theme.vue'
import ThemeColor from '../widgets/theme-color.vue'
import UserDropdown from '../widgets/user-dropdown.vue'

const preferencesStore = usePreferencesStore()
const sidebarEnable = computed(() => preferencesStore.sidebar.enable)

const router = useRouter()
const { breadcrumbs } = useLayoutBreadcrumbs()
const { t } = useI18n()

function toggleSidebarEnable() {
  preferencesStore.sidebar.enable = !sidebarEnable.value
}

function handleBreadcrumbClick(path?: string) {
  if (path) router.push(path)
}
</script>
<template>
  <a-layout-header>
    <a-flex align="center" justify="space-between" h-full gap="small">
      <a-flex align="center" gap="small">
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
      </a-flex>
      <a-flex align="center" gap="small">
        <Language />
        <ThemeColor />
        <Theme />
        <UserDropdown />
      </a-flex>
    </a-flex>
  </a-layout-header>
</template>
