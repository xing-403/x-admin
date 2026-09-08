<script setup lang="ts">
import Page from '#/components/page/Page.vue';
import { useFullscreen } from '@vueuse/core';
import { ref } from 'vue';

const scrollContentRef = ref()
const { isFullscreen, toggle } = useFullscreen(scrollContentRef)

</script>

<template>
  <a-layout-content class="full-content">
    <div pos-relative max-h-full overflow-auto ref="scrollContentRef">
      <Page>
        <router-view />
      </Page>
    </div>
    <a-float-button-group shape="square">
      <a-float-button @click="toggle">
        <template #icon>
          <SvgIcon :name="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"></SvgIcon>
        </template>
      </a-float-button>
      <a-float-back-top :target="() => scrollContentRef" :visibility-height="20" />
    </a-float-button-group>
  </a-layout-content>
</template>
