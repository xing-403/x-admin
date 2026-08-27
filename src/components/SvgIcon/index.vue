<script setup lang="ts">

import { computed, type Component } from 'vue';
import { Icon } from '@iconify/vue';
import { isFunction, isHttpUrl, isObject, isString } from '#/utils/inference';
import AntdIcon, * as AntdIcons from '@antdv-next/icons'
defineOptions({
  name: 'SvgIcon'
})
const props = defineProps<{
  name: string | Component;
  color?: string,
}>();
const isAntdIcon = computed(()=> isString(props.name) && Reflect.has(AntdIcons, props.name))

const AntdIconComponent = computed(()=>{
  if(isAntdIcon.value){
    return AntdIcons[props.name as keyof typeof AntdIcons]
  }
})
const isRemoteIcon = computed(() => isString(props.name) && isHttpUrl(props.name));

const isComponent = computed(() =>  !isString(props.name) && (isObject(props.name) || isFunction(props.name)));
</script>

<template>
  <template v-if="isString(name)">
    <AntdIcon v-if="isAntdIcon" :component="AntdIconComponent"/>
    <img v-else-if="isRemoteIcon" :src="name" v-bind="$attrs" />
    <Icon v-else-if="name" v-bind="$attrs" :icon="name" />
  </template>
  <component v-else-if="isComponent" :is="name" v-bind="$attrs" />

</template>
