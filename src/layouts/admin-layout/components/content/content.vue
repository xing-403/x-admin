<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';

const contentRef = useTemplateRef('contentRef')
const { isFullscreen, toggle } = useFullscreen(contentRef)
const scrollContentRef = ref()

</script>

<template>
  <a-layout-content ref="contentRef" class="full-content" :style="{ background: 'var(--ant-layout-color-bg-body)' }">
    <div ref="scrollContentRef" pos-relative max-h-full overflow-auto>
      <router-view />
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
