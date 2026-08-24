<script lang="ts" setup>
import type { FormInstance, Rule, RuleObject } from 'antdv-next';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { message } from 'antdv-next';

defineOptions({
  name: 'AuthenticationLogin',
});
const info = reactive({
  codeLoginPath: '/auth/code-login',
  forgetPasswordPath: '/auth/forget-password',
  qrCodeLoginPath: '/auth/qrcode-login',
  registerPath: '/auth/register',
  showCodeLogin: true,
  showForgetPassword: true,
  showQrcodeLogin: true,
  showRegister: true,
  showRememberMe: true,
  showThirdPartyLogin: true,
  submitButtonText: '',
  subTitle: '',
  title: '',
});

const MOCK_USER_OPTIONS: any[] = [
  {
    label: 'Admin',
    value: 'admin',
  },
];
function captchaValidator(
  _rule: RuleObject,
  value: any,
  callback: (error?: string) => void,
) {
  value ? callback() : callback('error');
}
const LoginFormRules: Record<string, Rule[]> = {
  username: [{ required: true }],
  password: [{ required: true }],
  captcha: [{ validator: captchaValidator }],
};
const formSchema = reactive({
  selectAccount: '',
  username: '',
  password: '',
  captcha: false,
});

function handleChangeSelectAccount(value: string) {
  const findUser = MOCK_USER_OPTIONS.find((item) => item.value === value);
  if (findUser) {
    formSchema.username = findUser.value;
    formSchema.password = 'admin123';
  }
}

const router = useRouter();

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || '';

const rememberMe = ref(!!localUsername);
const formRef = ref<FormInstance>();
function handleSubmit() {
  formRef.value
    ?.validate()
    .then((values) => {
      localStorage.setItem(
        REMEMBER_ME_KEY,
        rememberMe.value ? values.username : '',
      );
    })
    .catch(() => {
      message.error('Validate only failed');
    });
}
function handleGo(path: string) {
  router.push(path);
}
</script>

<template>
  <a-flex h-full bg-gray-100>
    <div flex="1"></div>
    <a-flex h-full align="center" justify="center" w-600px bg-white>
      <div w-400px p-30px @keydown.enter.prevent="handleSubmit">
        <a-form ref="formRef" :model="formSchema" :rules="LoginFormRules">
          <a-form-item name="selectAccount">
            <a-select v-model:value="formSchema.selectAccount" :options="MOCK_USER_OPTIONS"
              @change="handleChangeSelectAccount" />
          </a-form-item>
          <a-form-item name="username">
            <a-input v-model:value="formSchema.username" />
          </a-form-item>
          <a-form-item name="password">
            <a-input v-model:value="formSchema.password" type="password" />
          </a-form-item>
        </a-form>

        <div v-if="info.showRememberMe || info.showForgetPassword" class="mb-6 flex justify-between">
          <div class="flex-center">
            <a-checkbox v-if="info.showRememberMe" v-model:checked="rememberMe" name="rememberMe">
              记住账号
            </a-checkbox>
          </div>

          <span v-if="info.showForgetPassword" class="vben-link text-sm font-normal"
            @click="handleGo(info.forgetPasswordPath)">

          </span>
        </div>
        <a-button aria-label="login" type="primary" block @click="handleSubmit">
          登 录
        </a-button>
      </div>
    </a-flex>

  </a-flex>
</template>
