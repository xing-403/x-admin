<script setup lang="ts">

import type { MenuItemType } from 'antdv-next'
import { computed } from 'vue'
import { usePreferencesStore } from '#/store/modules/preferences';

const props = withDefaults(defineProps<{
  mode?: 'vertical' | 'horizontal'
}>(), {
  mode: 'vertical'
})
const preferencesStore = usePreferencesStore()
const collapsed = computed(() => preferencesStore.sidebar.collapsed)
const menuMode = computed(() => {
  if (!collapsed.value && props.mode === 'vertical') {
    return 'inline'
  }
  return props.mode
})

const items: MenuItemType[] = [
]

</script>
<template>
  <a-menu :mode="menuMode" :items="items" :inline-collapsed="collapsed" />
</template>
