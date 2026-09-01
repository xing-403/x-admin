<script setup lang="ts">
import { computed } from 'vue'
import Menu from './../menu/menu.vue'
import { usePreferencesStore } from '#/store/modules/preferences';
import { useSystemStore } from '#/store/modules/system';
import SvgIcon from '#/components/SvgIcon/index.vue'

const preferencesStore = usePreferencesStore()

const systemStore = useSystemStore()
const collapsed = computed(() => preferencesStore.sidebar.collapsed || systemStore.isXs || systemStore.isSm)
</script>
<template>
  <a-layout-sider v-if="!systemStore.isXs && preferencesStore.sidebar.enable" :width="collapsed ? '64px' : '260px'">
    <a-flex vertical justify="space-between" h-full>
      <a-flex vertical flex="1" overflow-auto>
        <Menu :collapsed="collapsed"></Menu>
      </a-flex>
      <a-flex h-42px align="center" p-2 justify="space-baround">
        <a-button type="text" shape="circle" @click="preferencesStore.sidebar.collapsed = !collapsed">
          <template #icon>
            <SvgIcon :name="collapsed ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'" />
          </template>
        </a-button>
      </a-flex>
    </a-flex>
  </a-layout-sider>
  <a-drawer v-else v-model:open="preferencesStore.sidebar.enable" placement="left" size="90%"
    :styles="{ body: { '--ant-padding-lg': '0px' } }">
    <a-flex vertical justify="space-between" h-full>
      <Menu :collapsed="false"></Menu>
    </a-flex>
  </a-drawer>
</template>
