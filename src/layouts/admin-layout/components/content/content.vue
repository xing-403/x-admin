<script setup lang="ts">
import { ref } from 'vue';


const scrollContentRef = ref()

</script>

<template>
  <a-layout-content>
    <div class="affix-content" ref="scrollContentRef" pos-relative max-h-full overflow-auto>
      <router-view />
    </div>
    <a-float-back-top :target="() => scrollContentRef" :visibility-height="20" shape="circle" />
  </a-layout-content>
</template>
