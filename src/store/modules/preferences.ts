import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const usePreferencesStore = defineStore('preferences', () => {
  const sidebar = reactive({
    collapsed: false,
  });

  return {
    sidebar,
  };
});
