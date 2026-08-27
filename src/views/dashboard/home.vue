<script lang="ts" setup>
import { useI18n } from '#/locales';

const { t } = useI18n();
</script>

<template>
  <Page> {{ t('pages.home') }} </Page>
</template>
