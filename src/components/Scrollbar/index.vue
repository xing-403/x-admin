<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import animate from 'animate.ts';
import easing from "animate.ts/dist/easing.js"
import { useResizeObserver } from '@vueuse/core';
interface Props {
  horizontal?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  horizontal: true,
});
const thumbLeft = ref(0)
const thumbWidth = ref(200)
const scrollWrapRef = ref<HTMLDivElement>()
const scrollRef = ref<HTMLDivElement>()
const isOverflow = ref(false)
function update() {
  if (!scrollRef.value || !scrollWrapRef.value) return
  const viewWidth = scrollRef.value.clientWidth
  const scrollLeft = scrollRef.value.scrollLeft
  const scrollContentWidth = scrollWrapRef.value.clientWidth
  if (scrollContentWidth <= viewWidth) {
    isOverflow.value = false
    thumbWidth.value = 0
    thumbLeft.value = 0
  } else {
    isOverflow.value = true
    thumbWidth.value = scrollRef.value.clientWidth ** 2 / scrollWrapRef.value.clientWidth
    thumbLeft.value = scrollLeft / (scrollContentWidth - viewWidth) * (viewWidth - thumbWidth.value)
  }
}
const isDragging = ref(false)
const isHover = ref(false)
let startMouseX = 0
let startThumbLeft = 0
function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value || !scrollRef.value) return
  const deltaX = e.clientX - startMouseX
  let newThumbLeft = startThumbLeft + deltaX

  const viewWidth = scrollRef.value.clientWidth
  const maxThumbLeft = viewWidth - thumbWidth.value
  newThumbLeft = Math.max(0, Math.min(newThumbLeft, maxThumbLeft))
  thumbLeft.value = newThumbLeft

  const scrollContentWidth = scrollWrapRef.value!.clientWidth
  const ratio = newThumbLeft / maxThumbLeft
  scrollRef.value.scrollLeft = ratio * (scrollContentWidth - viewWidth)
}

function handleMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
function handleMouseDownThumb(e: MouseEvent) {
  e.preventDefault()
  isDragging.value = true
  startMouseX = e.clientX
  startThumbLeft = thumbLeft.value
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
function transition(start: number, end: number, callback: (value: number) => void) {
  return animate({ duration: 200, start, end, easing: easing.easeInOutSine, onStep: callback })
}
/**
 * 滚动位置
 * @param position
 */

function scrollTo(position: number) {
  if (!scrollRef.value) return
  const scrollLeft = scrollRef.value.scrollLeft
  const viewWidth = scrollRef.value.clientWidth
  transition(scrollLeft, Math.min(Math.max(0, position), viewWidth), (value: number) => {
    if (!scrollRef.value) return
    scrollRef.value.scrollLeft = value
  })
}

function scrollLeft(position: number) {
  if (!scrollRef.value) return
  const scrollLeft = scrollRef.value.scrollLeft
  const viewWidth = scrollRef.value.clientWidth
  scrollTo(Math.min(Math.max(0, scrollLeft - position), viewWidth))
}

function scrollRight(position: number) {
  if (!scrollRef.value) return
  const scrollLeft = scrollRef.value.scrollLeft
  const viewWidth = scrollRef.value.clientWidth
  scrollTo(Math.min(Math.max(0, scrollLeft + position), viewWidth))
}

// 暴露出去给父组件 ref 调用
defineExpose({
  scrollLeft,
  scrollRight,
  scrollTo,
  isOverflow
})

useResizeObserver(scrollRef, update)
useResizeObserver(scrollRef, update)

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div pos-relative class="scrollbar" @mousemove="isHover = true" @mouseleave="isHover = false">
    <div class="scrollbar-content" ref="scrollRef" @scroll="update">
      <div class="scroll-wrap" ref="scrollWrapRef">
        <slot></slot>
      </div>
    </div>
    <transition name="fade">
      <div ref="barRef" v-if="isOverflow" class="scroll-bar" :class="[(isHover || isDragging) && 'show']">
        <div class="scroll-thumb" :style="{ width: `${thumbWidth}px`, left: `${thumbLeft}px` }"
          @mousedown="handleMouseDownThumb">
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.scrollbar {
  @apply relative;

  .scrollbar-content {
    @apply overflow-auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .scroll-wrap {
      @apply w-max;
    }
  }

  .scroll-bar {
    @apply absolute z-10 left-0 bottom-0 overflow-hidden h-8px w-full bg-[var(--page-background)];
    transition: all 0.2s;
    display: none;

    .scroll-thumb {
      @apply absolute b-rd-10px h-full bg-[var(--color-primary-20)] cursor-pointer hover:bg-[var(--color-primary-30)];
    }
  }

  .scroll-bar.show {
    @apply block;
  }
}
</style>
