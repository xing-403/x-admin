<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

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
    return
  }
  isOverflow.value = true

  thumbWidth.value = scrollRef.value.clientWidth ** 2 / scrollWrapRef.value.clientWidth
  thumbLeft.value = scrollLeft / (scrollContentWidth - viewWidth) * (viewWidth - thumbWidth.value)
}

function handleScroll() {
  update()
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

/**
 * 滚动到指定 left 像素位置
 * @param position 像素值
 */
function scrollLeft(position: number) {
  if (!scrollRef.value) return
  const scrollLeft = scrollRef.value.scrollLeft
  let d = 0
  // 200ms 内将滚动条由 scrollLeft 转移到 scrollLeft - position
  const timer = setInterval(() => {
    if (d >= position || scrollLeft - d <= 0) {
      clearInterval(timer)
    }
    if (!scrollRef.value) return
    scrollRef.value.scrollLeft = scrollLeft - d
    d += position / 20
  }, 1)
}

/**
 *
 * @param position 像素值
 */
function scrollRight(position: number) {
  if (!scrollRef.value) return
  const scrollLeft = scrollRef.value.scrollLeft
  let d = 0
  // 200ms 内将滚动条由 scrollLeft 转移到 scrollLeft - position
  const timer = setInterval(() => {
    if (d >= position || scrollLeft + d >= scrollWrapRef.value!.clientWidth) {
      clearInterval(timer)
    }
    if (!scrollRef.value) return
    scrollRef.value.scrollLeft = scrollLeft + d
    d += position / 20
  }, 1)
}

// 暴露出去给父组件 ref 调用
defineExpose({
  scrollLeft,
  scrollRight,
  isOverflow
})

let resizeObserver: ResizeObserver | null = null
onMounted(() => {
  nextTick(update)
  // 监听滚动容器尺寸变化，slot内容改变自动刷新
  if (scrollWrapRef.value) {
    resizeObserver = new ResizeObserver(() => {
      update()
    })
    resizeObserver.observe(scrollWrapRef.value)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <div pos-relative class="scrollbar" @mousemove="isHover = true" @mouseleave="isHover = false">
    <div class="scrollbar-content" ref="scrollRef" @scroll="handleScroll">
      <div class="scroll-wrap" ref="scrollWrapRef">
        <slot></slot>
      </div>
    </div>
    <transition name="fade">
      <div ref="barRef" class="scroll-bar" :class="[(isHover || isDragging) && 'show']">
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
