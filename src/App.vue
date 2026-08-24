<script lang="ts" setup>
import { useAntdDesignTokens } from '#/hooks/use-antd-design-tokens';
import { theme } from 'antdv-next';
import { computed } from 'vue';

defineOptions({ name: 'App' });

const { tokens, componentToken } = useAntdDesignTokens()

const algorithm = computed(() => {
  const algorithm = [theme.defaultAlgorithm];
  return algorithm;
});

</script>

<template>
  <a-config-provider :theme="{ algorithm, token: tokens, components: componentToken }">
    <a-app class="h-full">
      <router-view />
    </a-app>
  </a-config-provider>
</template>
