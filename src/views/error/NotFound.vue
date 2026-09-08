<script setup lang="ts">
import { useRouter } from 'vue-router';

import { ArrowLeftOutlined } from '@antdv-next/icons';
import Image from '#/assets/images/error/404.svg';
import { useI18n } from '#/locales';

const { replace } = useRouter();

const { t } = useI18n();
// 返回首页
function back() {
  replace("/");
}

</script>

<template>
  <a-flex vertical gap="small" align="center" justify="center" w-full h-full>
    <div class="md:w-1/3  w-1/2 lg:w-1/4">
      <a-image :src="Image" :preview="false" />
    </div>
    <a-typography-title :level="2">
      {{ t('pages.error.notFound.title') }}
    </a-typography-title>
    <a-typography-text>
      {{ t('pages.error.notFound.description') }}
    </a-typography-text>
    <a-button @click="back" type="primary">
      <template #icon>
        <ArrowLeftOutlined />
      </template>
      {{ t('common.backToHome') }}
    </a-button>
  </a-flex>
</template>
