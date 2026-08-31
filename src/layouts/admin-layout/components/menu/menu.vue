<script setup lang="ts">
import type { LayoutMenuProps } from './type';
import { useLayoutMenus } from './use-layout-menus';

const props = withDefaults(defineProps<LayoutMenuProps>(), {
  collapsed: false,
  mode: 'vertical',
});

const {
  handleMenuClick,
  menuItems,
  menuMode,
  openKeys,
  selectedKeys,
} = useLayoutMenus(props);
</script>

<template>
  <a-menu v-model:selected-keys="selectedKeys" v-model:open-keys="openKeys" :items="menuItems"
    :inline-collapsed="collapsed" :mode="menuMode" @click="handleMenuClick">
    <template #iconRender="item">
      <span v-if="item?.icon">
        <SvgIcon :name="item.icon" />
      </span>
    </template>
  </a-menu>
</template>
