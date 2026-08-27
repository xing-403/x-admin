import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { logout as logoutApi, getInfo, login as loginApi, type LoginParams, type UserInfoVo } from '#/api/auth';
import { setAuthToken } from '#/utils/request';

export const useUserStore = defineStore(
  'user',
  () => {
    /** 访问令牌 */
    const token = ref('');
    /** 用户信息（含 roles / permissions） */
    const userInfo = ref<UserInfoVo | null>(null);

    const roles = computed(() => userInfo.value?.roles ?? []);
    const permissions = computed(() => userInfo.value?.permissions ?? []);
    /** 用户昵称/账号展示 */
    const nickname = computed(() => userInfo.value?.user?.nickName ?? userInfo.value?.user?.userName ?? '');

    function setToken(value: string) {
      token.value = value;
      setAuthToken(value);
    }

    /** 登录：调用接口并保存 token */
    async function login(data: LoginParams) {
      const vo = await loginApi(data);
      setToken(vo.accessToken);
      return vo;
    }

    /** 拉取用户信息 */
    async function fetchUserInfo() {
      const info = await getInfo();
      userInfo.value = info;
      return info;
    }

    /** 退出登录（先请求后端，再清理本地状态） */
    async function logout() {
      try {
        if (token.value) await logoutApi();
      } finally {
        reset();
      }
    }

    /** 清空登录态 */
    function reset() {
      userInfo.value = null;
      setToken('');
    }

    return {
      token,
      userInfo,
      roles,
      permissions,
      nickname,
      login,
      fetchUserInfo,
      logout,
      reset,
    };
  },
  {
    persist: true,
  },
);
