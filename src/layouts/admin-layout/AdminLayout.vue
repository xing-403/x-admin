<script setup lang="ts">
import LayoutHeader from './components/header/header.vue'
import LayoutSideBar from './components/sidebar/sidebar.vue'
import LayoutFooter from './components/footer/footer.vue'
import LayoutContent from './components/content/content.vue'
</script>

<template>
  <a-layout h-full>
    <LayoutSideBar> </LayoutSideBar>
    <a-layout>
      <LayoutHeader></LayoutHeader>
      <LayoutContent></LayoutContent>
      <LayoutFooter></LayoutFooter>
    </a-layout>
  </a-layout>
</template>
