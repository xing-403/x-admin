<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@antdv-next/icons';
import { computed, ref } from 'vue'
import Menu from './../menu/menu.vue'
import { usePreferencesStore } from '#/store/modules/preferences';


const preferencesStore = usePreferencesStore()
const collapsed = computed(() => preferencesStore.sidebar.collapsed)
</script>
<template>
  <a-layout-sider :width="collapsed ? '64px' : '260px'">
    <a-flex vertical justify="space-between" h-full>
      <a-flex vertical flex="1" overflow-auto>
        <Menu :collapsed="collapsed"></Menu>
      </a-flex>
      <a-flex h-42px align="center" p-2 justify="space-baround">
        <a-button type="text" shape="circle" @click="preferencesStore.sidebar.collapsed = !collapsed">
          <template #icon>
            <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
          </template>
        </a-button>
      </a-flex>
    </a-flex>
  </a-layout-sider>
</template>
