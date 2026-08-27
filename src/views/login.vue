<script lang="ts" setup>
import type { FormInstance, Rule } from 'antdv-next';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'antdv-next';
import SvgIcon from '#/components/SvgIcon/index.vue';

import { useI18n } from '#/locales';
import { usePreferencesStore } from '#/store/modules/preferences';
import { useUserStore } from '#/store/modules/user';
import { getCode, type CaptchaVo } from '#/api/auth';

defineOptions({
  name: 'AuthenticationLogin',
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const preferencesStore = usePreferencesStore();

function toggleTheme() {
  preferencesStore.theme.mode = preferencesStore.isDark ? 'light' : 'dark';
}

const formRef = ref<FormInstance>();
const loading = ref(false);
const captcha = reactive<CaptchaVo>({ captchaEnabled: true, uuid: '', img: '' });

const formSchema = reactive({
  username: 'admin',
  password: 'admin123',
  code: '',
});
const rememberMe = ref(false);

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: t('common.username') }],
  password: [{ required: true, message: t('common.password') }],
  code: [{ required: true, message: t('common.captcha') }],
};

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

onMounted(() => {
  const saved = localStorage.getItem(REMEMBER_ME_KEY);
  if (saved) {
    formSchema.username = saved;
    rememberMe.value = true;
  }
  refreshCaptcha();
});

async function refreshCaptcha() {
  try {
    const data = await getCode();
    captcha.captchaEnabled = data.captchaEnabled;
    captcha.uuid = data.uuid;
    captcha.img = data.img;
  } catch {
    captcha.captchaEnabled = false;
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
  } catch {
    return;
  }
  loading.value = true;
  try {
    await userStore.login({
      username: formSchema.username,
      password: formSchema.password,
      code: captcha.captchaEnabled ? formSchema.code : undefined,
      uuid: captcha.captchaEnabled ? captcha.uuid : undefined,
    });
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe.value ? formSchema.username : '');
    message.success(t('login.success'));
    const redirect = (route.query.redirect as string) || '/';
    router.push(redirect);
  } catch {
    refreshCaptcha();
    formSchema.code = '';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <a-flex h-full bg-[var(--background-deep)]>
    <div
      flex="1"
      class="hidden md:block"
      style="background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 55%, #ffffff))"
    ></div>
    <a-flex relative h-full align="center" justify="center" w-full md:w-600px bg-[var(--background)] p-30px>
      <a-button
        type="text"
        shape="circle"
        absolute
        top-16px
        right-16px
        :aria-label="t('header.toggleTheme')"
        @click="toggleTheme"
      >
        <template #icon>
          <SvgIcon :name="preferencesStore.isDark ? 'SunOutlined' : 'MoonOutlined'" />
        </template>
      </a-button>
      <div w-full max-w-400px @keydown.enter.prevent="handleSubmit">
        <h2 mb-6 text-center text-2xl font-bold>{{ t('login.title') }}</h2>
        <a-form ref="formRef" :model="formSchema" :rules="rules" layout="vertical">
          <a-form-item name="username">
            <a-input v-model:value="formSchema.username" :placeholder="t('login.accountPlaceholder')" size="large">
              <template #prefix><SvgIcon name="UserOutlined" /></template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password
              v-model:value="formSchema.password"
              :placeholder="t('login.passwordPlaceholder')"
              size="large"
            >
              <template #prefix><SvgIcon name="LockOutlined" /></template>
            </a-input-password>
          </a-form-item>
          <a-form-item v-if="captcha.captchaEnabled" name="code">
            <a-flex class="gap-2">
              <a-input
                v-model:value="formSchema.code"
                :placeholder="t('login.captchaPlaceholder')"
                size="large"
                class="flex-1"
              >
                <template #prefix><SvgIcon name="SafetyOutlined" /></template>
              </a-input>
              <img
                v-if="captcha.img"
                :src="`data:image/png;base64,${captcha.img}`"
                :alt="t('login.refreshCaptcha')"
                h-40px
                w-120px
                cursor-pointer
                @click="refreshCaptcha"
              />
            </a-flex>
          </a-form-item>
          <div flex justify="between" mb-4>
            <a-checkbox v-model:checked="rememberMe">{{ t('common.rememberMe') }}</a-checkbox>
          </div>
          <a-button type="primary" block size="large" :loading="loading" @click="handleSubmit">
            {{ t('login.signIn') }}
          </a-button>
        </a-form>
      </div>
    </a-flex>
  </a-flex>
</template>
