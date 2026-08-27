<script setup lang="ts">
import { useI18n, type LocaleType } from '#/locales';
import { usePreferencesStore } from '#/store/modules/preferences';

const { t } = useI18n()

const preferencesStore = usePreferencesStore()
function handleLocaleChange(value: string) {
  preferencesStore.locale = value as LocaleType
}
const localeOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
]
</script>

<template>
  <a-select class="ml-auto w-120px" :value="preferencesStore.locale" :options="localeOptions"
    :aria-label="t('header.language')" @change="handleLocaleChange" />
</template>
