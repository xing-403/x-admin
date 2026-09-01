<script setup lang="ts">
import { useI18n, type LocaleType } from '#/locales';
import { usePreferencesStore } from '#/store/modules/preferences';
import { computed } from 'vue';

const { t } = useI18n()

const preferencesStore = usePreferencesStore()
function handleLocaleChange({ key }: { key: string }) {
  preferencesStore.locale = key as LocaleType
}
const localeOptions = computed(() => [
  { label: '简体中文', value: 'zh-CN', key: 'zh-CN' },
  { label: 'English', value: 'en-US', key: 'en-US' },
])


function handleClickLocale() {
  const currentIndex = localeOptions.value.findIndex((item) => item.key === preferencesStore.locale);
  const nextIndex = (currentIndex + 1) % localeOptions.value.length;
  preferencesStore.locale = localeOptions.value[nextIndex].key as LocaleType;
}
</script>

<template>
  <a-dropdown placement="bottomRight" :menu="{ items: localeOptions, onClick: handleLocaleChange }">
    <a-button type="text" shape="circle" :aria-label="t('header.language')" @click="handleClickLocale">
      <template #icon>
        <SvgIcon name="carbon:language" />
      </template>
    </a-button>
    <template #labelRender="item">
      <a-flex w-100px justify="space-between" gap="small">
        <a-typography-text>{{ item.label }}</a-typography-text>
        <SvgIcon v-if="preferencesStore.locale === item.value" name="CheckCircleOutlined"
          color="var(--color-primary)" />
      </a-flex>
    </template>
  </a-dropdown>
</template>
