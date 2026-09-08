<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';

const { isFullscreen, toggle } = useFullscreen();


// 重新检查全屏状态
isFullscreen.value = !!(
  document.fullscreenElement ||
  // @ts-expect-error - vendor fullscreen APIs are not included in the standard DOM typings
  document.webkitFullscreenElement ||
  // @ts-expect-error - vendor fullscreen APIs are not included in the standard DOM typings
  document.mozFullScreenElement ||
  // @ts-expect-error - vendor fullscreen APIs are not included in the standard DOM typings
  document.msFullscreenElement
);
</script>
<template>
  <a-button @click="toggle" type="text" shape="circle">
    <template #icon>
      <SvgIcon :name="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"></SvgIcon>
    </template>
  </a-button>
</template>
