<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'antdv-next';
import type { FormInstance, Rule } from 'antdv-next';
import { useI18n } from '#/locales';
import { useUserStore } from '#/store/modules/user';
import {
  getProfile,
  updatePassword,
  updateProfile,
  uploadAvatar,
  type ProfileVo,
} from '#/api/profile';

defineOptions({ name: 'Profile' });

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const savingBasic = ref(false);
const savingPwd = ref(false);
const uploadingAvatar = ref(false);
const profile = ref<ProfileVo | null>(null);

/** 基本资料表单 */
const basicFormRef = ref<FormInstance>();
const basicForm = reactive({
  nickName: '',
  phoneNumber: '',
  email: '',
  gender: '2',
});

const genderOptions = [
  { label: t('profile.male'), value: '0' },
  { label: t('profile.female'), value: '1' },
  { label: t('profile.unknown'), value: '2' },
];

const basicRules: Record<string, Rule[]> = {
  nickName: [
    { required: true, message: t('profile.nickNameRequired'), trigger: 'blur' },
    { max: 30, message: t('profile.nickNameTooLong'), trigger: 'blur' },
  ],
  phoneNumber: [
    { required: true, message: t('profile.phoneRequired'), trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: t('profile.phoneInvalid'),
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: t('profile.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('profile.emailInvalid'), trigger: 'blur' },
  ],
};

/** 修改密码表单 */
const pwdFormRef = ref<FormInstance>();
const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const pwdRules: Record<string, Rule[]> = {
  oldPassword: [
    { required: true, message: t('profile.oldPasswordRequired'), trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: t('profile.newPasswordRequired'), trigger: 'blur' },
    { min: 5, max: 20, message: t('profile.newPasswordLength'), trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: t('profile.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (_rule: Rule, value: string) => {
        if (value !== pwdForm.newPassword) {
          return Promise.reject(new Error(t('profile.confirmPasswordMismatch')));
        }
        return Promise.resolve();
      },
      trigger: 'blur',
    },
  ],
};

async function loadProfile() {
  loading.value = true;
  try {
    profile.value = await getProfile();
    const user = profile.value.user;
    basicForm.nickName = user.nickName ?? '';
    basicForm.phoneNumber = user.phoneNumber ?? '';
    basicForm.email = user.email ?? '';
    basicForm.gender = user.gender ?? '2';
  } finally {
    loading.value = false;
  }
}

async function handleSaveBasic() {
  try {
    await basicFormRef.value?.validate();
  } catch {
    return;
  }
  savingBasic.value = true;
  try {
    await updateProfile({
      nickName: basicForm.nickName,
      phoneNumber: basicForm.phoneNumber,
      email: basicForm.email,
      gender: basicForm.gender,
    });
    message.success(t('profile.updateSuccess'));
    // 同步用户 store 中的昵称，保证右上角展示即时更新
    if (userStore.userInfo?.user) {
      userStore.userInfo.user.nickName = basicForm.nickName;
    }
    await loadProfile();
  } finally {
    savingBasic.value = false;
  }
}

async function handleSavePwd() {
  try {
    await pwdFormRef.value?.validate();
  } catch {
    return;
  }
  savingPwd.value = true;
  try {
    await updatePassword({
      oldPassword: pwdForm.oldPassword,
      newPassword: pwdForm.newPassword,
    });
    message.success(t('profile.pwdSuccess'));
    // 密码已变更，安全起见要求重新登录
    await userStore.logout();
    router.push('/login');
  } finally {
    savingPwd.value = false;
  }
}

/** 选择头像文件后：校验 -> 上传 OSS -> 更新个人信息 */
async function beforeAvatarUpload(file: File) {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error(t('profile.avatarTypeInvalid'));
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error(t('profile.avatarSizeInvalid'));
    return false;
  }
  uploadingAvatar.value = true;
  try {
    const oss = await uploadAvatar(file);
    await updateProfile({ avatar: Number(oss.ossId) });
    message.success(t('profile.avatarSuccess'));
    // 同步用户 store，保证右上角展示即时更新
    if (userStore.userInfo?.user) {
      userStore.userInfo.user.avatar = Number(oss.ossId);
      userStore.userInfo.user.avatarUrl = oss.url;
    }
    await loadProfile();
  } catch {
    // 异常已由请求拦截器统一提示
  } finally {
    uploadingAvatar.value = false;
  }
  // 返回 false 阻止 a-upload 自动上传，由我们手动上传
  return false;
}

onMounted(loadProfile);
</script>

<template>
  <Page>
    <a-flex vertical gap="middle">
      <!-- 用户信息卡 -->
      <a-card :loading="loading">
        <a-flex align="center" gap="large">
          <a-upload
            :show-upload-list="false"
            accept="image/*"
            :before-upload="beforeAvatarUpload"
          >
            <div class="avatar-uploader">
              <a-avatar :size="72" :src="profile?.user.avatarUrl || undefined">
                <template #icon>
                  <SvgIcon name="UserOutlined" />
                </template>
              </a-avatar>
              <div class="avatar-uploader-mask">
                <SvgIcon v-if="!uploadingAvatar" name="CameraOutlined" />
                <a-spin v-else size="small" />
              </div>
            </div>
          </a-upload>
          <a-flex vertical gap="small">
            <a-flex align="center" gap="small">
              <span text-lg font-semibold>{{ profile?.user.nickName || profile?.user.userName }}</span>
              <a-tag v-if="profile?.roleGroup" color="blue">{{ profile?.roleGroup }}</a-tag>
            </a-flex>
            <a-flex gap="large" text-sm color="var(--muted-foreground)">
              <span>{{ t('profile.account') }}：{{ profile?.user.userName }}</span>
              <span v-if="profile?.user.deptName">{{ t('profile.dept') }}：{{ profile?.user.deptName }}</span>
              <span v-if="profile?.user.loginDate">{{ t('profile.lastLoginTime') }}：{{ profile?.user.loginDate }}</span>
            </a-flex>
          </a-flex>
        </a-flex>
      </a-card>

      <!-- 基本资料 / 修改密码 -->
      <a-card :loading="loading">
        <a-tabs>
          <a-tab-pane key="basic" :tab="t('profile.basicInfo')">
            <a-form
              ref="basicFormRef"
              :model="basicForm"
              :rules="basicRules"
              layout="vertical"
              max-w-480px
            >
              <a-form-item :label="t('profile.nickName')" name="nickName">
                <a-input v-model:value="basicForm.nickName" allow-clear />
              </a-form-item>
              <a-form-item :label="t('profile.phone')" name="phoneNumber">
                <a-input v-model:value="basicForm.phoneNumber" :maxlength="11" allow-clear />
              </a-form-item>
              <a-form-item :label="t('profile.email')" name="email">
                <a-input v-model:value="basicForm.email" allow-clear />
              </a-form-item>
              <a-form-item :label="t('profile.gender')" name="gender">
                <a-radio-group v-model:value="basicForm.gender">
                  <a-radio v-for="item in genderOptions" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" :loading="savingBasic" @click="handleSaveBasic">
                  {{ t('profile.save') }}
                </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>

          <a-tab-pane key="pwd" :tab="t('profile.changePassword')">
            <a-form
              ref="pwdFormRef"
              :model="pwdForm"
              :rules="pwdRules"
              layout="vertical"
              max-w-480px
            >
              <a-form-item :label="t('profile.oldPassword')" name="oldPassword">
                <a-input-password v-model:value="pwdForm.oldPassword" />
              </a-form-item>
              <a-form-item :label="t('profile.newPassword')" name="newPassword">
                <a-input-password v-model:value="pwdForm.newPassword" />
              </a-form-item>
              <a-form-item :label="t('profile.confirmPassword')" name="confirmPassword">
                <a-input-password v-model:value="pwdForm.confirmPassword" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" :loading="savingPwd" @click="handleSavePwd">
                  {{ t('profile.save') }}
                </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-flex>
  </Page>
</template>

<style scoped>
.avatar-uploader {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-radius: 50%;
}

.avatar-uploader-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 22px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-uploader:hover .avatar-uploader-mask {
  opacity: 1;
}
</style>
