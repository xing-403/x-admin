import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
  logout as logoutApi,
  refreshToken as refreshTokenApi,
  getInfo,
  login as loginApi,
  type LoginParams,
  type UserInfoVo,
} from '#/api/auth';
import { useLocalStorage } from '@vueuse/core';

export const useUserStore = defineStore('user', () => {
  /** 访问令牌 */
  const token = useLocalStorage<string>('access_token', null);
  const refresh_token = useLocalStorage<string>('refresh_token', null);
  /** 用户信息（含 roles / permissions） */
  const userInfo = ref<UserInfoVo | null>(null);

  const hasToken = computed(() => !!token.value);
  const hasRefreshToken = computed(() => !!refresh_token.value);

  const roles = computed(() => userInfo.value?.roles ?? []);
  const permissions = computed(() => userInfo.value?.permissions ?? []);
  /** 用户昵称/账号展示 */
  const nickname = computed(
    () => userInfo.value?.user?.nickName ?? userInfo.value?.user?.userName ?? '',
  );

  function setToken(value: string) {
    token.value = value;
  }
  function setRefreshToken(value: string) {
    refresh_token.value = value;
  }

  /** 登录：调用接口并保存 token */
  async function login(data: LoginParams) {
    const vo = await loginApi(data);
    setToken(vo.access_token);
    setRefreshToken(vo.refresh_token);
    return vo;
  }

  /** 拉取用户信息 */
  async function fetchUserInfo() {
    const info = await getInfo();
    userInfo.value = info;
    return info;
  }
  async function refreshToken() {
    setToken('');
    const vo = await refreshTokenApi(refresh_token.value);
    setToken(vo.access_token);
    setRefreshToken(vo.refresh_token);
    return vo;
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
    setRefreshToken('');
  }

  return {
    token,
    refresh_token,
    userInfo,
    hasToken,
    hasRefreshToken,
    roles,
    permissions,
    nickname,
    login,
    fetchUserInfo,
    refreshToken,
    logout,
    reset,
  };
});
