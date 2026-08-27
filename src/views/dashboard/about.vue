<script lang="ts" setup>
import Page from '#/components/page/Page.vue'
import { useI18n } from '#/locales';

const { t } = useI18n();
</script>

<template>
  <Page> {{ t('pages.about') }} <SvgIcon name="StepForwardOutlined" /></Page>
</template>
