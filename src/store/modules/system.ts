import { useWindowSize } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export const WINDOW_SIZE = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',
  xxxl: 'xxxl',
};

export const useSystemStore = defineStore('system', () => {
  const { width, height } = useWindowSize();
  const size = computed(() => {
    if (width.value >= 1920) return WINDOW_SIZE.xxxl;
    if (width.value >= 1600) return WINDOW_SIZE.xxl;
    if (width.value >= 1200) return WINDOW_SIZE.xl;
    if (width.value >= 992) return WINDOW_SIZE.lg;
    if (width.value >= 768) return WINDOW_SIZE.md;
    if (width.value >= 576) return WINDOW_SIZE.sm;
    return WINDOW_SIZE.xs;
  });

  const isXs = computed(() => size.value === WINDOW_SIZE.xs);
  const isSm = computed(() => size.value === WINDOW_SIZE.sm);
  const isMd = computed(() => size.value === WINDOW_SIZE.md);
  const isLg = computed(() => size.value === WINDOW_SIZE.lg);
  const isXl = computed(() => size.value === WINDOW_SIZE.xl);
  const isXxl = computed(() => size.value === WINDOW_SIZE.xxl);
  const isXxxl = computed(() => size.value === WINDOW_SIZE.xxxl);

  return {
    width,
    height,
    size,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
    isXxxl,
  };
});
