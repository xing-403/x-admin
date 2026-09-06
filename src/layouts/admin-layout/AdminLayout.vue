<script setup lang="ts">
import LayoutHeader from './components/header/header.vue'
import LayoutSideBar from './components/sidebar/sidebar.vue'
import LayoutTabbar from './components/tabbar/tabbar.vue'
import LayoutFooter from './components/footer/footer.vue'
import LayoutContent from './components/content/content.vue'
import { usePreferencesStore } from '#/store/modules/preferences.ts'

const preferencesStore = usePreferencesStore()
</script>

<template>
  <a-layout h-full>
    <LayoutSideBar />
    <a-layout>
      <LayoutHeader></LayoutHeader>
      <LayoutTabbar v-if="preferencesStore.tabbar.enable"></LayoutTabbar>
      <LayoutContent></LayoutContent>
      <LayoutFooter></LayoutFooter>
    </a-layout>
  </a-layout>
</template>
